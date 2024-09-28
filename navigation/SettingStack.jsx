import React ,{useState,useEffect,useContext}from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import {Colors} from '../constants/Colors';
import MenuScreen from '../screens/MenuScreen';
import Profile from '../screens/Profile'; 
import ThemeScreen from '../screens/ThemeScreen'; 
import NotificationsSetting from '../screens/NotificationsSetting';
import SecurityScreen from '../screens/SecurityScreen'; 
import PersonalDataPrivacyScreen from '../screens/PersonalDataPrivacyScreen';

const Stack = createStackNavigator();

const SettingStack = () => {
    const { theme } = useContext(ThemeContext);
    const navigation=useNavigation();
  return (
    <Stack.Navigator
      
     screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[theme].background,  // Background based on theme
        },
        headerTintColor: theme==='light' ? '#555555' : '#fff',  // Color of the header title and icons
      })}
      >
      <Stack.Screen name="Menu" component={MenuScreen} 
      options={{ 
         headerTitle: 'Settings',
         headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back-outline"  // Use an arrow-back icon instead of the drawer icon
                size={24}
                color= {theme==='light' ? '#555555' : "white"}
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          ),
      }} 
      />
      <Stack.Screen name="UserProfile" component={Profile} options={{ title: 'Profile' }} />
      <Stack.Screen name="Theme" component={ThemeScreen} options={{ title: 'Theme' }} />
      <Stack.Screen name="NotificationsSetting" component={NotificationsSetting} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Security" component={SecurityScreen} options={{ title: 'Security' }} />
      <Stack.Screen name="PersonalDataPrivacy" component={PersonalDataPrivacyScreen} options={{ title: 'Privacy & Data' }} />
    </Stack.Navigator>
  );
};

export default SettingStack;
