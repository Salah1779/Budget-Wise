import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity ,Alert} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../constants/Colors'; // Correct import path
import Ficon5 from 'react-native-vector-icons/FontAwesome5';
import Ficon6 from 'react-native-vector-icons/FontAwesome6';
import Ficon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Octicons';
import Maticon from 'react-native-vector-icons/MaterialIcons';
import Entyicon from 'react-native-vector-icons/Entypo';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import {clamp} from 'react-native-reanimated';
import {ip} from '../constants/IPAdress.js';
import { storeData, getData } from '../helpers/AsynchOperation';

const { width, height } = Dimensions.get('window');



const Expence = ({
  category = 'other',
  amount = 0,
  date = '',
  article = '',
  contentContainerStyle = {},
  titleStyle = {},
  dateStyle = {},
  amountStyle = {},
  articleStyle = {},
  id_expence,
    Delete = () => {},
  reload = () => {},
  location="home",

}) => {
  const [idCategory, setIdCategory] = React.useState(id_expence || -1);
  const categoryKey = category.split(' ')[0];
  const {expenceList, setExpenceList} = useContext(ThemeContext);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food':
        return <Maticon name="fastfood" size={24} color="#fff" />;
      case 'Housing':
        return <Ficon name="home" size={24} color="#fff" />;
      case 'Entertainment':
        return <Ficon5 name="theater-masks" size={20} color="#fff" />;
      case 'Health':
        return <Maticon name="health-and-safety" size={24} color="#fff" />;
      case 'Other':
        return <Entyicon name="dots-three-horizontal" size={24} color="#fff" />;
      case 'Vehicle':
        return <Ficon5 name="car-alt" size={24} color="#fff" />;
      case 'Transportation':
        return <Maticon name="train" size={24} color="#fff" />;
      case 'Investment':
        return <Maticon name="currency-exchange" size={24} color="#fff" />;
      case 'Financial':
        return <Ficon6 name="file-invoice-dollar" size={24} color="#fff" />;
      case 'Shopping':
        return <Ficon name="shopping-cart" size={24} color="#fff" />;
      default:
        return null;
    }
  };
  
  // const fetchExpences = async (limit = null) => {
  //   try {
  //     const Client = await getData('userToken');
  //     const res = await fetch(`http://${ip}:5000/api/expence-list`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${Client.token}`
  //       },
  //       body: JSON.stringify({ limited: limit }),
  //     });

  //     const answer = await res.json();
  //     if (!res.ok) {
  //       throw new Error(answer.error || 'Network response was not ok');
  //     }

  //     await storeData('userToken', answer.user);
  //     setExpenceList(answer.data || []);
  //     setFilteredList(answer.data || []);

  //   } catch (error) {
  //     console.error('Error fetching expences:', error);
  //   } finally {
  //    // setLoading(false);
  //   }
  // };

 


const handleDelete = () => {
  Alert.alert("Delete", "Are you sure you want to delete this expense?", [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    { text: "OK", onPress: () => Delete(idCategory) },
  ]);
}


  const { theme, currency } = useContext(ThemeContext);

  // Right action for swipe to delete
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
      <Icon name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    location!=='home'?
    <Swipeable renderRightActions={renderRightActions}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme === 'light' ? '#fff' : '#708090',
            shadowColor: theme === 'light' ? '#000' : null,
          },
          contentContainerStyle,
        ]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: Colors['categoryColor'][categoryKey] || '#fff' }]}
        >
          {getCategoryIcon(categoryKey)}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.title, titleStyle]}>{category}</Text>
          <Text style={[styles.amount, amountStyle]}>-{currency} {amount}</Text>
          <Text style={[styles.date, { color: theme === 'light' ? 'grey' : 'lightgrey' }, dateStyle]}>
            {date}
          </Text>
          <Text style={[styles.article, articleStyle]}>{article}</Text>
        </View>
      </View>
    </Swipeable>
    
    :<View
        style={[
          styles.container,
          {
            backgroundColor: theme === 'light' ? '#fff' : '#708090',
            shadowColor: theme === 'light' ? '#000' : null,
          },
          contentContainerStyle,
        ]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: Colors['categoryColor'][categoryKey] || '#fff' }]}
        >
          {getCategoryIcon(categoryKey)}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.title, titleStyle]}>{category}</Text>
          <Text style={[styles.amount, amountStyle]}>-{currency} {amount}</Text>
          <Text style={[styles.date, { color: theme === 'light' ? 'grey' : 'lightgrey' }, dateStyle]}>
            {date}
          </Text>
          <Text style={[styles.article, articleStyle]}>{article}</Text>
        </View>
      </View>
  );
};

export default Expence;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 0,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Regular',
    position: 'absolute',
    top: 10,
  },
  date: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
    position: 'relative',
    top: 24,
    opacity: 0.7,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f', // Red color for the negative amount
    fontFamily: 'Poppins-Regular',
    textAlign: 'right',
    position: 'relative',
    top: 23,
  },
  deleteButton: {
    backgroundColor: '#d32f2f', // Red background for delete button
    justifyContent: 'center',
    alignItems: 'center',
    width: clamp(width * 0.15, 60, 90),
    height: '100%',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  article: {
    textAlign: 'left',
  }
});
