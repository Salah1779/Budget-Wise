import React, { createContext, useState } from 'react';
export const BudgetContext = createContext(); 


export const BudgetProvider = ({ children }) => {
  const [result, setResult] = useState(0);
  const [expression, setExpression] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <BudgetContext.Provider
      value={{
        expression,
        setExpression,
        result,
        setResult,
        showCalculator,
        setShowCalculator,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};


export const ExpenseContext = createContext();
export const ExpenseProvider = ({ children }) => {
    const [result, setResult] = useState(0);
    const [expression, setExpression] = useState('');
    const [showCalculator, setShowCalculator] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
  
    return (
      <ExpenseContext.Provider
        value={{
          expression,
          setExpression,
          result,
          setResult,
          showCalculator,
          setShowCalculator,
          filteredList,
          setFilteredList
        }}
      >
        {children}
      </ExpenseContext.Provider>
    );
  };