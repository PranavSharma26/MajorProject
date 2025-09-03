import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import Tts from "react-native-tts";
// import { GoogleGenerativeAI } from "@google/generative-ai"; ❌ not RN safe

// Later, handle Gemini API through your backend instead of RN

export default function ESP32CamScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  // Request permissions
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);

  // Take photo every 30s
  useEffect(() => {
    let count = 0;
    let interval;
    if (hasPermission && device && cameraRef.current) {
      interval = setInterval(async () => {
        try {
          console.log("Taking picture:", count++);
          const photo = await cameraRef.current.takePhoto({
            qualityPrioritization: "quality",
          });
          console.log("Captured:", photo.path);
          setImageUri("file://" + photo.path);

          // ✅ Instead of Gemini, just do TTS for testing
          Tts.speak("Photo captured.");
        } catch (error) {
          console.error("Error taking picture:", error);
        }
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [hasPermission, device]);

  // Loading states
  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        ref={cameraRef}
        photo={true}
      />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  preview: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 150,
    height: 200,
    borderWidth: 2,
    borderColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  whiteText: { color: "white", fontSize: 18 },
  errorText: { color: "red", fontSize: 18 },
});