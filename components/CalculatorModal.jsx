import { View, Text ,Dimensions,TouchableOpacity,StyleSheet} from 'react-native'
import React,{useState,useCallback, useEffect,useContext} from 'react'
import { ThemeContext } from '../context/ThemeContext'
import Calculator from './Calculator';
import CustomModal from './CustomModal';
import { Colors } from '../constants/Colors';

const {width}= Dimensions.get('window');
const CalculatorModal = ({Style={}}) => {

    const { theme ,result,setResult,expression,setExpression,showCalculator,setShowCalculator } = useContext(ThemeContext);

   
    

    const retrieveResult = () => {
        const validDoublePattern = /^\d+(\.\d+)?$/;
      
        if (validDoublePattern.test(expression)|| expression==='')
         {
      
          setShowCalculator(false); 
          setResult(expression===''? 0 :expression);  
          setExpression('');  
             
        } 
        
        }
   
  return (
    <CustomModal visible={showCalculator} onClose={() => setShowCalculator(false)}    modalStyle={Style}  >

            <Calculator />
                <View style={[styles.buttonContainer,{flex:0.2}]}>
                  <TouchableOpacity  onPress={()=>{ setExpression('')}}>
                    <Text style={[styles.textModal,{color:Colors[theme].secondaryButton}]}>CLEAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonModal}  onPress={retrieveResult}>
                    <Text style={[styles.textModal,{color:Colors[theme].primaryButton}]}>INSERT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonModal} onPress={()=>{setShowCalculator(false); setResult(0)}}>
                    <Text style={[styles.textModal]}>CANCEL</Text>
                  </TouchableOpacity>

                </View>
        </CustomModal> 
  )
}

export default CalculatorModal;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  textModal: {
    fontSize: width>400 ? 19 : 17,
    textAlign: 'center',
    fontFamily:'Poppins-Regular',
    
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 35,
  
  
  },
});