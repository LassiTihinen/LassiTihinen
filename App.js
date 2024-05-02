import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image} from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import Banner from './components/Banner';



const firebaseConfig = {
  apiKey: "AIzaSyAZkJQw0Gt8T5dtZmHpITUE05ZH20pLcWY",
  authDomain: "urheilusuoritukset.firebaseapp.com",
  projectId: "urheilusuoritukset",
  storageBucket: "urheilusuoritukset.appspot.com",
  messagingSenderId: "643379960314",
  appId: "1:643379960314:web:9351a4a24ea95921252c43",
  measurementId: "G-3WYDFM9K9Y"
};


const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {


  return (
    <View style={styles.authContainer}>
      <Banner appName="Urheilusuoritukset"/>
      <Image 
      source={require('./assets/wörkout.png')}
      style={[styles.image, {height:200, width:'100%'}]}
      />

       <Text style={styles.title}>{isLogin ? 'Kirjaudu' : 'Rekisteröidy'}</Text>

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
          <Button title={isLogin ? 'Kirjaudu' : 'Rekisteröidy'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Tarvitsetko tilin? Rekisteröidy' : 'Tili jo olemassa? Kirjaudu sisään'}
        </Text>
      </View>
    </View>
  );
}


const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Tervetuloa</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Kirjaudu ulos" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};
export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('Kirjauduttu ulos');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('Kirjauduttu sisään');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('Käyttäjä luotu');
        }
      }
    } catch (error) {
      console.error('Tapahtui virhe:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
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
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
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



/*

 

*/