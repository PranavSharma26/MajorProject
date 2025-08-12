import React from "react";
import {View,Text,Pressable,StyleSheet} from 'react-native';
import * as Speech from 'expo-speech';

export default function StartScreen({onStart}){
    const handleStart = () =>{
        Speech.speak('App started.');
        if(onStart) onStart();
    };
    return (
        <View style={styles.container}>
            <Pressable 
                accessibilityLabel="Start"
                accessible={true}
                onPress={handleStart}
                style={({pressed})=>[
                    styles.button,
                    pressed && styles.buttonPressed
                ]}
            >
                <Text style={styles.buttonText}>Start</Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  button: { backgroundColor: '#007AFF', paddingVertical: 28, paddingHorizontal: 48, borderRadius: 16, elevation: 3 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#fff', fontSize: 26, fontWeight: '700' }
}); 