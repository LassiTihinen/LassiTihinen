import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const HistoryScreen = ({ navigation }) => {
    console.log("Entered HistoryScreen");
  const activities = [
    {
      id: 1,
      date: "15.5 Wednesday",
      totalTime: "35 minutes",
      distanceTravelled: "7",
      avgTimePerKm: "5 minutes/km",
      routeSnapshotUrl: "URL_TO_STATIC_MAP_IMAGE"
    },
    {
      id: 2,
      date: "10.5 Saturday",
      totalTime: "45 minutes",
      distanceTravelled: "7.5",
      avgTimePerKm: "6 minutes/km",
      routeSnapshotUrl: "URL_TO_STATIC_MAP_IMAGE"
    },
    {
      id: 3,
      date: "20.5 Monday",
      distanceTravelled: "3.33",
      totalTime: "20 minutes",
      avgTimePerKm: "6 minutes/km",
      routeSnapshotUrl: "URL_TO_STATIC_MAP_IMAGE"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {activities.map(activity => (
        <View key={activity.id} style={styles.card}>
          <Text style={styles.title}>{activity.date}</Text>
          <Image style={styles.mapImage} source={{ uri: activity.routeSnapshotUrl }} />
          <Text style={styles.info}>Total Distance: {activity.distanceTravelled} kilometers</Text>
          <Text style={styles.info}>Total Time: {activity.totalTime} minutes</Text>
          <Text style={styles.info}>Average Time Per Km: {activity.avgTimePerKm}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center'
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
  info: {
    fontSize: 16
  }
});

export default HistoryScreen;