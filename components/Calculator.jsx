import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import React, { useState, useContext, useRef, useCallback } from 'react';
import { Colors } from '../constants/Colors'; // Ensure this import is correct
import { ThemeContext } from '../context/ThemeContext';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const Calculator = () => {
  const { theme } = useContext(ThemeContext);
  const [expression, setExpression] = useState(''); // Initialize expression
  const [error, setError] = useState('');
  const deleteInterval = useRef(null); // Ref to store the interval ID
  const expressionRef = useRef(expression); // Ref to keep the current expression

  // Sync ref with the latest expression state
  expressionRef.current = expression;

  // Define the calculator buttons
  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  // Function to handle button presses
  const handleButtonPress = useCallback((value) => {
    const lastChar = expression.slice(-1);
    const operators = ['+', '-', '*', '/'];
    const validExp = /^(([1-9][0-9]*)|([0-9]+\.[0-9]+))([\+\-\/\*](([1-9][0-9]*)|([0-9]+\.[0-9]+)))*$/;

    if (value === '0') {
      if (expression !== '') setExpression(expression + '0');
    } else if (operators.includes(value)) {
      if (lastChar !== '' && !operators.includes(lastChar)) setExpression(expression + value);
    } else if (value === '.') {
      // Check if the last number already contains a decimal
      const lastNumber = expression.split(/[\+\-\/\*]/).pop(); // Split by operators and get the last number
      if (!lastNumber.includes('.')) {
        setExpression(expression + value);
      }
    } else if (value > 0 && value < 10) {
      setExpression(expression + value);
    } else if (value === '=') {
      if (validExp.test(expression)) {
        try {
          const result = eval(expression);
          setExpression(result.toString());
          setError('');
        } catch (error) {
          setError('Error');
        }
      } else {
        setError('Invalid Expression');
      }
    }
  }, [expression]);

  // Function to handle delete button press
  const handleDelete = useCallback(() => {
    const currentExpression = expressionRef.current;
    if (currentExpression) {
      setExpression(currentExpression.slice(0, -1));
      setError('');
    }
  }, []);

  // Function to start deletion on long press
  const startDeletion = () => {
    stopDeletion(); // Clear any existing intervals to avoid stacking
    deleteInterval.current = setInterval(handleDelete, 80); // Adjust speed as needed
  };

  // Function to stop deletion
  const stopDeletion = () => {
    if (deleteInterval.current) {
      clearInterval(deleteInterval.current);
      deleteInterval.current = null;
    }
  };

  // Function to render buttons
  const renderButtons = () => {
    return buttons.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.buttonRow}>
        {row.map((buttonValue) => (
          <TouchableOpacity
            key={buttonValue}
            style={[styles.button]}
            onPress={() => handleButtonPress(buttonValue)}
          >
            <Text style={[styles.buttonText, { color: Colors[theme].text }]}>
              {buttonValue}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.display}>
        <ScrollView horizontal scrollsT showsHorizontalScrollIndicator={false}>
          <TextInput
            style={[styles.displayText, { color: Colors[theme].text }]}
            value={expression || '0'}
            editable={false}
            scrollEnabled
          />
        </ScrollView>
        <TouchableOpacity
          onPress={handleDelete}
          onPressIn={startDeletion}
          onPressOut={stopDeletion}
          style={styles.deleteButton}
        >
          <FontAwesome6
            name="delete-left"
            size={20}
            color="darkblue"
          />
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      {renderButtons()}
    </View>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: '#f5f5f5',
    borderWidth: 4,
    borderColor: 'red',
    width: '70%',
  },
  display: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    paddingRight: 50, // Adjust to prevent text overlap with delete icon
    paddingLeft: 10,
    backgroundColor: 'lightblue',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  displayText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    flex: 1, // Allow text to expand within the display
  },
  deleteButton: {
    position: 'absolute',
    right: 10, // Align to the far right of the display
    padding: 5,
  },
  errorText: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    color: 'red',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: 'lightgreen',
    padding: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign:'right'
  },
});
