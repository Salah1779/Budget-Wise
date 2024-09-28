import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData, getData } from '../helpers/AsynchOperation'; // Ensure getData is imported correctly


export const ThemeContext = createContext();

export const AppProvider = ({ children }) => {
 // const systemTheme = useColorScheme(); // Get the current system theme
  const [theme, setTheme] = useState('light'); // Initialize theme state
  const [systemChosen, setSystemChosen] = useState(false);
  const [result, setResult] = useState(0);
  const [expression, setExpression] = useState('');
  const [currency, setCurrency] = useState('');
  const [expenceList, setExpenceList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
 const [toggle, setToggle] = useState(false);
 const [showCalculator, setShowCalculator] = useState(false);



 // Function to get system theme (light or dark)
 const getSystemTheme = () => {
   const colorScheme = Appearance.getColorScheme();
   return colorScheme === 'dark' ? 'dark' : 'light'; // You can adjust this if using custom themes
 };


 const setSystemTheme = async () => {
  try {
    const systemTheme = getSystemTheme();
    if(systemChosen)
    {
      setTheme(systemTheme);
      console.log("systemTheme dans ThemeContext", systemTheme);
      await storeData("theme", systemTheme);
    
      
      await storeData("systemChosen", true);
    } // Store system theme as default
  } catch (error) {
    console.error('Error retrieving or storing theme:', error);
  }
};


useEffect(() => {
  // Set initial theme
  setSystemTheme();

  // Listen for system theme changes
  const themeListener = Appearance.addChangeListener(({ colorScheme }) => {
    setSystemTheme(); // Trigger theme update on system theme change
  });

  // Cleanup listener on component unmount
  return () => themeListener.remove();
}, [systemChosen]);

  useEffect(() => {
    // Store the theme in AsyncStorage when it changes
    const storeTheme = async () => {
      try {
        await storeData("theme", theme);
       
      } catch (error) {
        console.error('Error storing theme:', error);
      }
    };

    storeTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider 
     value={{ theme, setTheme,
      expenceList,setExpenceList,
      filteredList,setFilteredList,
      expression,setExpression,
      result,setResult,
      currency,setCurrency ,
      searchQuery,setSearchQuery,
      isSearching,setIsSearching,
      toggle,setToggle,
      showCalculator,setShowCalculator,
      systemChosen,setSystemChosen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
