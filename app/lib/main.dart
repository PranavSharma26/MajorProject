import 'package:app/camera_view.dart';
import 'package:flutter/material.dart';
import 'package:app/network_utils.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Echo Vision',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<StatefulWidget> createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    Future<void> _checkWifiAndConnect() async {
      bool isConnected = await NetworkUtils.isConnectedToWifi();
      if (isConnected) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Already Connected to Wifi')),
        );
        Navigator.push(context, MaterialPageRoute(builder: (context)=> CameraViewPage()));
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Please Connect to Wifi')));
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'EchoVision',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
        ),
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/Background.jpg"),
            fit: BoxFit.cover,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  height: 230,
                  width: 230,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blueAccent.withAlpha(220),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(105),
                        side: BorderSide(color: Colors.lightBlue, width: 10),
                      ),
                    ),
                    onPressed: () {
                      print("Button Pressed");
                      _checkWifiAndConnect();
                    },
                    child: Text(
                      'Connect to Camera',
                      style: TextStyle(color: Colors.white, fontSize: 17),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
