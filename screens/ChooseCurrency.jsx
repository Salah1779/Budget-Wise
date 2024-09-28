import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../constants/Colors';
import { clamp } from 'react-native-reanimated';
import { storeData } from '../helpers/AsynchOperation';
import currencies from '../currenciesList.json'

const { height, width } = Dimensions.get('window');

// Currency symbols mapping
const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    NZD: 'NZ$',
  };
  
  
  

  


const ChooseCurrency = () => {
  const navigation = useNavigation();
  const { theme, currency, setCurrency } = useContext(ThemeContext);

  useEffect(() => {
    setCurrency('');
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Image
        source={require('../assets/images/currency-onboarding.png')}
        style={{ width: height * 0.4, height: height * 0.4, alignSelf: 'center', marginBottom: 20 }}
      />

      <View>
        <Text style={[styles.label, { color: Colors[theme].header }]}>Pick a currency to get started</Text>
    
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currency}
              style={[styles.picker, { color: theme === 'light' ? '#888' : 'lightgrey' }]}
              onValueChange={(itemValue) => {
                setCurrency(itemValue);
              }}
             // mode='dropdown'
              dropdownIconColor={theme === 'light' ? '#888' : 'lightgrey'}
              dropdownIconRippleColor={theme === 'light' ? '#888' : 'lightgrey'}
            >
              <Picker.Item label="Select Currency" value={null} />
              {currencies.map((currency) => (
                <Picker.Item 
                  key={currency.code} 
                  label={`${currency.countryLogo} ${currency.name} (${currency.code})`} 
                  value={currencySymbols[currency.code] || currency.code}
                />
              ))}
            </Picker>
          </View>
        
        
        {!currency && <Text style={styles.error}>*required</Text>}
      </View>

      <TouchableOpacity
        style={[
          {
            backgroundColor: Colors[theme].primaryButton,
            ...Platform.select({
              ios: theme === 'light' ? {
                shadowColor: '#ccc',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              } : {},
              android: {
                elevation: theme === 'light' ? 5 : 0,
              },
            }),
          },
          styles.button,
          { marginTop: currency ? 30 : 0 }
        ]}
        onPress={() => {
          if(currency)
          {
            storeData('currency', currency);
            navigation.replace('AppStack');
          }else return null;
            
        }}
      >
        <Text style={[styles.label, { color: 'white', marginBottom: 0 }]}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseCurrency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: width * 0.8,
    marginBottom: 7,
  },
  picker: {
    width: width * 0.8,
    height: 50,

  },
  label: {
    fontWeight: '700',
    fontFamily: 'Poppins-Regular',
    fontSize: width > 450 ? 20 : 16,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  button: {
    width: clamp(width * 0.8, 200, 400),
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    fontSize: width > 450 ? 16 : 12,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
    marginBottom: 20,
  }
});
