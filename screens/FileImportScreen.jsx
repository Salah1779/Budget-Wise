import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, 
  StyleSheet, Alert, Linking, Dimensions,
ActivityIndicator} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import { clamp } from 'react-native-reanimated';
//import XLSX from 'xlsx';


const { width } = Dimensions.get('window');
// Example header translations
const headerTranslations = {
  'Expense Description': 'Expense Description',
  'Amount': 'Amount',
  // Add other translations as necessary
};

const FileImportScreen = () => {
}
//   const [importedFileName, setImportedFileName] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const requestPermissions = async () => {
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     return status === 'granted';
//   };
  
//   const importFile = async () => {
//     setError(''); // Reset error state
//     setLoading(true); // Set loading to true at the beginning

//     // Check and request permissions
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: [
//           'application/vnd.ms-excel',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//           'text/csv',
//         ], // Only accept Excel and CSV files
//       });

//       // Log the entire result for debugging
//       console.log('DocumentPicker result:', result);

//       if (!result.canceled && result.assets && result.assets.length > 0) 
//       {
//         const file = result.assets[0]; // Get the first asset
//         setImportedFileName(file.name); // Store the file name in state
//         const fileInfo = await FileSystem.getInfoAsync(file.uri);

//         if (fileInfo.exists) {
//           // Read file based on its type
//           const fileData = await FileSystem.readAsStringAsync(file.uri);
//           let parsedData;

//           // Check file extension to determine parsing method
//           const fileExtension = file.name.split('.').pop().toLowerCase();
//           if (fileExtension === 'xlsx' || fileExtension === 'xls') {
//             // Parse Excel files
//             const workbook = XLSX.read(fileData, { type: 'string' });
//             const sheetName = workbook.SheetNames[0]; // Get the first sheet
//             parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//           } else if (fileExtension === 'csv') {
//             // Parse CSV files
//             parsedData = XLSX.read(fileData, { type: 'string', codepage: 65001 }).Sheets.Sheet1;
//             parsedData = XLSX.utils.sheet_to_json(parsedData);
//           } else {
//             setError('Unsupported file format.');
//             return;
//           }

//           // Translate headers and validate
//           const headers = Object.keys(parsedData[0]); // Get headers from first row
//           const hasRequiredHeaders = ['Expense Description', 'Amount'].every(header => headers.includes(header));

//           if (!hasRequiredHeaders) {
//             setError('File must contain headers: Expense Description, Amount.');
//             return;
//           }

//           // Create FormData to send to API
//           const formData = new FormData();
//           parsedData.forEach(row => {
//             const expenseDescription = row['Expense Description'];
//             const amount = row['Amount'];
//             formData.append('expenseDescriptions[]', expenseDescription);
//             formData.append('amounts[]', amount);
//           });

//           // Send data to the API
//           const response = await fetch('YOUR_API_ENDPOINT', {
//             method: 'POST',
//             body: formData,
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });

//           if (!response.ok) {
//             throw new Error('Failed to send data to the API');
//           }

//           Alert.alert('Success', 'Data successfully imported and sent to API!');
//         }
//       } else {
//         return;
//       }
//     } catch (error) {
//       // Handle errors
//       setError('Error while picking file: ' + error.message);
//     } finally {
//       // Stop loading regardless of the outcome
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Import File" onPress={importFile} />
//       {loading && <Text>Loading...</Text>}
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//       {importedFileName ? <Text>Imported File: {importedFileName}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//   },
// });

export default FileImportScreen;
