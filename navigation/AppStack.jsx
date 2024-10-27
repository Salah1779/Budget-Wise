import React, { useContext ,useState,useCallback} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation,CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useWindowDimensions,TouchableOpacity,View,TextInput,LayoutAnimation } from 'react-native';
import CustomDrawer from '../components/CustomDrawer';
import { ThemeContext  } from '../context/ThemeContext';
import { BudgetProvider,ExpenseProvider } from '../context/CalculContext';
import {Colors} from '../constants/Colors';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import ExpenceScreen from '../screens/ExpenceScreen'
import FileImportScreen from '../screens/FileImportScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingStack from './SettingStack';

const HomeScreen=() => (
    <BudgetProvider >
        <Home />
    </BudgetProvider>
)

const ExpenseScreen = () => (
  <ExpenseProvider>
    <ExpenceScreen />
  </ExpenseProvider>
)

const Drawer = createDrawerNavigator();
const AppStack = () => {
  const { theme,setTheme,
         searchQuery,setSearchQuery,
         isSearching,setIsSearching} = useContext(ThemeContext);
  const navigation = useNavigation();
  

  const { width } = useWindowDimensions();  

  try {
    return (
      <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[theme].background,  // Background based on theme
        },
        headerTintColor: theme==='light' ? '#555555' : '#fff',  // Color of the header title and icons
        drawerActiveBackgroundColor: Colors[theme].secondaryButton,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: theme === 'light' ? 'gray' : 'lightgrey',
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'Poppins-Regular',
          fontSize: width > 400 ? 16 : 15,
        },
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
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
          headerShown: false,  // Hide header for Home screen if necessary
        }}
      />
       <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
          
          
        
        }}
      />
      <Drawer.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings',{screen:'NotificationsSetting'});

              }
                
              }  
            >
              <Ionicons
                name='settings'
                size={22}
                color={theme === 'light' ? 'gray' : 'lightgrey'}
                style={{ marginRight: 20 }}
              />
            </TouchableOpacity>
          ),
      
          
        
        }}
      />
     
      <Drawer.Screen
        name="Expenses"
        component={ExpenseScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="cash" size={22} color={color} />
          ),
         
        }}
      />

   <Drawer.Screen
        name="Import file"
        component={FileImportScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="upload" size={22} color={color} />
          ),
         
        }}
      />

        <Drawer.Screen
        name="Settings"
        component={SettingStack}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      /> 
    </Drawer.Navigator>
    
    );
  } catch (error) {
    console.error('Error rendering Drawer Navigator:', error);
    return null;
  }
};

export default AppStack;



