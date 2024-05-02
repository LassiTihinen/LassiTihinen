import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';

const HomeScreen = ({ user, handleLogout }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.sidebar}>
          <Button title="Log Out" onPress={handleLogout} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome {user.email}</Text>
          <Text style={styles.subtitle}>Placeholder Images:</Text>
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/111.jpg')} style={styles.image} />
            <Image source={require('../../assets/123.jpg')} style={styles.image} />
            <Image source={require('../../assets/234.jpeg')} style={styles.image} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexDirection: 'row',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  content: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
});

export default HomeScreen;