import React, { useContext, useEffect, useState, useCallback ,useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
  LayoutAnimation,

} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import CustomizedStatusBar from '../components/CustomizedStatusBar';
import BottomSheetModal from '../components/BottomSheetModal';
import { getData, storeData } from '../helpers/AsynchOperation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExpencesList from '../components/ExpencesList';
import { clamp } from 'react-native-reanimated';
import ActionButton from '../components/ActionButton';
import { Picker } from '@react-native-picker/picker';
import CalculatorModal from '../components/CalculatorModal';
import { ThemeContext } from '../context/ThemeContext';
import { ExpenseContext } from '../context/CalculContext';
import {ip} from '../constants/IPAdress'

const { width, height } = Dimensions.get('window');

//categories filter
const categories = [
  'All',
  'Food & Drinks',
  'Vehicle',
  'Housing',
  'Transportation',
  'Health',
  'Entertainment',
  'Investment',
  'Other',
  'Financial Expenses',
  'Shopping'
];

const expenses_example = [
  {
    id: 1,
    category: 'Food & Drinks',
    article: 'Burger',
    price: 80,
  },
  {
    id: 2,
    category: 'Health',
    article: 'Panadol medecine',
    price: 100,
  },
  {
    id: 3,
    category: 'Other',
    article: 'Pet crockets',
    price: 80,
  },
  {
    id: 4,
    category: 'Entertainment',
    article: 'Fifa 25',
    price: 800,
  },
  {
    id: 5,
    category: 'Housing',
    article: 'Apartment',
    price: 800,
  },
  {
    id: 6,
    category: 'Housing',
    article: 'House',
    price: 800,
  },
  {
    id: 7,
    category: 'Housing',
    article: 'House',
    price: 800,
  }
]
const ExpenceScreen = () => {
  const navigation = useNavigation();
  const { theme, currency,
        isSearching,setIsSearching,
        searchQuery,setSearchQuery ,
        expenceList,setExpenceList,
        } = useContext(ThemeContext);

  const {
        filteredList,setFilteredList
        , result,setResult
        ,setShowCalculator
        ,setExpression,
   } = useContext(ExpenseContext);

 // const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [article, setArticle] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [initialFilter, setInitialFilter] = useState([]);
  const [categoriesList , setCategoriesList] = useState([]);
  const [articles, setArticles] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [modalImport, setModalImport] = useState(true);
 
  useEffect(() => {
    if (!modalImport) return;
  
    const fill_expenseList = () => {
      const newCategories = [];
      const newArticles = [];
      const newAmounts = [];
  
      expenses_example.forEach(item => {
        newCategories.push(item.category);
        newArticles.push(item.article);
        newAmounts.push(item.price);
      });
  
      // Update the state
      setCategoriesList(prevState => [...prevState, ...newCategories]);
      setArticles(prevState => [...prevState, ...newArticles]);
      setAmounts(prevState => [...prevState, ...newAmounts]);
    };
  
    fill_expenseList();
  }, [modalImport]);
  
 
  closeModal = () => {
    setIsModalVisible(false);
  }

  openModal = () => {
    setIsModalVisible(true);
  }
  const addExpenceToDB = async () => {
    if (category !== '' && result !== 0 && article.trim() !== '') {
      try {
        const userToken = await getData('userToken');
        setLoadingAdd(true);
  
        const res = await fetch(`http://${ip}:5000/api/add-expense`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken.token}`,
          },
          body: JSON.stringify({
            category: category,
            amount: result,
            article: article,
          }),
        });
  
        const data = await res.json();
        
        if (res.status === 200) {
          // Success actions
          setCategory('');
          setResult(0);
          setArticle('');
          closeModal();
          Alert.alert('Success', 'Expense added successfully');
          await storeData('userToken', data.data);
        } else {
          // Error from server response
          Alert.alert('Error', data.error || 'Something went wrong');
        }
      } catch (error) {
        // Catch any network or unexpected error
        console.error('Error adding expense:', error);
        Alert.alert('Error', 'Failed to add expense. Please try again.');
      } finally {
        // Loading state reset
        setLoadingAdd(false);
      }
    } else {
      // Validation feedback if fields are empty
      Alert.alert('Validation Error', 'Please fill all the required fields.');
    }
  };
  const deleteExpenseFromDB = async (id) => {
    console.log("id: ",id);
    console.log('Delete start...');
    try {
      const Client = await getData('userToken');
      if (!Client || !Client.token) {
        throw new Error('User token is missing');
      }
      console.log('User token:', Client.token);
  
      const res = await fetch(`http://${ip}:5000/api/delete-expence`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Client.token}`,
        },
        body: JSON.stringify({ id }),
      });
  
      // Check if the response is OK before trying to parse it
      if (!res.ok) {
        const errorResponse = await res.json(); // Get the response as text
        throw new Error(errorResponse.error || 'Network response was not ok');
      }
  
      const answer = await res.json(); // Parse as JSON only if response is OK
      console.log(answer);
      
      // Update token
      const Token = { user: Client.user, token: answer.token };
      console.log(Token.token);
      await storeData('userToken', Token);
      fetchExpences();
      
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert('Error', error.message);
    }
  };
  
  const fetchExpences = async (limit = null) => {
    setLoading(true);
    try {
      const Client = await getData('userToken');
      const res = await fetch(`http://${ip}:5000/api/expence-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Client.token}`
        },
        body: JSON.stringify({ limited: limit }),
      });

      const answer = await res.json();
      if (!res.ok) {
        throw new Error(answer.error || 'Network response was not ok');
      }

      await storeData('userToken', answer.user);
      setExpenceList(answer.data || []);
      setFilteredList(answer.data || []);
      

    } catch (error) {
      console.error('Error fetching expences:', error);
    } finally {
      setLoading(false);
    }
  };


  const calculateTotal = () => {
    let total = 0;
    filteredList.forEach(element => {
      total += element.expence_amount;
    });
    return total;
  };



  useFocusEffect(
    useCallback(() => {
      setSelectedCategory('All');
      setSearchQuery('');
      ///fetchExpences();  
    }, [])
  );
  
  const filterByCategory = (category = 'All') => {
    if (category === 'All') {
      setFilteredList(expenceList);
      setInitialFilter(expenceList);
      
    } else {
      const filtered = expenceList.filter(element => element.cat === category);
      setFilteredList(filtered);
      setInitialFilter(filtered);
      
    }
  };

// Handle search logic
const handleSearch = (text) => {

  setSearchQuery(text);
  if(text === '' ) {
  
    setFilteredList(initialFilter);
    return;
  }

  const filtered=initialFilter.filter((expence) => 
    expence.article?.toLowerCase().includes(text.toLowerCase())
  );
  setFilteredList(filtered);
};

// Toggle search bar visibility
const toggleSearch = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setIsSearching((prev) => !prev);
  
  // Clear search query when turning off search
  if (isSearching) setSearchQuery('');
};

useEffect(() => {
  fetchExpences();
},[expenceList.length]);

// Set navigation options
useEffect(() => {
  navigation.setOptions({
    headerTitle: isSearching ? '' : 'Expenses',
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
        {isSearching && (
          <TextInput
            placeholder="Search..."
            placeholderTextColor={theme === 'light' ? 'rgba(85, 85, 85, 0.5)' : 'rgba(229, 228, 226, 0.5)'}
            onChangeText={(text) => handleSearch(text)}
            value={searchQuery}
            style={{
              paddingHorizontal: 10,
              width: width * 0.6,
              marginRight: 10,
              color: theme === 'light' ? '#555555' : 'lightgrey',
            }}
          />
        )}
        <TouchableOpacity onPress={toggleSearch}>
          <Ionicons
            name={isSearching ? "close-outline" : "search-outline"}
            size={24}
            color={theme === 'light' ? '#555555' : 'lightgrey'}
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      </View>
    ),
  });
}, [isSearching, searchQuery, theme, navigation]);



 const options = [
        {
            id: 1,
            icon: 'account-outline',
            action: () => setIsModalVisible(true),
            translation: 'top' /* left, middle, top */
        },
        {
            id: 2,
            icon: 'comment-text-multiple-outline',
            action: () => console.log('presionando el boton 2'),
            translation: 'middle' /* left, middle, top */
        },
        {
          id: 3,
          icon: 'comment-text-multiple-outline',
          action: () => console.log('presionando el boton 2'),
          translation: 'left' /* left, middle, top */
      },
      
    ];

   const handleCancel=(index)=>{
     expenses_example.splice(index, 1);
   }

  const renderItem = ({ item }) => {
    const isSelected = item === selectedCategory;

    return (
      <TouchableOpacity onPress={() => { setSelectedCategory(item); filterByCategory(item); }} activeOpacity={0.7}>
        <Animated.View
          style={{
            borderRadius: 10,
            backgroundColor: isSelected ? '#030e4f' : '#FADA5E', // Background color of the item
            paddingHorizontal: 10,
            justifyContent: 'center',
            height: clamp(width > 400 ? 50 : 30, 50, 30),
          }}
        >
          <Text
            style={{
              fontSize: width > 400 ? 15 : 14, // Adjust font size based on screen width
              color: isSelected ? '#f49f1c' : '#030e4f', // Change text color based on selection
              textAlign: 'center',
            }}
          >
            {item}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

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
        <View style={[styles.TotalContainer, { backgroundColor: theme === 'light' ? 'white' : 'lightblue' }]}>
          <Text style={[styles.total, { color: Colors[theme].header }]}>{calculateTotal()} {currency}</Text>
        </View>
        <View>
          <FlatList
            style={styles.filterList}
            data={categories}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 7 }} />}
            ListHeaderComponent={() => <View style={{ width: 7 }} />}
          />
        </View>

        {loading ? <ActivityIndicator style={styles.loading} animating={true} size='large' color={Colors[theme].secondaryButton} />
          : <ExpencesList
            expenceData={filteredList}
            contentContainerStyle={{backgroundColor:Colors[theme].background}}
            articleStyle={{ color: theme === 'light' ? 'black' : 'white' }}
            titleStyle={{ color: theme === 'light' ? 'black' : 'white' }}
            refreshFetch={fetchExpences}
            deleteExpense={deleteExpenseFromDB}
            location='expenseScreen'
          />
        }
        <ActionButton options={options} />

        <BottomSheetModal isVisible={isModalVisible} onClose={closeModal} SheetHeight={height*0.45}>

            <View style={[{flexDirection:'row-reverse',flex:1,alignItems:'center', justifyContent:'space-between',}]}>
              <View style={[{width:width*0.4}]}>
                <Text style={[styles.label,{color:theme==='light'?'#888':'lightgrey',marginBottom:0}]}>Category</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(value) => setCategory(value)}
                    style={[styles.picker, { color:theme=='light'?'#004':'lightgrey',  }]}
                    //itemStyle={pickerItemStyle}
                    mode="dropdown"
                    dropdownIconColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                    dropdownIconRippleColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                    ItemSeparatorComponent={() => <View style={{ height: 1, width: '80%', backgroundColor: 'gray' }} />}
                    selectionColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                >
                   <Picker.Item label="Select a category" value="" />
                    {categories.map((category, index) => {
                      if (index > 0) {
                        return (
                          <Picker.Item key={index} label={category} value={category} />
                        );
                      }
                      return null; // Return null if index is 0 or less
                    })}
                </Picker>
              </View>
              
              <View  >
                <Text style={[styles.label,{color:theme==='light'?'#888':'lightgrey'}]}>Amount</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {setShowCalculator(true);setExpression( result.toString()==='0'?'':result)}}>
                  <TextInput
                    style={[styles.input,{color:theme==='light'?'#004':'lightgrey'}]}
                    placeholder="Enter expenece amount"
                    keyboardType="numeric"
                    placeholderTextColor={theme === 'light' ? 'grey' : 'darkgrey'}
                    value={result}
                    editable={false}  
                  
                  />
                </TouchableOpacity>
              </View>
             

            </View>
            <View >
                <Text style={[styles.label,{color:theme==='light'?'#888':'lightgrey'}]}>Article</Text>
                
                  <TextInput
                    style={[styles.input,{color:theme==='light'?'#004':'lightgrey'}]}
                    placeholder="set an article..."
                    placeholderTextColor={theme === 'light' ? 'grey' : 'darkgrey'}
                    value={article}
                    onChangeText={(text)=>setArticle(text)}
                    multiline={true}
                  />
                
              </View>

            
            <TouchableOpacity style={[styles.button, {backgroundColor:loadingAdd ? 'gray' : Colors[theme].primaryButton},
               Platform.select({
              ios: theme === 'light' ? {
                shadowColor: '#ccc',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              } : {},
              android: {
                elevation: theme === 'light' ? 5 : 0,
              },
            }),]}
            onPress={() => {
                           console.log(result , article , category); 
                         
                            addExpenceToDB()
                            fetchExpences();
                          
                            }} >
                <Text style={styles.buttonText}>Done{' '} {loadingAdd && <ActivityIndicator size="small" color="white" />}</Text>
            </TouchableOpacity>
        </BottomSheetModal>

        <BottomSheetModal isVisible={modalImport} onClose={()=>setModalImport(false)} SheetHeight={height*0.9}>
        <FlatList
          style={{ flex: 1 }}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          data={expenses_example}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
            style={{
              flexDirection: 'column',
              flex: 1,
              marginBottom: 20,
            
            }}
          >
                   
                
                 <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                 <View style={{ width: width * 0.4 }}>
                    <Text style={[styles.label, { color: theme === 'light' ? '#888' : 'lightgrey', marginBottom: 0 }]}>Category</Text>
                    <Picker
                
                        selectedValue={categoriesList[index]}
                        onValueChange={(value) => setCategoriesList(prevCategoriesList => [...prevCategoriesList.slice(0, index), value, ...prevCategoriesList.slice(index + 1)])}
                        style={[styles.picker, { color: theme === 'light' ? '#004' : 'lightgrey' }]}
                        mode="dropdown"
                        dropdownIconColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                        dropdownIconRippleColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                        ItemSeparatorComponent={() => <View style={{ height: 1, width: '80%', backgroundColor: 'gray' }} />}
                        selectionColor={theme === 'light' ? 'lightblue' : 'lightgrey'}
                    >
                        <Picker.Item label="Select a category" value="" />
                        {categories.map((category, index) => {
                            if (index > 0) {
                                return (
                                    <Picker.Item key={index} label={category} value={category} />
                                );
                            }
                            return null; // Return null if index is 0 or less
                        })}
                    </Picker>
                </View>

                <View>
                    <Text style={[styles.label, { color: theme === 'light' ? '#888' : 'lightgrey' }]}>Amount</Text>
                    
                        <TextInput
                            style={[styles.input, { color: theme === 'light' ? '#004' : 'lightgrey' }]}
                            placeholder="Enter expense amount"
                            keyboardType="numeric"
                            placeholderTextColor={theme === 'light' ? 'grey' : 'darkgrey'}
                            value={amounts[index]?.toString() || ''} 
                            onChangeText={(price) => setAmounts(prevAmounts => [...prevAmounts.slice(0, index), parseFloat(price), ...prevAmounts.slice(index + 1)])}
                            editable={true}
                        />
                    
                </View>
                 </View>

                <View>
                    <Text style={[styles.label, { color: theme === 'light' ? '#888' : 'lightgrey' }]}>Article</Text>
                    <TextInput
                        style={[styles.input, { color: theme === 'light' ? '#004' : 'lightgrey' }]}
                        placeholder="set an article..."
                        placeholderTextColor={theme === 'light' ? 'grey' : 'darkgrey'}
                        value={articles[index]}
                        onChangeText={(text) => setArticles(prevArticles => [...prevArticles.slice(0, index), text, ...prevArticles.slice(index + 1)])} // Update the articles array with the new value(text)}
                        multiline={true}
                        editable={false}
                    />
                </View>

                <TouchableOpacity onPress={() => handleCancel(index)} style={styles.cancelButton}>
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
          )}
         
          ListFooterComponent={
            <TouchableOpacity style={[styles.button, {backgroundColor:loadingAdd ? 'gray' : Colors[theme].primaryButton},
                Platform.select({
              ios: theme === 'light' ? {
                shadowColor: '#ccc',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              } : {},
              android: {
                elevation: theme === 'light' ? 5 : 0,
              },
            }),]}
            onPress={() => {
                           // console.log(result , article , category); 
                          
                           // addExpenceToDB()
                            //fetchExpences();
                          
                            }} >
             <Text style={styles.buttonText}>Done{' '} {loadingAdd && <ActivityIndicator size="small" color="white" />}</Text>
         </TouchableOpacity>
          }
        />
  
 
        </BottomSheetModal>
        
        <CalculatorModal Style={[{backgroundColor:theme==='light'?'white':'#E5E4E2',}]}  type='expense'/>
       </View>

    </>
  );
}

export default ExpenceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TotalContainer: {
    width: '85%',
    borderRadius: width * 0.9,
    height: '10%',
    minHeight: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: height * 0.02,
    shadowColor: '#888',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      }
    })
  },
  total: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.12,
  },
  expenceCardContainer: {
    backgroundColor: 'transparent',
  },
  filterList: {
    padding: 4,
    height: height * 0.07,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  button: {
   
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop:30
   
  },
    
  buttonText: {
    fontSize: width>=400?19:17,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',

  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width : width*0.8,
    backgroundColor: '#e74c3c',
    margin:'auto',
    borderRadius: 50,
    paddingVertical: 5,
    
    
  },
});
