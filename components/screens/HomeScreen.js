import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import Banner from '../Banner';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ user, handleLogout, navigation }) => {
  console.log('Entered HomeScreen');
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar />
      <View style={styles.content}>
      <Banner appName='Urheilusuoritukset' />
        <Text style={styles.title}>Tervetuloa {user.email}!</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Askelmittari')}>
            <MaterialIcons name="directions-walk" size={70} color="black" />
            <Text style={styles.iconButtonText}>Askelmittari</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Lenkkiseuranta')}>
            <MaterialIcons name="map" size={70} color="black" />
            <Text style={styles.iconButtonText}>Treeni kartalla</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Lenkkihistoria')}>
            <MaterialIcons name="history" size={70} color="black" />
            <Text style={styles.iconButtonText}>Lenkkihistoria</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={40} color="white" />
          <Text style={styles.logoutButtonText}>Kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  iconContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButtonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;

