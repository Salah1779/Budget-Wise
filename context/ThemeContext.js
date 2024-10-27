import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { storeData, getData } from '../helpers/AsynchOperation'; // Ensure getData is imported correctly



export const ThemeContext = createContext();

export const AppProvider = ({ children }) => {
 
  const [theme, setTheme] = useState('light'); // Initialize theme state
  const [systemChosen, setSystemChosen] = useState(false);
 
  const [currency, setCurrency] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [expenceList, setExpenceList] = useState([]);




 // Function to get system theme (light or dark)
 const getSystemTheme = () => {
   const colorScheme = Appearance.getColorScheme();
   return colorScheme === 'dark' ? 'dark' : 'light'; 
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
      currency,setCurrency ,
      searchQuery,setSearchQuery,
      isSearching,setIsSearching,
      toggle,setToggle,
      systemChosen,setSystemChosen,
      expenceList,setExpenceList
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
