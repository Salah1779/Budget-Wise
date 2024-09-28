import React, { useContext,useState ,useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import { clamp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');


const formatTimePassed = (timestamp = '') => {
  const now = new Date().getTime();
  const [datePart, timePart] = timestamp.split(' ');
  const [month, day, year] = datePart.split('/');
  const [hours, minutes, seconds] = timePart.split(':');

  const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);
  const secondsPassed = Math.floor((now - dateObject.getTime()) / 1000);
  
  if (secondsPassed < 20) {
    return 'now';
  } else if (secondsPassed < 60) {
    return `${secondsPassed}s ago`;
  } else if (secondsPassed < 3600) {
    const minutesPassed = Math.floor(secondsPassed / 60);
    return `${minutesPassed} min ago`;
  } else if (secondsPassed < 86400) {
    const hoursPassed = Math.floor(secondsPassed / 3600);
    return `${hoursPassed} h ago`;
  } else if (secondsPassed < 604800) {
    const daysPassed = Math.floor(secondsPassed / 86400);
    return `${daysPassed} d ago`;
  } else {
    const weeksPassed = Math.floor(secondsPassed / 604800);
    return `${weeksPassed} w ago`;
  }
};


const NotificationItem = ({ item, theme }) => {
 



  return (
    <View style={styles.notificationItem}>
      <Image source={require('../assets/images/logo.png')} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>{item.title}</Text>
        <Text style={[styles.body, { color: Colors[theme].text }]}>{item.body}</Text>
      </View>
      <Text style={[styles.date, { color: Colors[theme].text }]}>{formatTimePassed(item.date)}</Text>
    </View>
  );
};

const NotificationScreen = () => {
  const { theme } = useContext(ThemeContext);
  

  const notifications = [
    {
      id: 1,
      title: 'Notification 1',
      body: 'This is notification 1',
      date: '09/08/2024 00:00:23',
    },
    {
      id: 2,
      title: 'Notification 2',
      body: 'This is notification 2',
      date: '20/09/2024 02:17:20',
    },
  ]; // Test notifications array

 

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      {notifications.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          data={notifications}
          renderItem={({ item }) => {
            console.log("Rendering item: ", item); // Debugging log
            return <NotificationItem item={item} theme={theme} />;
          }}
          keyExtractor={(item) => item.id.toString()} // Ensure key is a string
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={require('../assets/images/noNotifications.png')}
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyText, { color: Colors[theme].text }]}>No notifications available.</Text>
        </View>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  emptyState: {
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
 

  },
  emptyImage: {
    width: clamp(width * 0.5, 164, 240),
    height: clamp(height * 0.2, 209, 255),
  },

  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //width: '100%',
    padding: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: width >= 400 ? 20 : 16,
    fontFamily: 'Poppins-Regular',
  },
  body: {
    fontSize: width >= 400 ? 16 : 14,
    fontFamily: 'Poppins-Regular',
  },
  date: {
    fontSize: width >= 400 ? 14 : 12,
    top:height*0.032,
   
    fontFamily: 'Poppins-Regular',
  },
});
