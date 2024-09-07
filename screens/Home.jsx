import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ThemeContext } from '../context/ThemeContext';
import CustomizedStatusBar from '../components/CustomizedStatusBar';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../helpers/AsynchOperation';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import ExpencesList from '../components/ExpencesList';

//import  Calculator from '../components/Calculator';
//import { PieChart } from "react-native-gifted-charts";
  
const Home = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { theme } = useContext(ThemeContext);
  const [notificationCount, setNotificationCount] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [budget, setBudget] = useState([]);
  const [data, setData] = useState([]);
  const [image, setImage] = useState('');
  const expenses = [
    {
      id: "1",
      category: "Vehicle",
      amount: 10400,
      currency: "MAD",
      date: "Aug 28",
      method: "cash"
    },
     {
      id: "2",
      category: "Food and Drinks",
      amount: 1560,
      currency: "MAD",
      date: "Aug 28",
      method: "cash"
    },
     {
      id: "3",
      category: "Financial Expences",
      amount: 10000,
      currency: "MAD",
      date: "Aug 28",
      method: "cash"
    },
     {
      id: "4",
    category: "Entertainment",
      amount: 300,
      currency: "MAD",
      date: "Aug 29",
      method: "card"
    },
  ]
    

  
  const pieData = [
    {
      value: 47,
      color: '#009FFF',
      gradientCenterColor: '#006DFF',
      focused: true,
    },
    {value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
    {value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3'},
    {value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97'},
  ];

const budgets=[
  {
    id: "1",
    category: "Vehicle",
    amount: 10400,
    currency: "MAD",
   
  },
     {
    id: "2",
    category: "Food and Drinks",
    amount: 1560,
    currency: "MAD",
    date: "Aug 28",
    method: "cash"
  },
     {
    id: "3",
    category: "Financial Expences",
    amount: 10000,
    currency: "MAD",
     },
]
  
 // Fetch user data on component mount
 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userToken = await getData('userToken');
      if (userToken && userToken.user) {
        setImage(userToken.user.image);
        setFirstName(userToken.user.name);
        setLastName(userToken.user.lastname);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, []);

  return (
    <>
      <CustomizedStatusBar 
        backgroundColor={Colors[theme].background}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        translucent
        hidden={false}
        animated
      />
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <View style={[styles.header, { backgroundColor: theme==='light' ? Colors['dark'].background : 'lightgrey' }]}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={1} // Remove opacity change on press
          style={styles.profileContainer}
        >
          <Image
            source={image !== '' ? { uri: image } : require('../assets/images/profile-pic.jpg')}
            style={styles.pic}
          />
          <View style={styles.nameContainer}>
            <Text style={[styles.userName, { color: theme==='light' ? 'lightblue' : Colors[theme].primaryButton, fontSize: width > 400 ? 14 : 12 }]}>
              {firstName}
            </Text>
            <Text style={[styles.userName, { color: theme==='light' ? 'lightblue' : Colors[theme].primaryButton, fontSize: width > 400 ? 14 : 12 }]}>
              {lastName}
            </Text>
          </View>
        </TouchableOpacity>

          
          <View style={styles.notification}>
            <Icon name="bell" size={width > 400 ? 25 : 23} color={Colors['light'].secondaryButton}  />
            {notificationCount > 0 && (
              <View style={styles.containerCount}>
                <Text style={styles.textCount}>{notificationCount.toString()}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.BudgetContainer}>
          <View>
            <Text style={[styles.heading, { color: Colors[theme].header }]}>YOUR BUDGET</Text>
            <Text style={[styles.moneyBudget, { color: Colors[theme].header }]}>1233.32</Text>
          </View>
          <View style={[styles.pieChartContainer]}>
          {/* <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={'#232B5D'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                  47%
                </Text>
                <Text style={{fontSize: 14, color: 'white'}}>Excellent</Text>
              </View>
            );
          }}
        /> */}
          </View>
        </View>

        <View style={[styles.list]}>
        <FlatList
            data={budgets}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const [integerPart, decimalPart] = item.amount.toString().split('.');
              return (
                <View style={[styles.card, { backgroundColor: Colors['categoryColor'][item.category.split(' ')[0]] }]}>
                  <Text style={[styles.text, { color: Colors[theme].text }]}>{item.category}</Text>
                  <View style={[styles.amountContainer]}>
                    <Text style={[styles.text,styles.amount, { color: Colors[theme].text }]}>
                      {integerPart}
                      <Text style={[styles.text,styles.decimal]}>
                        .{decimalPart ? decimalPart.slice(0, 2) : '00'} {/* Defaulting to '00' if no decimals */}
                      </Text>
                      <Text style={[styles.currency, { color: Colors[theme].text }]}> {item.currency}</Text> {/* Assuming item.currency holds the currency symbol */}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={() =>
              budgets.length === 0 ? null : (
                <TouchableOpacity
                  style={[styles.listHeader, { borderColor: theme === 'light' ? 'black' : 'lightgrey' }]}
                  
                >
                  <Icon
                    name="plus-circle"
                    size={width > 400 ? 34 : 30}
                    color={theme === 'light' ? 'black' : 'lightgrey'}
                  />
                </TouchableOpacity>
              )
            }
            horizontal
            ListEmptyComponent={() => (
              <TouchableOpacity
                style={[styles.listHeader, styles.emptyList, { borderColor: theme === 'light' ? 'white' : 'lightgrey', width: 100 }]}
              >
                <Icon
                  name="plus-circle"
                  size={width > 400 ? 34 : 30}
                  color={theme === 'light' ? 'white' : 'lightgrey'}
                />
              </TouchableOpacity>
            )}
          />

        </View>
       
        <View style={[styles.ExpenceBlock]}> 
           <View style={[styles.titleContainer]}>
             <Text style={[styles.title,{color:Colors[theme].header}]}>Recent Expenses</Text>
             <Text style={[styles.link,{color:theme==='light'?'blue':'lightblue'}]}>See all</Text>
           </View>
           <View style={[styles.ExpenceContainer]}>
             <ExpencesList expenceData={expenses}/>
           </View>
        </View>
        

       
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
   // alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pic: {
    width: 32,
    height: 32,
    borderRadius: 50,
    
  },
  userName: {
    fontFamily:'Poppins-Regular',
    fontStyle: 'italic',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerCount: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  textCount: {
    color: 'white',
    fontSize: 10,
  },
  notificationIcon: {
    marginRight: 20,
  },
  BudgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pieChartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  centerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 20,
    
    height: 190,
  },
  card: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 140,
    height: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18, // main font size for the amount
  },
  decimal: {
    fontSize: 12, // smaller font size for decimals
    opacity: 0.6, // lower opacity for the decimal part
  },
  currency: {
    fontSize: 16, // font size for the currency symbol, can adjust as needed
    marginLeft: 4, // space between amount and currency symbol
  },
  text: {
    fontSize: 20,
    fontFamily:'Poppins-Regular',
  },
  separator: {
    width: 15,
    height: 15,
  },
  listHeader: {
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    width: 130,
    marginHorizontal: 20,
    borderRadius: 10,
    opacity: 0.6,
  },
  heading: {
    fontSize: 14,
  },
  moneyBudget: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyList: {
    opacity: 0.4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily:'Poppins-Regular',
  },
  link: {
    color: 'lightblue',
    fontStyle: 'italic',
    fontFamily:'Poppins-Regular',
  },
  ExpenceContainer: {
   margin:20,
   marginTop:10,
   
   
  },

 
 
    
});