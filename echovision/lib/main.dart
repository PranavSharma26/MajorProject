import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:vibration/vibration.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:permission_handler/permission_handler.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Echovision',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        appBarTheme: const AppBarTheme(backgroundColor: Colors.blue),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<StatefulWidget> createState() => HomeState();
}

class HomeState extends State<HomePage> {
  final FlutterTts flutterTts = FlutterTts();
  final FlutterBlue flutterBlue = FlutterBlue.instance;
  BluetoothDevice? connectedDevice;
  bool isScanning = false;

  Future<void> speak(String text) async {
    await flutterTts.speak(text);
  }

  Future<void> connectToDevice() async {
    if (isScanning) return; // Prevent multiple scans
    setState(() {
      isScanning = true;
    });

    // Check if Bluetooth is enabled
    if (!await flutterBlue.isOn) {
      speak("Bluetooth is not enabled");
      setState(() {
        isScanning = false;
      });
      return;
    }

    // Request location permission
    var status = await Permission.location.request();
    if (!status.isGranted) {
      speak("Location permission is required to scan for Bluetooth devices");
      setState(() {
        isScanning = false;
      });
      return;
    }

    // Start scanning
    flutterBlue.startScan(timeout: const Duration(seconds: 4));

    // Listen to scan results
    flutterBlue.scanResults.listen((results) {
      for (ScanResult result in results) {
        if (result.device.name == 'ESP32-CAM') {
          // Stop scanning
          flutterBlue.stopScan();

          // Connect to the device
          result.device.connect().then((_) {
            setState(() {
              connectedDevice = result.device;
              isScanning = false;
            });
            speak("Connected to ESP32-CAM");
            Vibration.vibrate(duration: 100);
          }).catchError((error) {
            setState(() {
              isScanning = false;
            });
            speak("Failed to connect to ESP32-CAM");
            print("Connection error: $error");
          });
        }
      }
    }, onError: (error) {
      setState(() {
        isScanning = false;
      });
      speak("Error scanning for devices");
      print("Scan error: $error");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Echovision',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Large Button for External Camera
            Semantics(
              button: true,
              label: 'Connect to External Camera',
              child: GestureDetector(
                onTap: () async {
                  await speak("Connecting to External Camera");
                  Vibration.vibrate(duration: 100);
                  await connectToDevice();
                  print('External Camera Tapped');
                },
                child: Container(
                  width: 200,
                  height: 250,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Colors.cyan, Colors.green],
                    ),
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: const Center(
                    child: Text(
                      'Connect to External Camera',
                      style: TextStyle(color: Colors.white, fontSize: 18),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Additional Button for Device Camera
            Semantics(
              button: true,
              label: 'Open Device Camera',
              child: GestureDetector(
                onTap: () async {
                  await speak("Opening Device Camera");
                  print('Device Camera Tapped');
                },
                child: Container(
                  width: 200,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Colors.blue, Colors.purple],
                    ),
                    borderRadius: BorderRadius.circular(50),
                  ),
                  child: const Center(
                    child: Text(
                      'Open Device Camera',
                      style: TextStyle(color: Colors.white, fontSize: 18),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}