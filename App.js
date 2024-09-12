import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SplashScreen from "./screens/SplashScreen";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Driver_Tracking_Screen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [LocationRefresh, setLocationRefresh] = useState(null);
  const [currentHeading, setCurrentHeading] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => { 
      const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        // let { status } = await Location.requestBackgroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
        setLocationRefresh(Math.round(location.coords.latitude*10000)*Math.round(location.coords.longitude*10000));

        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 10);
      };
    

      getLocation();

    } , 100);

    return () => clearInterval(intervalId);

  }, [LocationRefresh]);

  useEffect(() => {
    const intervalId = setInterval(() => { 
      const getHeading = async () => {
        
        let location = await Location.getCurrentPositionAsync({});
        // console.log(Math.round(location.coords.heading));
        setCurrentHeading(location.coords.heading);
      };
    
      getHeading();

    } , 100);

    return () => clearInterval(intervalId);

  }, [Math.round(currentHeading/22.5)]);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <View style={styles.title}>
            <Image source={require('./assets/icon.png')} style={styles.icon} />
            <Text style={styles.heading}>BoGeo</Text>
            <Image source={require('./assets/icon.png')} style={styles.icon} />
          </View>
          <Text style={styles.text}>This is your current location.</Text>
          {!!currentLocation ? <Text style={styles.text}>{Math.round(currentLocation.latitude*10000)/10000}, {Math.round(currentLocation.longitude*10000)/10000} </Text> : <Text></Text>}
          <Text style={styles.text}>This is your current heading.</Text>
          {!!currentHeading ? <Text style={styles.text}>{Math.round(currentHeading)}</Text> : <Text></Text>}
          {initialRegion && (
            // <MapView style={styles.map} initialRegion={initialRegion}>
            
            <MapView 
              style={styles.map} 
              region={{...currentLocation, latitudeDelta: 0.005, longitudeDelta: 0.005}}
              provider={PROVIDER_GOOGLE}>
              {currentLocation && (
                <Marker
                  rotation={currentHeading}
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  flat={true}
                  title="Your Location">
                    {!!currentHeading ? <Image source={require('./assets/arrow-up-hi.png')} style={styles.markerArrow} /> : <Image source={require('./assets/adaptive-icon.png')} style={styles.markerArrow} />}
                </Marker>

              )}
            </MapView>
            
          )}
          {/* Rest of your code */}

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
  },
  map: {
    width: "90%",
    height: "80%",
  },
  heading: {
    fontSize: 50,
    color: "white",
  },
  text: {
    padding: 3,
    fontSize: 15,
    color: "white",
  },
  markerArrow: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  icon: {
    width: 50,
    height: 50,
  }
});

export default Driver_Tracking_Screen;