
// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import { Camera, CameraView } from 'expo-camera';

// export default function ESP32CamScreen() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [imageUri, setImageUri] = useState(null);
//   const cameraRef = useRef(null);

//   // Ask for camera permissions
//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   // Automatically take a picture every 5 seconds
//   useEffect(() => {
//     let interval;
//     if (hasPermission) {
//       interval = setInterval(async () => {
//         if (cameraRef.current) {
//           try {
//             const photo = await cameraRef.current.takePictureAsync();
//             setImageUri(photo.uri);
//           } catch (error) {
//             console.error('Error taking picture:', error);
//           }
//         }
//       }, 5000);
//     }
//     return () => clearInterval(interval);
//   }, [hasPermission]);

//   if (hasPermission === null) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.whiteText}>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (hasPermission === false) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>No access to camera</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} ref={cameraRef} />
//       {imageUri && (
//         <Image source={{ uri: imageUri }} style={styles.preview} />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   camera: { flex: 1 },
//   preview: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     width: 150,
//     height: 200,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   whiteText: { color: 'white', fontSize: 18 },
//   errorText: { color: 'red', fontSize: 18 },
// });



import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as Speech from 'expo-speech';

import { GEMINI_API_KEY } from '@env'; // importing key

import { GoogleGenAI } from '@google/genai'; // importing module

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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

  // Calling API with image in base64(Image Format which store image 37% less as compared to binary)
  const sendImageToGemini = async (base64) => {
    try {
      const imagePart = {
        inlineData: {
          data: base64,
          mimeType: "image/jpeg",
        },
      };

      console.log("Sending response");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          imagePart,
          "Dont' give details just list critical  objects one word, Give me name of critical object which could harm the blind person tell me the position of object like left or right or just straight. Give in a single line (frame it properle in a sentence, like we are giving instructions), also give te directions and distance. Keep it short in 10 words.",
        ],
      });
      
      console.log("Gemini Response:", response.text);

      // converting text to speech
        Speech.speak(response.text, {
          language: "en",
          pitch: 1.0,
          rate: 1.0,
        });

    } catch (err) {
      console.error("Error sending image to Gemini:", err);
    }
  };

  // Automatically take a picture every 5 seconds
  useEffect(() => {
    let interval;
    if (hasPermission) {
      interval = setInterval(async () => {
        if (cameraRef.current) {
          try {
            const photo = await cameraRef.current.takePictureAsync({ base64: true });
            console.log(photo.uri);
            setImageUri(photo.uri);

            // Send directly to Gemini API
            await sendImageToGemini(photo.base64);
          } catch (error) {
            console.error('Error taking picture:', error);
          }
        }
      }, 30000);
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
