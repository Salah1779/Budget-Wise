
import React,{useEffect,useState,useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
  
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors'; // Colors from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import { CommonActions } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../helpers/AsynchOperation';
import { useNavigation } from '@react-navigation/native';


const {width ,height} = Dimensions.get('window');
const CustomDrawer = props => {
  const navigation=useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] =useState('');


  const {theme} = useContext(ThemeContext);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await getData('userToken');
        if (userToken && userToken.user) {
          setImage(userToken.user.image);
          setFirstName(userToken.user.name);
          setLastName(userToken.user.lastname);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
    
  }, []);

  const signOut = async () => {
    try {
      const isGoogleLogin = await getData('googleLogin'); 
      if(isGoogleLogin) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      await AsyncStorage.removeItem('userToken');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Log' }],
        })
      );
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };


  return (
    <View style={{flex: 1,backgroundColor:Colors[theme].background}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: Colors[theme].background,zIndex:10}}>
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Profile')}>
            <ImageBackground
              source={require('../assets/images/wallpaper.jpg')}
              style={{height: 150 ,justifyContent: 'center',alignItems: 'flex-start'}}>
                
              <View style={[styles.profileContainer]}>
              <Image
                source={image ?{uri:image} :require('../assets/images/profile-pic.jpg')}
                style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
              />
              <View>
                  <Text
                    style={[{ color: '#fff',  },styles.fullname]}>
                    {firstName}{'\n'}{lastName}
                   
                  </Text>
                  <Text style={[styles.brand]}>
                    Budget Wise
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        <View style={{flex: 1, backgroundColor:Colors[theme].background , paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: theme === 'light' ? '#ccc' : '#ccc'}}>
        <TouchableOpacity style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="share-social-outline" size={22} color={'#888'} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                color: '#888',
                fontFamily:'Poppins-Regular',
              }}>
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{paddingVertical: 15}} onPress={signOut}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} color={'red'} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
                color: 'red',
                fontFamily:'Poppins-Regular',
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      </DrawerContentScrollView>

    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  profileContainer: {
    paddingLeft:20,
    flexDirection: 'row',
    gap:10,
    justifyContent: 'center',
    
    
  },
  brand: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 5,
    fontFamily:'Poppins-Regular',
    fontStyle: 'italic',

  },
  fullname:
  {
    overflow:'hidden',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
   
  }
})