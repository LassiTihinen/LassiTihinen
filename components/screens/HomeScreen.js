import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import Banner from '../Banner';

const HomeScreen = ({ user, handleLogout, navigation}) => {
  console.log('Entered HomeScreen');
  console.log('Props received in HomeScreen:', { user, handleLogout, navigation }); // This line will log the props
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <StatusBar/>
      <View style={styles.content}>
        <Banner appName='Urheilusuoritukset'/>
        <Text style={styles.title}>Tervetuloa {user.email} !</Text>
        <Text style={styles.subtitle}>Tilapäiskuvat</Text>
        <View style={styles.imageContainer}>
        <View style={styles.imageButtonContainer}>
          <Image source={require('../../assets/1.png')} style={styles.image} />
          <TouchableOpacity style={styles.imageButton} onPress={() => navigation.navigate('StepCounter')}>

            <Text style={styles.imageButtonText}>Askelmittari</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageButtonContainer}>
          <Image source={require('../../assets/2.png')} style={styles.image} />
          <TouchableOpacity style={styles.imageButton} onPress={() => navigation.navigate('MapScreen')}>
            <Text style={styles.imageButtonText}>Treeni kartalla</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageButtonContainer}>
          <Image source={require('../../assets/3.png')} style={styles.image} />
          <TouchableOpacity style={styles.imageButton} onPress={() => navigation.navigate('HistoryScreen')}>
            <Text style={styles.imageButtonText}>Lenkkihistoria</Text>
          </TouchableOpacity>
        </View>
</View>
        <View style={styles.buttonContainer}>
          <Button title="Kirjaudu ulos" onPress={handleLogout} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#AAA',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
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
  buttonContainer: {
    marginTop: 20,
    borderRadius: 50,
    backgroundColor: 'red',
  },
  imageButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
