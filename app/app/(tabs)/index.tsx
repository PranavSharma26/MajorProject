import React, {useState} from "react";
import {View,Text} from 'react-native';
import StartScreen from '../../screens/StartScreen';
import ESP32CamScreen from '../../screens/ESP32CamScreen';
export default function Home(){
  const [started,setStarted] = useState(false);
  if(!started){
    return <StartScreen onStart={()=>setStarted(true)}/>;
  }
  return <ESP32CamScreen />;
}