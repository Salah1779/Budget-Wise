import React, { useEffect, useState ,useContext} from 'react';
import { Button, StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Colors } from '../constants/Colors';
import TermView from '../components/TermView';
import SignInButton from '../components/SignInButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData ,getData} from '../helpers/AsynchOperation';
import { ThemeContext } from '../context/ThemeContext';
import { ip } from '../constants/IPAdress';
export default function Log() {
  const { width } = useWindowDimensions();
  const { theme, setTheme} = useContext(ThemeContext);
  const navigation = useNavigation();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [firstCurrency, setFirstCurrency] = useState(false);
  
  useEffect(() => {
    const getItemSetcurrency = async () => {
      try {
        const launch = await getData("currency");
        const valueToStore = launch === null ? false : true;
        if(!valueToStore) storeData("currency", valueToStore);
        setFirstCurrency(valueToStore);
        console.log("currency", valueToStore);
      } catch (e) {
        console.error('Error retrieving  currency:', e);
      }
    };

    getItemSetcurrency();
  }, []);

 
 
  const fetchProfilePhoto = async (accessToken) => {
    try {
      const response = await fetch('https://people.googleapis.com/v1/people/me?personFields=photos', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile photo: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        // Return the first public photo URL
       // console.log('Profile photo URL:', data.photos[0].url);
        return data.photos[0].url;
      } else {
        console.warn('No photos found for the user.');
        return null; // No photos found
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return null; // Handle errors gracefully
    }
  };

  const signin = async () => {
    setLoading(true);
    
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
     // console.log(user);
      
      // Get access token
      const { accessToken } = await GoogleSignin.getTokens();
      
      // Fetch profile photo URL
      const profilePhotoUrl = await fetchProfilePhoto(accessToken);
      
      // Send user data to server
      const response = await fetch(`http://${ip}:5000/api/google-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.user.email,
          name: user.user.givenName,
          lastname: user.user.familyName,
          image: profilePhotoUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        }),
      });
     
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
        if (data.token) {
          
          await storeData('userToken', data);
          await storeData('googleLogin', 'true');
          
         firstCurrency!==false? navigation.replace('AppStack'): navigation.replace('ChooseCurrency');
        } else {
          console.log('No token received.');
          
        }
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
       
      }
    } catch (e) {
      console.error('Sign-in error:', e);
      
    } finally {
      setLoading(false);
    }
  };
  
2
  return (
    <>
    <View style={[ {flex:1, backgroundColor: Colors[theme].secondaryButton }]}>
      <View style={[styles.container, { flex: 0.3 }]}>
        <Image
          source={require('../assets/logo.png')} // Replace with your logo path
          style={[
            styles.logo,
            {
              height: width <= 200 ? 100 : width <= 400 ? 165 : 185,
              width: width <= 200 ? 100 : width <= 400 ? 155 : 175,
            },
          ]}
        />
      </View>

      <View style={[styles.container, { flex: 0.8, backgroundColor: Colors[theme].background ,borderTopLeftRadius:30,borderTopRightRadius:30}]}>
        <Text style={{ color: Colors[theme].header, fontSize: 24, fontWeight: 'bold', marginHorizontal: 20, textAlign: 'center', marginBottom: 50 }}>
          Sign up below to create a secure account
        </Text>

        <SignInButton signin={signin}  icon ="google-plus" size={24}  colorIcon="#EA4335" label="CONNECT WITH GOOGLE" buttonColor="#EA4335"/>
        <SignInButton   icon ="facebook-f" size={24}  label="CONNECT WITH FACEBOOK" />

         
        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
          <Text style={{ color: Colors[theme].text, textAlign: 'center' }}>  Already have an account? </Text>
          <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
             <Text style={{ color: '#4CAF50', textDecorationLine: 'underline', fontWeight: '600' }}>LOG IN </Text>
          </TouchableOpacity>
         
            
  
        </View>
          
       {loading && <ActivityIndicator animating={true} size='large' color={ Colors[theme].secondaryButton} />}
      </View>

      <TermView />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
});
