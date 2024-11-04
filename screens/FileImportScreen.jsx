import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import { Colors } from '../constants/Colors';
import {ip} from '../constants/IPAdress.js';

const { width } = Dimensions.get('window');



const FileImportScreen = () => {
  const [importedFileName, setImportedFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
    
    // If permission is denied and we can't ask again, prompt user to enable it in settings
    if (status === 'denied' || !canAskAgain) {
      Alert.alert(
        'Permission Required',
        'Please enable media library access in your settings to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
      return false;
    }
    
    // If permission hasn't been granted yet, request it
    if (status !== 'granted') {
      const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
      return newStatus === 'granted';
    }

    // Permission is already granted
    return true;
  };

  const importFile = async () => {
    setError(''); // Reset error state
    setLoading(true); // Set loading to true at the beginning

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
        setLoading(false);
        return; // Exit if permission not granted
    }

    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv',
            ],
        });

        if (result.canceled === true) {
            setLoading(false);
            setError('File import canceled.');
            return; // Exit if no file selected
        }

        // Access the first item in the assets array
        const { name, uri, mimeType } = result.assets[0];

        if (!name || !uri) {
            setError('Could not retrieve file details. Please try another file.');
            setLoading(false);
            return;
        }

        setImportedFileName(name);

        // Prepare the file for upload
        const formData = new FormData();
        formData.append('file', {
            uri,
            name,
            type: mimeType || 'application/octet-stream',
        });

       
        const response = await fetch(`http://192.168.11.103:8000/upload`, {
            method: 'POST',
            body: formData,
      
        });

        if (!response.ok) {
            throw new Error('Failed to send data to API.');
        }

        const data = await response.json();
        Alert.alert('Success', 'Data successfully imported and sent to API!');
        console.log('Data from API:', data); // Log the JSON response data

    } catch (error) {
        setError(`Error while importing file: ${error.message}`);
    } finally {
        setLoading(false);
    }
};
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.importButton} onPress={importFile}>
        <Text style={styles.buttonText}>Import File</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color={Colors.primary} />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {importedFileName ? <Text>Imported File: {importedFileName}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  importButton: {
    backgroundColor: 'lightgreen',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default FileImportScreen;
