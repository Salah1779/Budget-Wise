

import React, { useContext ,useState,useCallback} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation,CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useWindowDimensions,TouchableOpacity,View,TextInput,LayoutAnimation } from 'react-native';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import ExpenceScreen from '../screens/ExpenceScreen'
import CustomDrawer from '../components/CustomDrawer';
import { ThemeContext } from '../context/ThemeContext';
import {Colors} from '../constants/Colors';
import NotificationScreen from '../screens/NotificationScreen';
import SettingStack from './SettingStack';


const Drawer = createDrawerNavigator();
const AppStack = () => {
  const { theme,setTheme,
         expenceList,setExpenceList,
         filteredList,setFilteredList ,
         searchQuery,setSearchQuery,
         isSearching,setIsSearching} = useContext(ThemeContext);
  const navigation = useNavigation();
  

  const { width } = useWindowDimensions();
 


  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = expenceList.filter((expence) => {
      return (expence.article?.toLowerCase() || '').includes(text.toLowerCase());
    });
    
    // Update the filteredList state with the new filtered array
    setFilteredList(filtered);
  };
  

  const toggleSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Smooth transition
    setIsSearching(!isSearching);
    if(!isSearching )  setSearchQuery('') ;
  };

  

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
        component={Home}
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
                navigation.navigate('NotificationsSetting');

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
        name="Expences"
        component={ExpenceScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="cash" size={22} color={color} />
          ),
          headerTitle: isSearching?'':'Expenses',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
             {isSearching && 
             <TextInput
                placeholder="Search..."
                placeholderTextColor= {theme==='light' ? 'rgba(85, 85, 85, 0.5)' : 'rgba(229, 228, 226, 0.5)'}
                onChangeText={(text) => handleSearch(text)}
                style={{
                  paddingHorizontal: 10,
                  width: width*0.6,
                  marginRight: 10,
                  color: theme === 'light' ? '#555555' : "lightgrey", // adjust based on theme if needed
                }}
              />}
              <TouchableOpacity onPress={toggleSearch}>
                <Ionicons name="search-outline" size={24} color={theme === 'light' ? '#555555' : "lightgrey"} style={{ marginRight: 15 }} />
              </TouchableOpacity>
            </View>
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



