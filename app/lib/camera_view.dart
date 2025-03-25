import 'package:flutter/material.dart';

class CameraViewPage extends StatefulWidget {
  const CameraViewPage({super.key});
  @override
  State<StatefulWidget> createState() => CameraViewState();
}

class CameraViewState extends State<CameraViewPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Camera View',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
        ),
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Column(
            children: [
              Text('Next Page')
            ],
          )
        ],
      )
    );
  }
}
