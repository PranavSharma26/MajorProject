import React from "react";
import StartScreen from "./StartScreen";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <StartScreen onStart={() => navigation.navigate("Explore")} />
  );
}
