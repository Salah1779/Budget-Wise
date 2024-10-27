import React, { useEffect, useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, AppState } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Colors } from './constants/Colors';
import { storeData, getData } from './helpers/AsynchOperation';
import { AppProvider, ThemeContext } from './context/ThemeContext';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import Log from './screens/Log';
import AppStack from './navigation/AppStack';
import Login from './screens/Login';
import ChooseCurrency from './screens/ChooseCurrency';
import PinFingerPrint from './screens/PinFingerPrint';

const Stack = createNativeStackNavigator();

function AppContent() {
 
  const { theme, setTheme, setSystemChosen, currency, setCurrency } = useContext(ThemeContext);
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const checkPinEnabled = async () => {
      const pinEnabled = await getData('pinEnabled');
      setIsPinEnabled(!!pinEnabled);
     
    };

    checkPinEnabled();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkPinEnabled(); // Re-check when app comes to foreground
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove(); // Clean up the listener on unmount
    };
  }, []); 
  

  const getTheme = async () => {
    const theme = await getData("theme");
    setTheme(theme || "light");
  };

  const getCurrency = async () => {
    const currency = await getData("currency");
    setCurrency(currency || "$");
  };

  const getSystemChosen = async () => {
    const system = await getData("systemChosen");
    setSystemChosen(system || false);
  };

  useEffect(() => {
    const getItemFinish = async () => {
      try {
        const launch = await getData("Finish");
        storeData("Finish", launch !== null);
      } catch (e) {
        console.error('Error retrieving Finish:', e);
      }
    };

    getItemFinish();
    getTheme();
    getSystemChosen();
    getCurrency();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Stack.Navigator
      initialRouteName={isPinEnabled && appState === 'killed' ? 'Pin' : 'SplashScreen'}
      
      
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pin"
          component={PinFingerPrint}
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
          options={{ headerShown: false,animation:'fade_from_bottom',
               
           }
          
            
           }
        />
        <Stack.Screen
          name="ChooseCurrency"
          component={ChooseCurrency}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="AppStack"
          component={AppStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
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
    <AppProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
