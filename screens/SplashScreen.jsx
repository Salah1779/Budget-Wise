import React, { useEffect , useState,useContext} from "react";
import { View, Image, StyleSheet, ActivityIndicator , useWindowDimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/Colors";
import { getData } from "../helpers/AsynchOperation";
import { ThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import * as SecureStore from 'expo-secure-store';

const SplashScreen = () => {
 // const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions(); // Get the screen width
   
 
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear(); // Clears all items in AsyncStorage
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };



  useEffect(() => {
    // Simulate a loading process and navigate to the next screen after 2 seconds
    const timer = setTimeout( async () => {
        const finished = await getData("Finish");
        const signin = await getData("userToken");
     
         console.log ("finished: ",finished)
         console.log ("Sign In",signin)
              
        finished===false ? navigation.replace('OnboardingScreen') : signin!==null ? navigation.replace('AppStack') :
        navigation.replace('Log') ;
          
      
    }, 1200);


   //  clearAsyncStorage();

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={[styles.logo,{height: width <= 200 ? 100 : width <= 400 ? 165 : 185, width: width <= 200 ? 100 : width <= 400 ? 155 : 175,}] }
        />
         <ActivityIndicator size="large" color={Colors[theme].secondaryButton} style={styles.loader} />
        
         
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
   
  },
  loader: {
    position:'relative' ,
    top:'23%',
  },
});

export default SplashScreen;
