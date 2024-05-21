import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../components/FirebaseCfg';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const HistoryScreen = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'activities'));
        const activitiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched activities:", activitiesData); // Log fetched data
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleDelete = (activityId) => {
    Alert.alert(
      "Poista treeni",
      "Haluatko varmasti poistaa tämän treenin?",
      [
        {
          text: "Ei",
          style: "cancel"
        },
        {
          text: "Kyllä",
          onPress: async () => {
            try {
              // Delete from Firestore
              await deleteDoc(doc(db, 'activities', activityId));
              // Delete from frontend
              setActivities(activities.filter(activity => activity.id !== activityId));
              console.log("Activity deleted successfully");
            } catch (error) {
              console.error("Failed to delete activity:", error);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {activities.map((activity) => (
        <View key={activity.id} style={styles.card}>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(activity.id)}>
            <MaterialIcons name="close" size={24} color="red" />
          </TouchableOpacity>
          <Text style={styles.title}>{activity.date}</Text>
          {activity.mapSnapshot ? (
            <Image
              style={styles.mapImage}
              source={{ uri: activity.mapSnapshot }}
            />
          ) : (
            <Text style={styles.info}>Kuvaa ei saatavilla</Text>
          )}
          <View style={styles.infoBox}>
            <MaterialIcons name="timer" size={24} color="black" />
            <Text style={styles.info}>Lenkkiaika: {activity.totalTime}</Text>
          </View>
          <View style={styles.infoBox}>
            <MaterialIcons name="directions-walk" size={24} color="black" />
            <Text style={styles.info}>Matkan pituus: {activity.distanceTravelled}m</Text>
          </View>
          <View style={styles.infoBox}>
            <MaterialIcons name="speed" size={24} color="black" />
            <Text style={styles.info}>Aika kilometriä kohden: {activity.avgTimePerKm}</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="footsteps" size={24} color="black" />
            <Text style={styles.info}>Askeleet: {activity.steps}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    position: 'relative' // Make the card position relative
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  mapImage: {
    width: 300,
    height: 200,
    marginVertical: 10
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'flex-start', // Ensure items are aligned to the start
    width: '100%' // Ensure the infoBox takes the full width
  },
  info: {
    fontSize: 16,
    marginLeft: 10
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10
  }
});

export default HistoryScreen;
