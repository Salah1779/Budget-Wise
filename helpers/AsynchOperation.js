import AsyncStorage from "@react-native-async-storage/async-storage";



export const storeData = async (key, value) => {
  try {
    // Convert value to string before storing
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Data stored successfully');
  } catch (e) {
    console.error('Failed to save data to storage:', e);
  }
};




export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
        // error reading value
        console.log("Error getting data",e);
    }   
}
