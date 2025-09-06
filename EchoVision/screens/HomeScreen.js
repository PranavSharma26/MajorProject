import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator, TouchableOpacity } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [ready, setReady] = useState(false); 
  const [isActive, setIsActive] = useState(false);
  const [buffer, setBuffer] = useState(null);
  const cameraRef = useRef(null);

  const devices = useCameraDevices();
  const device = devices.back || Object.values(devices).find(d => d.position === "back");

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
      setHasPermission(granted);

      if (granted) setTimeout(() => setReady(true), 500);
    })();
  }, []);

  // Capture loop
  useEffect(() => {
    let interval;
    if (isActive && cameraRef.current) {
      interval = setInterval(async () => {
        try {
          const photo = await cameraRef.current.takePhoto({
            qualityPrioritization: "speed",
            skipMetadata: true,
          });
          setBuffer(photo.path);
          console.log("Captured:", photo.path);
        } catch (e) {
          console.error("Capture error:", e);
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>Camera permission not granted</Text>
      </View>
    );
  }

  if (!ready || !device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>Loading camera...</Text>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isActive && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          ref={cameraRef}
          photo={true}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsActive(!isActive)}
      >
        <Text style={styles.buttonText}>{isActive ? "Stop" : "Start"}</Text>
      </TouchableOpacity>

      {buffer && (
        <Text style={styles.bufferText}>Last buffer path: {buffer}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  whiteText: { color: "#fff", fontSize: 18 },
  button: {
    position: "absolute",
    bottom: 50,
    width: 200,           // button width
    height: 70,           // button height
    backgroundColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,         // larger text
    fontWeight: "bold",
  },
  bufferText: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    color: "white",
    fontSize: 14,
  },
});