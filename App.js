import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import AppNavigator from './components/AppNavigator';
import {app} from './components/FirebaseCfg'

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
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
    <NavigationContainer>
      <AppNavigator
        user={user}
        handleAuthentication={handleAuthentication}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
    </NavigationContainer>
  );
}

