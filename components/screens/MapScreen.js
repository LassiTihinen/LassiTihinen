import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
    setCurrentPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const startTracking = async () => {
    setIsTracking(true);
    setTimer = (0);
    const watchId = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        console.log(location);
        const { latitude, longitude } = location.coords;
        const newCoordinate = { latitude, longitude };

        if (routeCoordinates.length > 0) {
          const distance = calculateDistance(routeCoordinates[routeCoordinates.length - 1], newCoordinate);
          setDistanceTravelled(distanceTravelled + distance);
        }

        setRouteCoordinates([...routeCoordinates, newCoordinate]);
      }
    );
    setLocationSubscription(await watchId);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (locationSubscription) {
      locationSubscription.remove();
    }
  };

  const calculateDistance = (from, to) => {
    // Simple approximation formula, replace with Haversine if needed
    return Math.sqrt(Math.pow(to.latitude - from.latitude, 2) + Math.pow(to.longitude - from.longitude, 2)) * 111.32 * 1000;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={currentPosition}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="red"
          />
        )}
      </MapView>
      <View style={styles.infoContainer}>
        <Text>Time: {timer}s</Text>
        <Text>Distance: {distanceTravelled.toFixed(2)} meters</Text>
        <TouchableOpacity onPress={isTracking ? stopTracking : startTracking} style={styles.button}>
          <Text style={styles.buttonText}>{isTracking ? 'Stop Activity' : 'Start Activity'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '50%',
    width: '100%',
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapScreen;