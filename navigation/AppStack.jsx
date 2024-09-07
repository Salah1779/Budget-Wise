import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionSpecs } from '@react-navigation/native-stack'; 
import { ThemeContext } from '../context/ThemeContext';
import Colors from '../constants/Colors';


// Screens
import Home from '../screens/Home';
 import Profile from '../screens/Profile';
// import Notification from '../screens/Notification';
// import ExpenseScreen from '../screens/ExpenseScreen';

const Stack = createNativeStackNavigator();
const customTransitionSpec = {
  open: {
    animation: 'timing',
    config: {
      duration: 90, // Customize the duration here
    },
  },
  close: {
    animation: 'timing',
    config: {
      duration: 90, // Customize the duration here
    },
  },
};
const AppStack = () => {
  const { theme } = useContext(ThemeContext);

  return (
   
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        transitionSpec: customTransitionSpec,
        animation: 'slide_from_right',
 
        headerStyle: {
          backgroundColor: theme === 'light' ? '#001a33' : 'lightgrey',
        },
        headerTintColor: theme === 'light' ? 'white' : 'black', // Adjust text color for header
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false,
          
         }}
      />
       <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: true, title: 'Profile' }}
      />
      {/* <Stack.Screen
        name="Notifications"
        component={Notification}
        options={{ headerShown: true, title: 'Notifications' }}
      />
      <Stack.Screen
        name="ExpenseScreen"
        component={ExpenseScreen}
        options={{ headerShown: true, title: 'Expenses' }}
      />  */}
    </Stack.Navigator>
   
  );
};

export default AppStack;
