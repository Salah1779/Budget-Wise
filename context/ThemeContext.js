import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData, getData } from '../helpers/AsynchOperation'; // Ensure getData is imported correctly

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // Get the current system theme
  const [theme, setTheme] = useState(systemTheme); // Initialize theme state

  useEffect(() => {
    // Fetch the stored theme from AsyncStorage and set it
    const fetchTheme = async () => {
      try {
        
          setTheme(systemTheme);
          await storeData("theme", systemTheme); // Store system theme as default
        
      } catch (error) {
        console.error('Error retrieving or storing theme:', error);
      }
    };

    fetchTheme();
  }, [systemTheme]); // Depend on systemTheme to update when it changes

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
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
