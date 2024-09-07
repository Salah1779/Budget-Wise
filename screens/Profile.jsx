import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, storeData } from '../helpers/AsynchOperation';

const Profile = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [userToken, setUserToken] = useState(null);
  const { width } = useWindowDimensions();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('N');
  const [hasPass, setHasPass] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [errorNewPass, setErrorNewPass] = useState('');
  const [errorConfirmedPass, setErrorConfirmedPass] = useState('');
  const [editLoading, setEditLoading] = useState(false); 
  // const [saveLoading, setSaveLoading] = useState(false);
  // const [logoutLoading, setLogoutLoading] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const handleBlurPass = (password = '', setError) => {
    if (password.trim().length < 6 && password.trim().length > 0) {
      setError('*Password must be at least 6 characters');
    } else if(password.length>0 && password.trim().length === 0) {
      setError('*Password can not contain only spaces');
    }
    else {

      setError('');
    }
  };

  const storePassword = async (newPassword) => {
    try {
      const userToken = await getData('userToken');
     
      if (!userToken ) {
        Alert.alert('Error', 'User is not authenticated. Please log in.');
        return;
      }
  
      const response = await fetch('http://192.168.11.104:4000/api/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken.token}`,
        },
        body: JSON.stringify({
          newPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', data.message);
        setConfirmPassword('');
        setPassword('');
        setNewPassword('');
        setErrorConfirmedPass('');
        setErrorNewPass('');
        setErrorPass('');
        await storeData('hasPass', true);
        console.log(data.message)
      } else {
        Alert.alert('Error', data.error );
        console.log(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  //verify actual password
  const verifyPassword = async () => {
    try {
      const userToken = await getData('userToken');
      const response = await fetch('http://192.168.11.104:4000/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken.token}`,
        },
        body: JSON.stringify({
          email: userToken.user.email,
          password: password,
        }),
      });
  
      // Check if the response is in JSON format
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text(); // Get response text if not JSON
        console.error('Expected JSON, but got:', text);
        Alert.alert('Error', 'Unexpected server response format.');
        return false;
      }
  
      const data = await response.json();
  
      if (response.ok) {
        setHasPass(true);
        return true;
      } else if (response.status === 401) {
        setErrorPass('*Wrong password');
      } else {
        Alert.alert('Error', data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
    return false;
  };
  
  const handleSave = async () => { 
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'First name and Last name are required.');
      return;
    }

    setEditLoading(true);
    try {
      const userToken = await getData('userToken');
      if (!userToken) {
        Alert.alert('Error', 'User is not authenticated. Please log in.');
        setEditLoading(false);
        return;
      }

      const response = await fetch('http://192.168.11.104:4000/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken.token}`,
        },
        body: JSON.stringify({
          name: firstName,
          lastname: lastName,
          gender,
          image: userToken.user.image,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await storeData('userToken', data);
        setEditLoading(false);
        navigation.replace('Home');
      } else {
        Alert.alert('Error', data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
    setEditLoading(false);
  };

  const changePassword = async () => {
    setErrorConfirmedPass('');
    setErrorNewPass('');
    console.log('save button clicked');
    try{
    if ((errorPass === '') && (password.length>0) )
    {
      if (!hasPass) {
        if (password === confirmPassword) {
         await storePassword(password);
          
        } else setErrorConfirmedPass('*Password does not match');
      } else {
         
        const isVerified = await verifyPassword();
        if (!isVerified) return;

        if ((newPassword.trim().length>0) && newPassword === confirmPassword) {
          await storePassword(newPassword);
        } else if(newPassword.length===0) {
          setErrorNewPass('*required field');
        }
        else setErrorConfirmedPass('*Password does not match');
      }
    }
    else if(password.length===0 ) setErrorPass('*required field');
  } catch (error) {
    console.error('Error updating password:', error);
  }
  };

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

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await getData('userToken');
        console.log(token);
        if (token) {
          setUserToken(token);
          setFirstName(token.user?.name || '');
          setLastName(token.user?.lastname || '');
          setEmail(token.user.email || '');
          setGender(token.user?.gender || '');
        }
      } catch (error) {
        console.error('Error fetching user token:', error);
      }
    };

    const checkHasPassword = async () => {
      const already = await getData('hasPass');
      setHasPass(!!already);
    };

    fetchUserToken();
    checkHasPassword();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave} // Directly reference your handleSave function
          // Adjust styling as needed
        >
          <Icon name="content-save-edit" size={width>400?28:24} color={Colors[theme].cardBackground}
          style={{ marginRight: 10 }}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation,firstName,lastName,gender]);

  const labelStyle = {
    fontSize: width * 0.03,
    fontFamily: 'Poppins-Regular',
    color: theme === 'light' ? '#888' : 'lightgrey',
    marginBottom: width * 0.01,
    fontStyle: 'italic',
    fontWeight: 'bold',
  };

  const inputStyle = (isFocused) => ({
    fontSize: width * 0.05,
    fontFamily: 'Poppins-Regular',
    color: theme === 'light' ? '#000' : 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'transparent',
    paddingBottom: width * 0.02,
    paddingHorizontal: width * 0.02,
    borderBottomWidth: isFocused ? 2 : 1,
    borderBottomColor: isFocused ? 'lightblue' : 'rgba(136, 136, 136, 0.13)',
    marginBottom: width * 0.02,
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[theme].background }]} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
        <Image
          style={[styles.profileImage, { width: width * 0.26, height: width * 0.26, borderRadius: width * 0.13 }]}
          source={userToken?.user?.image ? { uri: userToken.user.image } : require('../assets/images/profile-pic.jpg')}
        />
        
        <View style={styles.profileInfo}>
          <View style={styles.profileName}>
            <Text style={labelStyle}>First name</Text>
            <TextInput
              style={inputStyle(isFirstNameFocused)}
              value={firstName}
              editable={true}
              selectionColor='lightblue'  
              onChangeText={setFirstName}
               keyboardType="default"
               onFocus={() => setIsFirstNameFocused(true)}
               onBlur={() => setIsFirstNameFocused(false)}
            />
             {!firstName.trim().length && <Text style={{ color: 'red', fontSize:width*0.03 , fontStyle: 'italic',fontFamily: 'Poppins-Regular' }}>*required field</Text>}
          </View>

          <View style={styles.profileName}>
            <Text style={labelStyle}>Last name</Text>
            <TextInput
              style={inputStyle(isLastNameFocused)}
              value={lastName}
              editable={true}
              selectionColor='lightblue'  
              onChangeText={setLastName}
              keyboardType="default"
              onFocus={() => setIsLastNameFocused(true)}
              onBlur={() => setIsLastNameFocused(false)}
            />
            {!lastName.trim().length && <Text style={{ color: 'red', fontSize:width*0.03 , fontStyle: 'italic',fontFamily: 'Poppins-Regular' }}>*required field</Text>}
          </View>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.inputSection}>
        <View style={styles.userInfo}>
          <Text style={labelStyle}>Email</Text>
          <TextInput
            style={[inputStyle(false), { opacity: 0.5 }]}
            value={email}
            editable={false}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={labelStyle}>Select gender</Text>
          {/* <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={inputStyle}
            mode="dropdown"
          >
            <Picker.Item label="None" value="None" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker> */}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={[styles.saveText, { fontSize: width * 0.04 }]}>LOGOUT</Text>
        </TouchableOpacity>

        {/* Password Change */}
        <Text style={[styles.sectionTitle, { fontSize: width * 0.048, fontFamily: 'Poppins-SemiBold', color: Colors[theme].header }]}>PASSWORD CHANGE</Text>
        <View style={styles.userInfo}>
          <TextInput
            style={[inputStyle(isPasswordFocused)]}
            placeholder="Password"
            placeholderTextColor='rgba(136, 136, 136, 0.3)'
            secureTextEntry
            value={password}
            selectionColor='lightblue'  
            onFocus={() => setIsPasswordFocused(true)}
            onChangeText={setPassword}
            onBlur={() => {handleBlurPass(password, setErrorPass); setIsPasswordFocused(false);}}
          />
          {errorPass.length > 0 && <Text style={[styles.error, { fontSize: width * 0.03 }]}>{errorPass}</Text>}
        </View>

        {/* New Password Input - Conditional Rendering */}
        {hasPass && (
          <View style={styles.userInfo}>
            <TextInput
              style={inputStyle(isNewPasswordFocused)}
              placeholder="New password"
              placeholderTextColor='rgba(136, 136, 136, 0.3)'
              secureTextEntry
              value={newPassword}
              selectionColor='lightblue'  
              onChangeText={setNewPassword}
              onFocus={() => setIsNewPasswordFocused(true)}
              onBlur={() => {handleBlurPass(newPassword, setErrorNewPass); setIsNewPasswordFocused(false);}}
            />
            {errorNewPass.length > 0 && <Text style={[styles.error, { fontSize: width * 0.03 }]}>{errorNewPass}</Text>}
          </View>
        )}

        <View style={styles.userInfo}>
          <TextInput
            style={inputStyle(isConfirmPasswordFocused)}
            placeholder="Confirm your password"
            placeholderTextColor='rgba(136, 136, 136, 0.3)'
            secureTextEntry
            value={confirmPassword}
            selectionColor='lightblue'  
            onChangeText={setConfirmPassword}
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() =>{if(confirmPassword.length==0) 
                            setErrorConfirmedPass('')
                          setIsConfirmPasswordFocused(false)
                          }}
          />
          {errorConfirmedPass.length > 0 && <Text style={[styles.error, { fontSize: width * 0.03 }]}>{errorConfirmedPass}</Text>}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: Colors[theme].secondaryButton }]} onPress={changePassword}>
          <Text style={[styles.saveText, { fontSize: width * 0.04 }]}>CHANGE PASSWORD</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    padding: 20,
  },
  profileImage: {},
  inputSection: {
    padding: 20,
    paddingTop: 10,
    gap: 20,
  },
  profileName: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#EB5757',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
   
  },
  error: {
    color: 'red',
    fontStyle: 'italic',
    marginTop: 0,
    marginBottom: 13,
    marginLeft: 13,
  },
});
