import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import StepCounter from './screens/StepCounter';
import MapScreen from './screens/MapScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();
console.log("App Navigator active");
const AppNavigator = ({ user, handleAuthentication, email, setEmail, password, setPassword, isLogin, setIsLogin }) => {
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {props => <HomeScreen {...props} user={user} handleLogout={handleAuthentication} />}
          </Stack.Screen>
          <Stack.Screen name="Askelmittari" component={StepCounter} options={{ headerShown: true }} />
          <Stack.Screen name="Lenkkiseuranta" component={MapScreen} options={{headerShown: true}}/>
          <Stack.Screen name='Lenkkihistoria' component={HistoryScreen} options={{headerShown: true}}/>
        </>
      ) : (
        <Stack.Screen name="Auth" options={{ headerShown: false }}>
          {() => (
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
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};
export default AppNavigator;