import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView,Dimensions } from 'react-native';
import React, { useState, useEffect,useContext, useRef, useCallback } from 'react';
import { Colors } from '../constants/Colors'; // Ensure this import is correct
import { ThemeContext } from '../context/ThemeContext';
import { BudgetContext, ExpenseContext } from '../context/CalculContext';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { getData, storeData } from '../helpers/AsynchOperation';

const {width ,height}= Dimensions.get('window');
const Calculator = ({ type = 'budget' }) => {
  const { theme } = useContext(ThemeContext);
  const {expression,setExpression} = useContext(type === 'budget' ? BudgetContext : ExpenseContext);
  const [error, setError] = useState('');


 

   
 


 

  // Define the calculator buttons
  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  // Function to handle button presses
  // const handleButtonPress = useCallback((value) => {
  //   const lastChar = expression.slice(-1);
  //   const secondLastChar = expression[expression.length-2];
    
  //   const operators = ['+', '-', '*', '/'];
    
  //   const validExp =/^-?([0-9]+(\.[0-9]+)?)([\+\-\/\*]([0-9]+(\.[0-9]+)?))*$/;
  //   ;

  //   if (value === '0') {
  //     console.log(secondLastChar ,lastChar);

  //     //if (expression === '') setExpression(expression + '0'); 
  //     if(lastChar === '0' && operators.includes(secondLastChar) || ( expression==='0' )) 
  //       setExpression(expression );
  //     else 
  //          setExpression(expression + '0'); 

  //   } else if (operators.includes(value)) {
  //     if(value==='-' && (expression === '' || !operators.includes(lastChar)))
  //        setExpression(expression + value);
  //     else if (lastChar !== '' && !operators.includes(lastChar) ) setExpression(expression + value);

  //   } else if (value === '.') {
  //     // Check if the last number already contains a decimal
  //     const lastNumber = expression.split(/[\+\-\/\*]/).pop(); // Split by operators and get the last number
  //     if (!lastNumber.includes('.') && lastNumber !== '') {
  //       setExpression(expression + value);
  //     }
  //   } else if (value > 0 && value < 10) {
  //     if(lastChar === '0' && operators.includes(secondLastChar) || ( expression==='0' )) 
  //         setExpression(expression );
  //     else
  //     setExpression(expression + value);

  //   } else if (value === '=') {
  //     if (validExp.test(expression) )
  //     {
  //       try {
  //         const result = eval(expression);
  //         setExpression(result.toString());
  //         setError('');
  //       } catch (error) {
  //         setError('Error');
  //       }
  //     } else if(expression!=='') {
  //       setError('Invalid Expression');
  //     }
  //   }
  // }, [expression]);


  // const updateExpression = useCallback((value) => {
  //   expressionRef.current += value;
  //   setExpression(expressionRef.current); // Update display after modifying ref
  // }, []);

  // const handleButtonPress = useCallback((value) => {
  //   const lastChar = expressionRef.current.slice(-1);
  //   const secondLastChar = expressionRef.current[expressionRef.current.length - 2];

  //   const operators = ['+', '-', '*', '/'];
  //   const validExp = /^-?([0-9]+(\.[0-9]+)?)([\+\-\/\*]([0-9]+(\.[0-9]+)?))*$/;

  //   if (value === '0') {
  //     if (lastChar === '0' && operators.includes(secondLastChar) || expressionRef.current === '0') {
  //       updateExpression('');
  //     } else {
  //       updateExpression('0');
  //     }
  //   } else if (operators.includes(value)) {
  //     if (value === '-' && (expressionRef.current === '' || !operators.includes(lastChar))) {
  //       updateExpression(value);
  //     } else if (lastChar !== '' && !operators.includes(lastChar)) {
  //       updateExpression(value);
  //     }
  //   } else if (value === '.') {
  //     const lastNumber = expressionRef.current.split(/[\+\-\/\*]/).pop();
  //     if (!lastNumber.includes('.') && lastNumber !== '') {
  //       updateExpression(value);
  //     }
  //   } else if (value > 0 && value < 10) {
  //     if (lastChar === '0' && operators.includes(secondLastChar) || expressionRef.current === '0') {
  //       updateExpression('');
  //     } else {
  //       updateExpression(value.toString());
  //     }
  //   } else if (value === '=') {
  //     if (validExp.test(expressionRef.current)) {
  //       try {
  //         const result = eval(expressionRef.current);
  //         setExpression(result.toString());
  //         expressionRef.current = result.toString();
  //       } catch (error) {
  //         setError('Error');
  //       }
  //     } else if (expressionRef.current !== '') {
  //       setError('Invalid Expression');
  //     }
  //   }
  // }, [updateExpression]);


  const updateExpression = useCallback((value) => {
    setExpression((prev) => prev + value); // Update the expression directly
  }, []);

  const handleButtonPress = useCallback((value) => {
    const lastChar = expression.slice(-1);
    const secondLastChar = expression[expression.length - 2];

    const operators = ['+', '-', '*', '/'];
    const validExp = /^-?([0-9]+(\.[0-9]+)?)([\+\-\/\*]([0-9]+(\.[0-9]+)?))*$/;

    if (value === '0') {
      if ((lastChar === '0' && operators.includes(secondLastChar)) || expression === '0') {
        setExpression((prev) => prev.slice(0, -1)); // Avoid multiple leading zeros
      } else {
        updateExpression('0');
      }
    } else if (operators.includes(value)) {
      if (value === '-' && (expression === '' || !operators.includes(lastChar))) {
        updateExpression(value);
      } else if (lastChar !== '' && !operators.includes(lastChar)) {
        updateExpression(value);
      }
    } else if (value === '.') {
      const lastNumber = expression.split(/[\+\-\/\*]/).pop();
      if (!lastNumber.includes('.') && lastNumber !== '') {
        updateExpression(value);
      }
    } else if (value > 0 && value < 10) {
      if (lastChar === '0' && operators.includes(secondLastChar) || expression === '0') {
        setExpression((prev) => prev.slice(0, -1) + value); // Replace leading zero
      } else {
        updateExpression(value.toString());
      }
    } else if (value === '=') {
      if (validExp.test(expression)) {
        try {
          const result = eval(expression); // Calculate the result
          setExpression(result.toString()); // Update with the result
          setError('');
        } catch (error) {
          setError('Error');
        }
      } else if (expression !== '') {
        setError('Invalid Expression');
      }
    }
  }, [expression, updateExpression]);

 // Function to handle delete button press
  const handleDelete = useCallback(() => {
    if (expression !== '') {
      setExpression((prevExpression) => prevExpression.slice(0, -1));
      // setError('');
    }
  }, [expression]);
 

 

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
      <View style={[ styles.display]}  >
        <ScrollView horizontal scrollsT showsHorizontalScrollIndicator={false}>
          <TextInput
            style={[styles.displayText, { color: theme==='light' ? 'black' : 'black' }]}
            onChangeText={handleButtonPress}
            value={expression || '0'}
            editable={false}
            scrollEnabled
          />
        </ScrollView>
        <TouchableOpacity
          onPress={handleDelete}
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
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  
    //borderColor: 'red',
   
  },
  display: {
    height: 50,
    marginBottom: 20,
   
    borderRadius: 10,
    paddingRight: 50, // Adjust to prevent text overlap with delete icon
    paddingLeft: 10,
    
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  displayText: {
    fontSize: 24,
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
    bottom: -10,
    left: 5,
    color: 'red',
    fontSize: width>450 ? 15 : 12,
    fontFamily: 'Poppins-Regular',
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
    backgroundColor: 'lightblue',
    padding: 10,
  },
  buttonText: {
    fontSize: width>450 ? 20 :20,
    fontWeight: 'bold',
    textAlign:'right'
  },
});
