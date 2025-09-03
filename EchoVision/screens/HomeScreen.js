import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [ready, setReady] = useState(false); // triggers rendering after permission and device detection
  const cameraRef = useRef(null);

  const devices = useCameraDevices();
  // Select back camera explicitly
  const device = devices.back || Object.values(devices).find(d => d.position === "back");

  // Log available devices (for debugging)
  useEffect(() => {
    console.log("Available camera devices:", devices);
  }, [devices]);

  // Request camera permission
  useEffect(() => {
    (async () => {
      let status;
      if (Platform.OS === "android") {
        status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      } else {
        status = await Camera.requestCameraPermission();
      }

      const granted = status === PermissionsAndroid.RESULTS.GRANTED || status === "authorized";
      console.log("Camera permission granted:", granted);
      setHasPermission(granted);

      if (granted) {
        // small delay to allow devices to load
        setTimeout(() => setReady(true), 500);
      }
    })();
  }, []);

  // Show permission error
  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>Camera permission not granted</Text>
      </View>
    );
  }

  // Show loading indicator until device is ready
  if (!ready || !device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>Loading camera...</Text>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      </View>
    );
  }

  // Render live back camera feed
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      ref={cameraRef}
      photo={true}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  whiteText: { color: "#fff", fontSize: 18 },
});