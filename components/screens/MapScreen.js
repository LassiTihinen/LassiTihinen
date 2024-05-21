import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';
import { db } from '../../components/FirebaseCfg';
import { collection, addDoc } from 'firebase/firestore';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';

const MapScreen = () => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [skippedReadings, setSkippedReadings] = useState(0);
  const [lastCoordinate, setLastCoordinate] = useState(null);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [stepSubscription, setStepSubscription] = useState(null);

  const mapViewRef = useRef(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    setCurrentPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer(prevTime => prevTime + 1);
    }, 1000);
    setTimerId(id);
  };

  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} t : ${minutes < 10 ? '0' : ''}${minutes} m : ${seconds < 10 ? '0' : ''}${seconds} s`;
    } else if (minutes > 0) {
      return `${minutes} m : ${seconds < 10 ? '0' : ''}${seconds} s`;
    } else {
      return `${seconds} s`;
    }
  };

  const getTotalTimeInMinutes = (totalSeconds) => {
    return totalSeconds / 60;
  };

  const startTracking = async () => {
    console.log("Activity started");
    setIsTracking(true);
    setTimer(0);
    setDistanceTravelled(0);
    setRouteCoordinates([]);
    setCurrentStepCount(0);
    startTimer();

    const watchId = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 1,
    }, (location) => {
      console.log('New location:', location);
      const { latitude, longitude, accuracy } = location.coords;
      const newCoordinate = { latitude, longitude };

      if (accuracy > 20) {
        console.log('Location accuracy too low, skipping this update.');
        setSkippedReadings(prev => prev + 1);
        console.log('Total skipped updates:', { skippedReadings })
        return;
      }

      setRouteCoordinates(prevCoords => {
        const updatedCoords = [...prevCoords, newCoordinate];
        console.log('Updated route coordinates:', updatedCoords);
        calculateTotalDistance(updatedCoords);
        return updatedCoords;
      });

      setLastCoordinate(newCoordinate);
    });
    setLocationSubscription(watchId);

    const stepSub = Pedometer.watchStepCount(result => {
      console.log('New step detected:', result.steps);
      setCurrentStepCount(result.steps);
    });

    setStepSubscription(stepSub);
  };

  const captureMapView = async () => {
    try {
      const uri = await captureRef(mapViewRef, {
        format: 'png',
        quality: 0.8,
      });
      return uri;
    } catch (error) {
      console.error('Failed to capture map view:', error);
    }
    return null;
  };

  const stopTracking = async () => {
    Alert.alert(
      "Treenin lopetus",
      "Oletka varma että haluat tallentaa treenisi?",
      [
        {
          text: "Ei",
          onPress: () => console.log("Activity data not saved"),
          style: "cancel"
        },
        {
          text: "Kyllä",
          onPress: async () => {
            const snapshot = await captureMapView();
            if (snapshot) {
              await saveActivityData(snapshot);
            } else {
              console.error("Failed to capture map snapshot.");
            }
          }
        }
      ],
      { cancelable: false }
    );

    console.log("Activity ended");
    setIsTracking(false);
    stopTimer();

    if (locationSubscription) {
      locationSubscription.remove();
    }

    if (stepSubscription) {
      stepSubscription.remove();
    }
  };

  const saveActivityData = async (snapshot) => {
    try {
      await addDoc(collection(db, 'activities'), {
        avgTimePerKm: timer, // Send total time in seconds
        date: new Date().toLocaleDateString(),
        distanceTravelled: distanceTravelled.toFixed(2),
        totalTime: formatTime(timer),
        steps: currentStepCount,
        mapSnapshot: snapshot
      });
      console.log("Activity data saved successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const calculateTotalDistance = (coordinates) => {
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      totalDistance += calculateDistance(coordinates[i], coordinates[i + 1]);
    }
    totalDistance = Math.round(totalDistance * 100) / 100;
    setDistanceTravelled(totalDistance);
    console.log(`Total distance travelled: ${totalDistance} meters`);
  };

  const calculateDistance = (from, to) => {
    const rad = x => x * Math.PI / 180;
    const R = 6378137;
    const dLat = rad(to.latitude - from.latitude);
    const dLong = rad(to.longitude - from.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(from.latitude)) * Math.cos(rad(to.latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        region={currentPosition}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={3}
            strokeColor='blue'
          />
        )}
      </MapView>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <MaterialIcons name="timer" size={60} color="black" />
          <Text style={styles.infoText}>{formatTime(timer)}</Text>
        </View>
        <View style={styles.infoBox}>
          <MaterialIcons name="directions-walk" size={60} color="black" />
          <Text style={styles.infoText}>{distanceTravelled.toFixed(2)} metriä</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="footsteps" size={60} color="black" />
          <Text style={styles.infoText}>Askeleet: {currentStepCount}</Text>
        </View>

        <TouchableOpacity onPress={isTracking ? stopTracking : startTracking} style={styles.button}>
          <Text style={styles.buttonText}>{isTracking ? 'Lopeta treeni' : 'Aloita treeni'}</Text>
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
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 20,
    flex: 1,
    textAlign: 'right',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center'
  },
});

export default MapScreen;
