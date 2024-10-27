import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Switch,
  TextInput,
  Dimensions,
  Alert,
  Linking,
  ActivityIndicator,
  
} from 'react-native';
import { useNavigation ,useFocusEffect} from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import {BudgetContext } from '../context/CalculContext';
import CustomizedStatusBar from '../components/CustomizedStatusBar';
import BottomSheetModal from '../components/BottomSheetModal';
import CustomModal from '../components/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData, storeData} from '../helpers/AsynchOperation';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import ExpencesList from '../components/ExpencesList';
import CalculatorModal from '../components/CalculatorModal';
import { PieChart } from "react-native-gifted-charts";
import { clamp } from 'react-native-reanimated';
import {ip} from '../constants/IPAdress.js';


const {width}= Dimensions.get('window');



const Home = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [notificationCount, setNotificationCount] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [activeNotification1, setActiveNotification1] = useState(false);
  const [activeNotification2, setActiveNotification2] = useState(false);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [focusedPercentage, setFocusedPercentage] = useState(0);
  const [labelSection, setLabelSection] = useState('');
  const [budget, setBudget] = useState([]);
  const [loadExpenses, setLoadExpenses] = useState(false);
  const [allbudgetsAdded, setAllbudgetsAdded] = useState(false);


  const {theme,currency ,setIsSearching,expenceList,setExpenceList} = useContext(ThemeContext);
  const {setExpression,result,setResult,setShowCalculator} = useContext(BudgetContext);

  


 //fetching categoies for picker 
  const fetchcategories = async () => {
    
    try {
        const Client = await getData('userToken');
        console.log(Client.user);

        const res = await fetch(`http://${ip}:5000/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: Client.user.email }),
        });

        const data = await res.json();
        if(res.status===404)
        {
            setAllbudgetsAdded(true);
           
        }
        else if (!res.ok) {
            throw new Error('Network response was not ok');
            
        }

        
        setCategories(data.categories || []); // Ensure data is correctly accessed

    } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle error (e.g., show an alert or notification)
    }
};

/******************************************************************************/
//Retrieve budgets
const fetchbudgets = async () => {
  
  try {
      const Client = await getData('userToken');
      const res = await fetch(`http://${ip}:5000/api/budget-list`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Client.token}` 
          },
          body: JSON.stringify({ email: Client.user.email }),
      });

      const answer = await res.json();
      if (!res.ok) {
          throw new Error(answer.error || 'Network response was not ok');
      }
      
      await storeData('userToken', answer.user);
      setBudget(answer.data || []); 

  } catch (error) {
    Alert.alert('Error', 'Something went wrong try again later');
      
  }
  
};

 
const UpdateTotalBudget = useCallback(() => {
  if (budget.length === 0) {
    setTotalBudget(0);
    return;
  }
  // Calculate the sum of amounts in the budget
  const sum = budget.reduce((acc, element) => acc + element.amount, 0);
  setTotalBudget(sum);
}, [budget]);


//Add expence Display

// useFocusEffect(
//   useCallback(() => {
//   }, [])
// )

useEffect(() => {
  fetchcategories();
  fetchExpences(4);
},[]);

useEffect(() => {
  UpdateTotalBudget();
  fetchcategories();
}, [UpdateTotalBudget]);

useFocusEffect(
  useCallback(() => {
      fetchbudgets();
      setIsSearching(false);
      
  }, []) 
);




 
  // Function to generate pie data from budget state
  const generatePieData = useCallback(() => {
    if (!budget || budget.length === 0) 
    {
      const emptyPieData = [
        {
          value: 100,
          color: '#ccc',
          key: 'empty',
          focus: false,
          label: '',
        },

      ];

      setPieData(emptyPieData);
      setLabelSection('');
      
      return;
    }

    const totalBudget = budget.reduce((acc, item) => acc + item.amount, 0);
    const data = budget.map((item, index) => ({
      value: item.amount,
      color: Colors['categoryColor'][item.cat?.split(' ')[0]] || '#ccc', // Default color
      key: `${item.cat}-${index}`,
      focus: item.amount === Math.max(...budget.map(i => i.amount)),
      label: item.cat,
    }));

    // Set initial focused percentage based on the max amount
    const initialFocusItem = data.find(d => d.focus);
    setFocusedPercentage(((initialFocusItem.value / totalBudget) * 100).toFixed(2));
    setLabelSection(initialFocusItem.label);

    setPieData(data);
  }, [budget]);

  // Use effect to generate data when budget state changes
  useEffect(() => {
    generatePieData();
  }, [generatePieData]);

 

//add the budget to the database
const addBudgetToDB = async() => {
  //setErrors({cat:category===''?"*Required":'',result:result===0?"*Required":''});
  if(category!=='' && result!==0){
    const userToken = await getData('userToken');
    
    setLoading(true);
    const res=await fetch(`http://${ip}:5000/api/add-budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken.token}`,
        
      },
      body: JSON.stringify({
        category: category,
        amount: result
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      setCategory('');
      setResult(0);
      closemodal();
      Alert.alert('Success', 'Budget added successfully');
      await storeData('userToken', data.data);
      setLoading(false);
    }
    else{
      Alert.alert('Error', data.error);
      setLoading(false);
    }
    
  
 
}
}


/******************************************************************************/
//Expences section 



const fetchExpences = async (limit=null) => {
  setLoadExpenses(true);
  try {
      
      const Client = await getData('userToken');
      const res = await fetch(`http://${ip}:5000/api/expence-list`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Client.token}` 
          },
          body: JSON.stringify({limited:limit}),
      });

      const answer = await res.json();
      if (!res.ok) {
          throw new Error(answer.error || 'Network response was not ok');
      }
      
      await storeData('userToken', answer.user);
      setExpenceList(answer.data || []); 
     

  } catch (error) {
    Alert.alert('Error', 'Something went wrong try again later');
      
  }
  finally{
     setLoadExpenses(false);
  }
};





  const openModal = () => {
    setIsModalVisible(true);
  }
  const closemodal = () => {
    setIsModalVisible(false);
  }
  
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
  UpdateTotalBudget();
}, []);


const pickerItemStyle = {
  color: theme==='light' ? '#888' : 'lightgrey',
  backgroundColor: Colors[theme].background,
  fontSize: width > 440 ? 19 : 16,
  fontStyle:'semibold',
  fontFamily:'Poppins-Regular',
}
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

          
          <TouchableOpacity style={styles.notification}
            onPress={() => navigation.navigate('Notification')}
            activeOpacity={1} 
          >
            <Icon name="bell" size={width > 400 ? 25 : 23} color={Colors['light'].secondaryButton}  />
            {notificationCount > 0 && (
              <View style={styles.containerCount}>
                <Text style={styles.textCount}>{notificationCount.toString()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.BudgetContainer}>
          <View>
            <Text style={[styles.heading, { color: Colors[theme].header }]}>YOUR BUDGET</Text>
            <Text style={[styles.moneyBudget, { color: Colors[theme].header }]}>{currency} {totalBudget} </Text>
          </View>
          <View style={[styles.pieChartContainer]}>
          <PieChart
          data={pieData}
          donut
          showGradient
          semiCircle
          sectionAutoFocus
          focusOnPress
          onPress = { (item, index) =>{
             setFocusedPercentage(((item.value / totalBudget) * 100).toFixed(2))
             setLabelSection(item.label);
            } }
          radius={width > 400 ? 86 : 75}
          innerRadius={width > 400 ? 60 : 50}
          innerCircleColor={'#232B5D'}
          centerLabelComponent={() => (
            
            <View style={{ alignItems: 'center',flexDirection:'column-reverse' }}>
              { labelSection !== '' &&<Text style={[{ fontSize: width > 400 ? 23 : 18},styles.centerComponnentText ]}>
                {focusedPercentage}%
              </Text>}
              <Text style={[{ fontSize: width > 400 ? 12 : 10},styles.centerComponnentText ]}>
                {labelSection || 'No data XD'}
              </Text>
            </View>
          )}
        />
          </View>
        </View>

        <View style={[styles.list]}>
        <FlatList //style={[]}
            data={budget}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const [integerPart, decimalPart] = item.amount.toString().split('.');
              return (
                <View style={[styles.card, { backgroundColor: Colors['categoryColor'][item.cat.split(' ')[0]] }]}>
                  <Text style={[styles.text, { color: Colors[theme].text }]}>{item.cat}</Text>
                  <View style={[styles.amountContainer]}>
                    <Text style={[styles.text,styles.amount, { color: Colors[theme].text }]}>
                      {integerPart}
                      <Text style={[styles.text,styles.decimal]}>
                        .{decimalPart ? decimalPart.slice(0, 2) : '00'} {/* Defaulting to '00' if no decimals */}
                      </Text>
                      <Text style={[styles.currency, { color: Colors[theme].text }]}> {currency}</Text> 
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.id_budget}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={() =>
              budget.length === 0 ? null : (
                <TouchableOpacity
                  style={[styles.listHeader, { borderColor: theme === 'light' ? 'black' : 'lightgrey' }]}
                  onPress={()=>{ 
                     if (allbudgetsAdded) {
                      Alert.alert('Oups!', 'You added all the budget categories for this month!');
                      return; 
                    }
                    setIsModalVisible(true);
                    }

                  }
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
               onPress={() => setIsModalVisible(true)}
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
             <Text style={[styles.link,{color:theme==='light'?'blue':'lightblue'}]}  onPress={()=> navigation.navigate('Expenses')} >View all</Text>
           </View>
           <View style={[styles.ExpenceContainer]}>
           {loadExpenses ? 
           <ActivityIndicator  style={styles.centerPosition} animating={true} size="large" color={Colors['light'].secondaryButton} />
            : <ExpencesList 
              expenceData={expenceList.slice(0,4)}
              contentContainerStyle={styles.expenceCardContainer}
              />}
           </View>
        </View>
        
        <BottomSheetModal isVisible={isModalVisible} onClose={closemodal}>

          <View style={[{flexDirection:'row-reverse',flex:1,alignItems:'center', justifyContent:'space-between',marginBottom:20}]}>
            <View style={[{width:width*0.4}]}>
               <Text style={[styles.label,{color:theme==='light'?'#888':'lightgrey',marginBottom:0}]}>Category</Text>
               <Picker
                  selectedValue={category}
                  onValueChange={(value) => setCategory(value)}
                  style={[styles.picker, { color:theme=='light'?'#004':'lightgrey',  }]}
                  itemStyle={pickerItemStyle}
                  mode="dropdown"
                  dropdownIconColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                  dropdownIconRippleColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                  ItemSeparatorComponent={() => <View style={{ height: 1, width: '80%', backgroundColor: 'gray' }} />}
                  selectionColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
               >
                  <Picker.Item label="Select a category" value="" />
                  {categories.map((category, index) => (
                      <Picker.Item key={index} label={category.cat} value={category.cat} />
                  ))}
              </Picker>
            </View>
            
            <View  >
              <Text style={[styles.label,{color:theme==='light'?'#888':'lightgrey'}]}>Amount</Text>
              <TouchableOpacity onPress={() => {setShowCalculator(true); setExpression( result.toString()==='0'?'':result)}}>
                <TextInput
                  style={[styles.input,{color:theme==='light'?'#004':'lightgrey'}]}
                  placeholder="Enter budget amount"
                  keyboardType="numeric"
                  placeholderTextColor={theme === 'light' ? 'grey' : 'darkgrey'}
                  value={result}
                  editable={false}  
                 
                />
              </TouchableOpacity>
            </View>
          
          </View>


          <View style={{widht:'80%',height:1,backgroundColor:'rgba(136, 136, 136, 0.13)',}}/>

          <Text style={[styles.label,{color:Colors[theme].header,letterSpacing:0,marginBottom:30,marginVertical:30}]}>Notifications</Text>


          <View style={styles.switchContainer}>
          <Text style={[styles.label,{color:theme==='light'?'#888':'grey',letterSpacing:0,marginBottom:0}]}>Send notification when amount exceeds</Text>

            <Switch
              value={activeNotification1}
              onValueChange={setActiveNotification1}
              trackColor={{ false: 'rgba(136, 136, 136, 0.65)', true: 'lightblue' }}
              thumbColor='lightblue'
              ios_backgroundColor="#3e3e3e"
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={[styles.label,{color:theme==='light'?'#888':'grey',letterSpacing:0,marginBottom:0}]}>Send notification when amount exceeds</Text>

            <Switch
              value={activeNotification2}
              onValueChange={setActiveNotification2}
             color={theme === 'light' ? 'lightblue' : 'lightblue'}
             trackColor={{ false: 'rgba(136, 136, 136, 0.65)', true: 'lightblue' }}
             thumbColor='lightblue'
             ios_backgroundColor="#3e3e3e"
             style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
              
            />
          </View>
          <TouchableOpacity style={[styles.button, {backgroundColor:loading ? 'gray' : Colors[theme].primaryButton}]}
           onPress={() => {addBudgetToDB();
                          fetchbudgets();
                         // setTotalBudget(totalBudget+budget[budget.length-1].amount);
                          }} >
               <Text style={styles.buttonText}>Done{' '} {loading && <ActivityIndicator size="small" color="white" />}</Text>
          </TouchableOpacity>
        </BottomSheetModal>
        
        <CalculatorModal Style={[{backgroundColor:theme==='light'?'white':'#E5E4E2',}]} />

       
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
  centerPosition:
  {
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
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
    
    fontStyle: 'italic',
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
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

  centerComponnentText: {
    position:'relative',
    top:4,
    fontFamily:'Poppins-Regular',
    color :'white',
    fontWeight: 'bold',
  },
  list: {
   
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
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Regular',

  },
  moneyBudget: {
    fontSize: 24,
    
    fontFamily: 'Poppins-Regular',
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
   //height:clamp(height*0.48, 200, 500),
 
   //backgroundColor: 'white',
   flex: 1,
   
  },
ExpenceBlock: {
  
 flex: 1,
  
},
label: {
  fontStyle: 'italic',
  fontFamily:'Poppins-Regular',
  fontWeight: 'bold',
  letterSpacing: 0.3,
  marginBottom: 10,
},
picker: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 10,
  
},
input: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 20,
  
},
switchContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap:20,
  marginBottom: 20,
},
buttonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 35,


},
button: {
   
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 20,
  elevation: 3,
},
buttonText: {
  fontSize: width>=500?18:15,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.5,
  color: 'white',
  textAlign: 'center',
  fontFamily: 'Poppins-Regular',
},

expenceCardContainer:
{
  borderRadius: 8,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 1,
},
textModal: {
  fontSize: width>400 ? 19 : 17,
  textAlign: 'center',
  fontFamily:'Poppins-Regular',
  
},

 
 
    
});