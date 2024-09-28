import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { getData, storeData } from '../helpers/AsynchOperation';
import { Colors } from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { clamp } from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

const PinScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState(null);
  const [confirmingPin, setConfirmingPin] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('Enter');

  useEffect(() => {
    const checkBiometricAuth = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        const biometryTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (biometryTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometryType('fingerprint');
        }
      }
    };

    const fetchStoredPin = async () => {
      const stored = await getData('pin');
      if (stored) setStoredPin(stored);
    };

    checkBiometricAuth();
    fetchStoredPin();
  }, []);

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      navigation.replace('AppStack');
    } else {
      Alert.alert('Authentication failed');
    }
  };

  const handlePinEntry = (value) => {
    if (pin.length < 4) {
      setPin(pin + value);
      setErrorMessage('');
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (!storedPin) {
        if (!confirmingPin) {
          setTitle('Confirm');
          setConfirmingPin(true);
        } else {
          storeData('pin', pin);
          navigation.navigate('AppStack');
        }
      } else {
        if (pin === storedPin) {
          navigation.replace('AppStack');
        } else {
          setErrorMessage('PIN mismatch!');
        }
      }
      setPin('');
    }
  }, [pin]);

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const renderKeyPad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      [biometryType, '0', 'backspace']
    ];

    return keys.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.keyRow}>
        {row.map((key) => {
          if (!isNaN(key)) {
            return (
              <TouchableOpacity key={key} style={[styles.numberButton]} onPress={() => handlePinEntry(key)} activeOpacity={0.5}>
                <Text style={[styles.numberText, { color: theme === 'light' ? 'grey' : 'lightgray' }]}>{key}</Text>
              </TouchableOpacity>
            );
          } else {
            switch (key) {
              case 'fingerprint':
                return biometryType ? (
                  <TouchableOpacity key={key} style={styles.numberButton} onPress={authenticate}>
                    <FontAwesome5 name="fingerprint" size={30} color={Colors[theme].header} />
                  </TouchableOpacity>
                ) : (
                  <View key={key} style={styles.numberButton} />
                );
              case 'backspace':
                return (
                  <TouchableOpacity key={key} style={styles.numberButton} onPress={handleBackspace}>
                    <MaterialIcons name="backspace" size={30} color={Colors[theme].header} />
                  </TouchableOpacity>
                );
              default:
                return null;
            }
          }
        })}
      </View>
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={[styles.logoContainer, { backgroundColor: Colors[theme].secondaryButton }]}>
        <MaterialIcons name="lock" size={clamp(width * 0.2, 85, 150)} color={theme === 'light' ? 'white' : '#D5D5D5'} />
      </View>
      <View style={[styles.pinContainer]}>
        <Text style={[styles.title, { color: theme === 'light' ? 'black' : 'gray' }]}> {title} your PIN</Text>
        <View style={styles.pinDots}>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.pinCircle,
                {
                  backgroundColor: pin.length > index ? Colors[theme].secondaryButton : 'transparent',
                  borderWidth: pin.length > index ? 0 : 1,
                }
              ]}
            />
          ))}
        </View>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={[styles.numberPad, { backgroundColor: Colors[theme].cardBackground }]}>{renderKeyPad()}</View>
    </View>
  );
};

export default PinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: clamp(width * 0.28, 110, 185),
    height: clamp(height * 0.14, 110, 185),
    borderRadius: 900,
    top: height * 0.12,
  },
  title: {
    fontSize: clamp(width * 0.065, 20, 30),
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  pinContainer: {
    alignItems: 'center',
    top: height * 0.04,
    marginBottom: 20,
  },
  pinDots: {
    flexDirection: 'row',
  },
  pinCircle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderColor: 'darkgrey',
    margin: 10,
  },
  numberPad: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
  },
  numberButton: {
    flex: 1,
    height: clamp(height * 0.08, 60, 80),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  numberText: {
    fontSize: width * 0.09,
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: 'red',
    position: 'absolute',
    top: height * 0.5,
  },
});
