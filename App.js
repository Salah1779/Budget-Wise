import React, { useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Colors } from './constants/Colors';
import { storeData, getData } from './helpers/AsynchOperation';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import Log from './screens/Log';
import AppStack from './navigation/AppStack';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { theme } = useContext(ThemeContext); // Use useContext to get theme

  useEffect(() => {
    const getItemFinish = async () => {
      try {
        const launch = await getData("Finish");
        const valueToStore = launch === null ? false : true;
        storeData("Finish", valueToStore);
        console.log("Finish", valueToStore);
      } catch (e) {
        console.error('Error retrieving Finish:', e);
      }
    };

    getItemFinish();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Log"
            component={Log}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '236489703485-2a6brd8v97jr5m0ab7ba3s855mioua5o.apps.googleusercontent.com',
    });
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
