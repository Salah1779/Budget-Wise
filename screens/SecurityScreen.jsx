import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Dimensions, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { clamp } from "react-native-reanimated";
import { storeData, getData } from '../helpers/AsynchOperation';

const { width } = Dimensions.get("window");

const SecurityScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

  // Fetch stored data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pinEnabled = await getData('pinEnabled');
        const fingerprintEnabled = await getData('fingerprintEnabled');
        
        // Update state based on retrieved data, ensuring values are booleans
        if (pinEnabled !== null) setIsPinEnabled(JSON.parse(pinEnabled));
        if (fingerprintEnabled !== null) setIsFingerprintEnabled(JSON.parse(fingerprintEnabled));
      } catch (error) {
        console.error("Failed to fetch stored data: ", error);
      }
    };

    fetchData();
  }, []);

  const togglePinSwitch = async () => {
    const newPinState = !isPinEnabled;
    setIsPinEnabled(newPinState);
    
    if (!newPinState) {
      setIsFingerprintEnabled(false); 
      storeData('fingerprintEnabled', false); // Disable fingerprint if PIN is disabled
    }

    // Store updated PIN state
    await storeData('pinEnabled', newPinState);
  };

  const toggleFingerprintSwitch = async () => {
    if (!isPinEnabled) {
      Alert.alert('PIN must be enabled first');
      setIsFingerprintEnabled(false);
    } else {
      const newFingerprintState = !isFingerprintEnabled;
      setIsFingerprintEnabled(newFingerprintState);
      
      // Store updated fingerprint state
      await storeData('fingerprintEnabled', newFingerprintState);
    }
  };

  const options = [
    {
      id: 1,
      title: "PIN",
      icon: <MaterialIcons name="lock" size={30} color="#4285F4" />,
      subtitle: "Require PIN on startup",
      switch: {
        toggle: togglePinSwitch,
        value: isPinEnabled,
      }
    },
    {
      id: 2,
      title: "Fingerprint",
      icon: <FontAwesome5 name="fingerprint" size={25} color="#4285F4" />,
      subtitle: "Require Fingerprint on startup",
      switch: {
        toggle: toggleFingerprintSwitch,
        value: isFingerprintEnabled,
      }
    }
  ];

  const renderItems = () => {
    return options.map((option) => {
      const { id, title, icon, subtitle, switch: { toggle, value } } = option;
      return (
        <View key={id} style={[styles.settingContainer, { borderBottomColor: Colors[theme].header }]}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: Colors[theme].header }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: '#888' }]}>{subtitle}</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#4285F4' }}
            thumbColor={value ? '#4285F4' : '#f4f3f4'}
            onValueChange={toggle}
            value={value}
          />
        </View>
      );
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      {renderItems()}
    </View>
  );
};

export default SecurityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: clamp(width * 0.04, 12, 18),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: clamp(width * 0.035, 10, 16),
    fontFamily: 'Poppins-Regular',
  },
});
