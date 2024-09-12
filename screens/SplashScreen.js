import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BoGeo</Text>
      <Image source={require('../assets/icon.png')} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000", 
  },
  title: {
    fontSize: 65,
    color: "#ffffff",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.1)", 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  icon: {
    width: 200,
    height: 200,
    margin: 10,
  }
});