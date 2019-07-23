#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "BlackWalnut";
const char* password = "blackwalnut";
const char* mqtt_server = "123.57.249.92";
int _auto = 0;
int work[5] = {0};
int lightness = 50;
int people = 0;
int pin1=18;
int pin2=19;
int pin3=21;
int pin4=22;
int pin5=23;

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {

  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  int count = 0; //显示接收到的message
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] : ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  //将接收到的message分成三类进行处理
  if (strcmp(topic, "light_control") == 0){
    _auto = (char)payload[1] - '0';
    int j = 0;
    for (int i=3; i<12; i=i+2){
      if (i%2 == 1){
        work[j++] = (char)payload[i] - '0';
      }
    }
  }
  else if (strcmp(topic, "Lightness") == 0){
    lightness = 0;
    for (int i = 0; i < length; i++) {
      lightness = lightness * 10 + (char)payload[i] - '0';
    }
  }
  else {
    people = (char)payload[0] - '0';
  }
  //将接收到的数据通过control_light函数来控制灯泡
  control_light(pin1, work[0], _auto);
  control_light(pin2, work[1], _auto);
  control_light(pin3, work[2], _auto);
  control_light(pin4, work[3], _auto);
  control_light(pin5, work[4], _auto);
  //返回显示灯泡状态的message帮助Flutter调控
  if (strcmp(topic, "Lightness") == 0){
    char _work[15]; int i, cnt=0;
    _work[cnt++] = '[';
    _work[cnt++] = _auto + '0';
    for (i = 0; i < 5; i++){
      _work[cnt++] = ',';
      _work[cnt++] = work[i] + '0';
    }
    _work[cnt++] = ']';
    _work[cnt] = '\0';
    client.publish("light_state", _work);
  }
  delay(50);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.publish("esp32", "connect");
      client.subscribe("light_control");
      client.subscribe("people");
      client.subscribe("Lightness");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void control_light(int pin, int state, int _auto){
  pinMode(pin, OUTPUT);
  if (_auto == 1){ //由传感器数据控制灯泡开关
    if (people == 1 && lightness <=20 && state == 1){
      digitalWrite(pin, HIGH);
    }
    else {
      digitalWrite(pin, LOW);
    }
  } //熄灭所有的灯泡
  else if (_auto == 9){
    digitalWrite(pin, LOW); 
  } //由输入的灯泡状态来控制灯泡
  else if (state == 1){
    digitalWrite(pin, HIGH);
  }else {
    digitalWrite(pin, LOW);
  }
}


void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
}
