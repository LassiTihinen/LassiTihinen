import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, StatusBar } from 'react-native';
import Banner from '../Banner';

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <StatusBar/>
      <Banner appName="Urheilusuoritukset"/>
      <Image 
        source={require('../../assets/wörkout.png')}
        style={[styles.image, {height: "35%", width: "100%"}]}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Sähköposti"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Salasana"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Kirjaudu' : 'Rekisteröidy'} onPress={handleAuthentication} color="black" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Tarvitsetko tilin? Rekisteröidy' : 'Tili jo olemassa? Kirjaudu sisään'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '100%',
    height:'100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 19,
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    padding:10,
  },
});

export default AuthScreen;