
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

export default function ESP32CamScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);

  // Ask for camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Automatically take a picture every 5 seconds
  useEffect(() => {
    let interval;
    if (hasPermission) {
      interval = setInterval(async () => {
        if (cameraRef.current) {
          try {
            const photo = await cameraRef.current.takePictureAsync();
            setImageUri(photo.uri);
          } catch (error) {
            console.error('Error taking picture:', error);
          }
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [hasPermission]);

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.whiteText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  preview: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 150,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  whiteText: { color: 'white', fontSize: 18 },
  errorText: { color: 'red', fontSize: 18 },
});
