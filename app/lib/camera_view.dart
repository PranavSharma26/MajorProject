import 'package:flutter/material.dart';
import 'package:flutter_mjpeg/flutter_mjpeg.dart';

class CameraViewPage extends StatelessWidget {
  const CameraViewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'ESP32-CAM Live Feed',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
        ),
        backgroundColor: Colors.blue,
      ),
      body: Center(
        child: Mjpeg(
          stream: "http://192.168.147.185:81/stream", // Your ESP32-CAM URL
          isLive: true,
          error: (context, error, stackTrace) => 
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Text("Failed to load camera feed")
                  ]
                )
              ]
            ),
        ),
      ),
    );
  }
}
