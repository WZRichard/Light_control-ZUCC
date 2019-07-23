#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#define ADDR 0b0100011

WiFiClient espClient;
PubSubClient client(espClient);

const char* ssid = "BlackWalnut";
const char* password = "blackwalnut";
const char* mqtt_server = "123.57.249.92";
int PIR_sensor = D7;    //指定PIR模拟端口


void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(PIR_sensor, INPUT);   //设置PIR模拟端口为输入模式
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  Wire.begin();
  Wire.beginTransmission(ADDR);
  Wire.write(0b00000001);
  Wire.endTransmission();

  setup_wifi();
  client.setServer(mqtt_server, 1883);
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  int ppl = 0;            //存放人体感应数据
  int val = 0;           //存放光强感应数据
  static int cnt = 0;       //存放数据传输次数
  char msg[10];           //转化传感器数据格式
  //从传感器模块读出传感器数据
  ppl = analogRead(PIR_sensor); 
  Wire.beginTransmission(ADDR);
  Wire.write(0b00000111);
  Wire.endTransmission();
  Wire.beginTransmission(ADDR);
  Wire.write(0b00100000);
  Wire.endTransmission();
  delay(100);
  Wire.requestFrom(ADDR, 2); // 2byte every time
  for (val = 0; Wire.available() >= 1; ) {
    char c = Wire.read();
    val = (val << 8) + (c & 0xFF);
  }
  val = val / 1.2;
  //每三组光强数据上传一次
  if (cnt == 2){
    cnt = 0;  
    snprintf (msg, 10, "%d", val);
    Serial.print("Publish message1: ");
    Serial.println(msg);
    client.publish("Lightness", msg);
  }
  else {
    cnt++;
  }Serial.print("Publish message2: ");
  //
  if (ppl>800){
    Serial.println("someone");
    client.publish("people", "1");
  }else {
    Serial.println("no one");
    client.publish("people", "0");
  }
  delay(100);
}
