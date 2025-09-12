import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, Platform, PermissionsAndroid,
  ActivityIndicator, TouchableOpacity
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { loadTensorflowModel } from "react-native-fast-tflite";
import RNFS from "react-native-fs";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { toByteArray } from "react-native-quick-base64";
import Tts from "react-native-tts";

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [ready, setReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [buffer, setBuffer] = useState(null);
  const [results, setResults] = useState([]);
  const [model, setModel] = useState(null);
  const cameraRef = useRef(null);
  const intervalRef = useRef(null);

  const devices = useCameraDevices();
  const device = devices.back || Object.values(devices).find(d => d.position === "back");

  const classNames = [
    "animal", "autorickshaw", "bicycle", "bus", "car", "caravan",
    "motorcycle", "person", "rider", "traffic light", "traffic sign",
    "trailer", "train", "truck", "vehicle fallback"
  ];

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

  // Load TFLite model
  useEffect(() => {
    (async () => {
      try {
        const loadedModel = await loadTensorflowModel(require("../assets/finalbest_float32.tflite"));
        setModel(loadedModel);
        console.log("TFLite model loaded!");
      } catch (err) {
        console.error("Model load error:", err);
      }
    })();
  }, []);

  // Capture and predict function
  
  const captureAndPredict = async () => {
    if (!cameraRef.current || !model) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: "speed",
        skipMetadata: true,
      });
      console.log("Captured photo object:", photo);
      setBuffer(photo.path);

      // Resize to model input
      const resized = await ImageResizer.createResizedImage(photo.path, 192, 192, "JPEG", 100);

      // Read image as base64
      const base64String = await RNFS.readFile(resized.uri, "base64");

      // Convert base64 to Uint8Array
      const raw = toByteArray(base64String);

      // Convert to Float32 and normalize
      const floatInput = new Float32Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        floatInput[i] = raw[i] / 255.0;
      }

      // Wrap in array if model expects batch dimension
      const inputArray = [floatInput];

      // Run inference
      const output = await model.run(inputArray);
      console.log("Raw model output:", output);

      // Aggregate output per class
      let confidences = [];
      if (output && output.length > 0) {
        const obj = output[0];
        confidences = classNames.map((_, idx) => obj[idx] || 0);
      }

      confidences.sort();

      const mappedResults = confidences.map((conf, idx) => ({
        className: classNames[idx] || `class${idx}`,
        confidence: conf,
      })).filter(item => item.confidence > 0);

      setResults(mappedResults);

      // TTS speak detected objects
      if (mappedResults.length > 0) {
        mappedResults.sort((a, b) => b.confidence - a.confidence);
        console.log("Mappings:", mappedResults);
        
        mappedResults.splice(3);
        console.log("mappedRes", mappedResults);
        const detectedText = mappedResults.map(obj => `${obj.className} ${Math.round(obj.confidence)}`).join(", ");

        Tts.speak(`Detected: ${detectedText}`);
      } else {
        Tts.speak("No harmful objects detected");
      }

    } catch (err) {
      console.error("Capture/Inference error:", err);
    }
  };

  // Start/stop loop
  const toggleCamera = () => {
    if (isActive) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsActive(false);
      Tts.speak("Camera stopped");
    } else {
      setIsActive(true);
      Tts.speak("Camera started");
      // Wait 1 second before first capture
      
      Tts.speak("Detecting top 3 prior objects based on confidence, for now.");
      setTimeout(() => captureAndPredict(), 1000);
      intervalRef.current = setInterval(() => captureAndPredict(), 10000); // every 10s
    }
  };

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

      <TouchableOpacity style={styles.button} onPress={toggleCamera}>
        <Text style={styles.buttonText}>{isActive ? "Stop" : "Start"}</Text>
      </TouchableOpacity>

      {buffer && <Text style={styles.bufferText}>Last photo: {buffer.split("/").pop()}</Text>}

      <View style={{ position: "absolute", top: 50, alignSelf: "center" }}>
        {results.length > 0 ? (
          results.map((obj, idx) => (
            <Text key={idx} style={{ color: "#fff", fontSize: 16 }}>
              {obj.className}: {obj.confidence}
            </Text>
          ))
        ) : (
          isActive && <Text style={{ color: "#fff", fontSize: 16 }}>No harmful objects detected</Text>
        )}
      </View>
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
    width: 200,
    height: 70,
    backgroundColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  bufferText: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    color: "white",
    fontSize: 14,
  },
});