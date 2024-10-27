import React, { useState, useContext,useEffect } from 'react';
import { 
    View, 
    TextInput,
    Button,
    Text,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    ImageBackground,
    Platform ,
    Image,
    Alert,
    ActivityIndicator,
    Dimensions,
    }from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation } from '@react-navigation/native';
//import * as SecureStore from 'expo-secure-store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import CustomizedStatusBar from '../components/CustomizedStatusBar';
import { Colors } from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import Ionicon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icons from MaterialCommunityIcons
import { storeData,getData } from '../helpers/AsynchOperation';
import {ip} from '../constants/IPAdress.js';

const {width ,height}= Dimensions.get('window');
const Login = () => {
const navigation = useNavigation();
const {width} = useWindowDimensions();
  const {theme,setTheme} = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMail, setErrorMail] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [hiddenPass, setHiddenPass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);


  useEffect(() => {
    
    const getItemFinish = async () => {
      try {
        const launch = await getData("Finish");
        const valueToStore = launch === null ? false : true;
        storeData("Finish", valueToStore);
        setFinished(valueToStore);
        console.log("Finish", valueToStore);
      } catch (e) {
        console.error('Error retrieving Finish:', e);
      }
    };
    console.log("IP: ", ip);
    getItemFinish();
  }, []);

  const handleBlurMail = () => {
    const emailExp = /^\w+[0-9]*([\.-]?\w*[0-9]*)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     (!emailExp.test(email.trim()) && email.trim().length>0 ) ? setErrorMail('*Invalid email'):setErrorMail('');
      
  }
  const handleBlurPass = () => {
    if (password.length < 6 && password.length > 0) {
      setErrorPass('*Password must be at least 6 characters');
    } else {
      setErrorPass('');
    }
  };
  

  const handleLogin = async () => {
    // Reset error messages and set loading
    setErrorPass('');
    setErrorMail('');
    
    if (!email || !password) {
      setLoading(false);
      setErrorMail(email ? '' : '*Required');
      setErrorPass(password ? '' : '*Required');
      return;
    }
  
    setLoading(true);
    console.log(email, password);
    try {
      const response = await fetch(`http://${ip}:5000/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email : email.trim(), password }),
      });
  
      // Check if the response is OK
      if (response.ok) {
        const data = await response.json();
        await storeData('userToken', data); // Ensure the correct key for storing token
        await storeData('googleLogin', false);
        setLoading(false);
        navigation.replace('AppStack');
      } else {
        // Extract error message from response if available
        const errorData = await response.json();
        const errorMessage = errorData.error; // Fallback error message
        setErrorPass(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      // Handle network or unexpected errors
      setLoading(false);
      Alert.alert('Login failed', error.message || 'An error occurred. Please try again.');
    }
  };
  

const handelerHiddenPass = () => {
  setHiddenPass(!hiddenPass);
}
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
      console.log('Profile photo URL:', data.photos[0].url);
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

const signinGoogle = async () => {
 
  
  try {
    await GoogleSignin.hasPlayServices();
    const user = await GoogleSignin.signIn();
    //console.log(user);
    
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
      
      if (data.token) {
        console.log('Token:', data.token);
        await AsyncStorage.setItem('userToken', JSON.stringify(data));
        finished===true? navigation.replace('AppStack') : navigation.replace('ChooseCurrency');

      } else {
        console.log('No token received.');
        
      }
    } else {
      const errorData = await response.json();
      console.error('Server error:', errorData);
     
    }
  } catch (e) {
    console.error('Sign-in error:', e);
    
  }
};



  return (
        
    <ImageBackground
      style={{flex:1}}
      source={theme === 'light' ? require(`../assets/images/lightBackgroundSignIn.png`) : require(`../assets/images/darkBackgroundSignIn.png`)}
    >
         <CustomizedStatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor='transparent'
        translucent={true}
        hidden={true}
        animated={false}
      />
    <View style={[styles.container, {backgroundColor:'transparent'}]}>
        <Text style={[styles.title, 
            {color:Colors[theme].header, 
            fontSize:width<=400? 30: 33, 
            fontWeight:'bold', 
            marginTop: -50            
            }]}>

                Welcome Back!</Text>
        <Text style={[styles.title, {color:Colors[theme].text, marginBottom:90}]}>Sign in to your account</Text>
       
        <View style={styles.inputContainer}>
     
         <TextInput
            style={[styles.input, { backgroundColor: theme === 'light' ? 'white' : 'lightgray' }]}

            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={handleBlurMail}
            autoCapitalize='none'
          />
            {errorMail && <Text style={styles.error}>{errorMail}</Text> }
          <Ionicon style= {[styles.icon ]} name="mail-outline" size={22} color={Colors['light'].icon} />  
         
       </View>
        
        <View style={styles.inputContainer}>
           
            <TextInput
                style={[styles.input,{ backgroundColor: theme === 'light' ? 'white' : 'lightgray' }]}
                placeholder="Password"
                secureTextEntry={hiddenPass}
                value={password}
                onChangeText={setPassword}
                onBlur={handleBlurPass }
                autoCapitalize='none'
            />
             {errorPass && <Text style={styles.error}>{errorPass}</Text> }
            <SimpleLineIcons style= {[styles.icon ]} name="lock" size={22} color={Colors['light'].icon} />
            <Icon
             style= {{position:'absolute', top:12, right:13, opacity:0.2}}
              name={ !hiddenPass ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color= {Colors['light'].icon}
              onPress={handelerHiddenPass}

            />

            
            
        </View>
      
      <TouchableOpacity style={[styles.button, {backgroundColor:loading ? 'gray' : Colors[theme].primaryButton}]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In{' '} {loading && <ActivityIndicator size="small" color="white" />}</Text>
      </TouchableOpacity>
      
      <View style={styles.iconContainer}>
         <TouchableOpacity style={[styles.iconButton,{backgroundColor:theme==='light' ? 'white' : 'lightgray'}]} onPress={signinGoogle}>
            <Image
              style={styles.logIcon}
              source={require('../assets/images/googleIcon.webp')}
            />
         </TouchableOpacity>
         <TouchableOpacity style={[styles.iconButton,{backgroundColor:theme==='light' ? 'white' : 'lightgray'}]} onPress={signinGoogle}>
            <Image
              style={[styles.logIcon,{width: 28, height: 28,}]}
              source={require('../assets/images/facebook-circle-logo.png')}
            />
         </TouchableOpacity>
      </View>
      
    
    </View>
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    
  },
  input: {
    
    marginBottom: 12,
    borderRadius: 20,
    padding: 9,
    paddingLeft:40,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    
    
  },
  error: {
    color: 'red',
    fontStyle: 'italic',
    marginTop:-8,
    marginBottom:13 ,
    fontSize: 12,
    marginLeft: 13,
    
  },
  inputContainer: {
    marginBottom: 10,
  },
  icon: {
    position: 'absolute',
     top: 12,
    left: 10,
    opacity: 0.6,

  },
  title: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
 
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap:10,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
  logIcon: {
    width: 30,
    height: 30,
  },
  button: {
   
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
  },
  buttonText: {
    fontSize: width>=500?18:15,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default Login;

