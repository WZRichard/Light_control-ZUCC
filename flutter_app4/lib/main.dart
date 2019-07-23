import 'package:flutter/material.dart';
import 'package:mqtt_client/mqtt_client.dart' as mqtt;
import 'dart:async';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: '灯光控制系统原型',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: '灯光控制系统原型'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  //如果需要添加电器  修改 onTap 中重置的变量people lightness light_state
  //注意：添加的板子需要修改client.subscribe( 需要修改的内容 , mqtt.MqttQos.exactlyOnce);
  List<bool> judge = [true, true, true, true, true, true];
  int _check = 1;
  String work = '[1,1,1,1,1,1]';
  String people = 'people';
  String light_state = 'light_state';
  String lightness = 'Lightness';
  String _people = 'NULL';
  String _light = 'NULL';
  String control = 'light_control';
  String broker = '123.57.249.92';
  mqtt.MqttClient client;
  mqtt.MqttConnectionState connectionState;
  StreamSubscription subscription;

  @override
  void initState() {
    super.initState();
    _connect();
  }

  void pub() {
    work = "["; int i;
    for (i = 0; i < judge.length - 1; i++) {
      judge[i] == true ? work = work + "1," : work = work + "0,";
    }
    judge[i] == true ? work = work + "1]" : work = work + "0]";

    final mqtt.MqttClientPayloadBuilder builder = mqtt.MqttClientPayloadBuilder();
    builder.addString(work);
    client.publishMessage(
      control,
      mqtt.MqttQos.values[0],
      builder.payload,
      retain: false,
    );
  }

  void check(String data){
    int t=0;
    for (int i = 1; i<data.length; i = i + 2){
      data[i] == '1' ? judge[t++] = true : judge[t++] =false;
    }
    _check = 0;
  }

  Widget _button(String name, int cnt) {
    if (judge[0] == true) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          Text(name,
              style: TextStyle(
                fontSize: 0,
              )),
          IconButton(
            icon: Icon(Icons.brightness_high),
            disabledColor: Color(0),
            onPressed: null,
          ),
        ],
      );
    } else if (judge[cnt] == true) {
      // button.setEnabled(false);
      return Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          Text(name,
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: Colors.white)),
          IconButton(
            icon: Icon(Icons.brightness_high),
            color: Colors.amberAccent,
            onPressed: () {
              setState(() {
                judge[cnt] = !judge[cnt];
              });
              pub();
            },
          ),
        ],
      );
    } else {
      return Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          Text(name,
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: Colors.white)),
          IconButton(
            icon: Icon(Icons.brightness_high),
            color: Colors.black,
            onPressed: () {
              setState(() {
                judge[cnt] = !judge[cnt];
              });
              pub();
            },
          ),
        ],
      );
    }
  }


  Widget _show(String msg, String data) {
    return Column(
      mainAxisSize: MainAxisSize.max,
      children: <Widget>[
        ListTile(
          leading: Icon(Icons.flare, color: Colors.white),
          title: Text(
            msg,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
          ),
        ),
        Text(
          data,
          textAlign: TextAlign.right,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    Widget userHeader = UserAccountsDrawerHeader(
      decoration: new BoxDecoration(
        image: DecorationImage(
          image: AssetImage('images/nin.jpg' ),
          fit: BoxFit.cover,
        ),
      ),
      accountName: null,
      accountEmail: null,
    );

    return Container(
      decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage('images/back.jpg' ),
              fit: BoxFit.cover,
      )),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          title: Text(widget.title),
          centerTitle: true,
        ),
        body: Column(
          children: <Widget>[
            new SwitchListTile(
              secondary: const Icon(
                Icons.brightness_auto,
                color: Colors.white,
              ),
              title: Text('AUTO',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: Colors.white)),
              value: judge[0],
              onChanged: (bool newValue) {
                setState(() {
                  judge[0] = !judge[0];
                });
                pub();
              },
            ),
            Container(
              margin: const EdgeInsets.all(10.0),
              width: double.infinity,
              height: 100,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  _button("灯泡一", 1),
                  _button("灯泡二", 2),
                  _button("灯泡三", 3),
                  _button("灯泡四", 4),
                  _button("灯泡五", 5),
                ],
              ),
            ),
            _show('亮度：', _light),
            _show('是否有人经过：', _people),
          ],
        ),
        drawer: Drawer(
          child: ListView(
            padding: EdgeInsets.zero,
            children: <Widget>[
              userHeader, // 可在这里替换自定义的header
              ListTile(
                title: Text('大厅'),
                leading: new CircleAvatar(
                  child: new Icon(Icons.library_add),
                ),
                onTap: () {
                  people = 'people'; lightness = 'Lightness';  _people = 'NULL'; _light = 'NULL'; control = 'light_control'; _check = 1; String light_state = 'light_state';
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: Text('走廊'),
                leading: new CircleAvatar(
                  child: new Icon(Icons.library_books),
                ),
                onTap: () {
                  people = 'people_1'; lightness = 'Lightness_1';  _people = 'NULL'; _light = 'NULL'; control = 'light_control_1'; _check = 1;//
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: Text('花园'),
                leading: new CircleAvatar(
                  child: new Icon(Icons.library_music),
                ),
                onTap: () {
                  people = 'people_2'; lightness = 'Lightness_2';  _people = 'NULL'; _light = 'NULL'; control = 'light_control_1'; _check = 1;//
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _connect() async {
    //client连接的初始化配置
    //默认端口1883，如果不是1883就采用
    //client = mqtt.MqttClient.withPort(broker, '',1883);
    client = mqtt.MqttClient(broker, '');
    client.logging(on: true);
    client.keepAlivePeriod = 30;
    client.onDisconnected = _onDisconnected;

    final mqtt.MqttConnectMessage connMess = mqtt.MqttConnectMessage()
        .withClientIdentifier('wzw')
        .startClean()
        .keepAliveFor(30)
        .withWillTopic('willtopic')
        .withWillMessage('My Will message')
        .withWillQos(mqtt.MqttQos.atLeastOnce);
    print('MQTT client connecting....');
    client.connectionMessage = connMess;

    try {
      await client.connect();
    } catch (e) {
      print(e);
      _disconnect();
    }

    if (client.connectionState == mqtt.MqttConnectionState.connected) {
      print('MQTT client connected');
      setState(() {
        connectionState = client.connectionState;
      });
    } else {
      print('ERROR: MQTT client connection failed - '
          'disconnecting, state is ${client.connectionState}');
      _disconnect();
    }
    subscription = client.updates.listen(_onMessage);

    if (connectionState == mqtt.MqttConnectionState.connected) {
      setState(() {
        client.subscribe('people', mqtt.MqttQos.exactlyOnce);
        client.subscribe('Lightness', mqtt.MqttQos.exactlyOnce);
        client.subscribe('light_state', mqtt.MqttQos.exactlyOnce);
      });
    }
  }

  void _disconnect() {
    client.disconnect();
    _onDisconnected();
  }

  void _onDisconnected() {
    setState(() {
      connectionState = client.connectionState;
      client = null;
      subscription.cancel();
      subscription = null;
    });
    print('MQTT client disconnected');
  }

  void _onMessage(List<mqtt.MqttReceivedMessage> event) {
    print(event.length);
    final mqtt.MqttPublishMessage recMess =
        event[0].payload as mqtt.MqttPublishMessage;
    final String message =
        mqtt.MqttPublishPayload.bytesToStringAsString(recMess.payload.message);

    setState(() {
      if (event[0].topic == people) {
        message == "1" ? _people = '有人' : _people = '没人';
      } else if (event[0].topic == lightness) {
        _light = message;
      } else if (_check == 1 && event[0].topic == light_state ){
        check( message);
      }
    });
  }

}
