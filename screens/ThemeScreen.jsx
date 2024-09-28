import { View, Text ,TouchableOpacity,StyleSheet,Dimensions,Switch} from 'react-native'
import {useState,useContext, useEffect} from 'react'
import { ThemeContext } from '../context/ThemeContext';
import {Colors} from  '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconTheme  from 'react-native-vector-icons/Ionicons';
import { storeData,getData } from '../helpers/AsynchOperation';

const RADIO_ACTIVE_COLOR = '#4285F4';
const ThemeScreen = () => {
    const {theme,setTheme,systemChosen,setSystemChosen} =useContext(ThemeContext);
   
  return (
    <View style={{ flex: 1,backgroundColor:Colors[theme].background }}>
      <TouchableOpacity  
          
         activeOpacity={1}
         onPress={() => {
            setSystemChosen(true)
            storeData('systemChosen',true)
           }
         }
         style={[styles.containerCard,{opacity:!systemChosen ? 0.7 : 1,}]}
      >
        <Text style={[styles.text,{color:Colors[theme].text}]}>System theme default</Text>
        <Icon name={systemChosen ? "check-circle":"circle-thin"} size={25} color={RADIO_ACTIVE_COLOR } /> 
      </TouchableOpacity>
      <TouchableOpacity  
          activeOpacity={1}
         onPress={() => {
            setSystemChosen(false)
            storeData('systemChosen',false)
            }
         }
         style={[styles.containerCard,{opacity:systemChosen ? 0.7 : 1,}]}
      >
        <Text style={[styles.text,{color:Colors[theme].text}]}>Local theme</Text>
        <Icon name={!systemChosen ? "check-circle":"circle-thin"} size={25} color={RADIO_ACTIVE_COLOR } /> 
      </TouchableOpacity>
     {!systemChosen && <View style={[styles.containerCard,]}>
        <Text style={[styles.text,{color:Colors[theme].text}]}>Switch to the {theme==='dark' ? "light" : "dark"} mode</Text>
        <IconTheme name= {theme==='dark' ? "sunny-sharp":"moon-sharp"} size={25} color={RADIO_ACTIVE_COLOR } onPress={() => setTheme(theme==='dark' ? 'light' : 'dark')}/>
      </View>
      }
    </View>
  )
}

export default ThemeScreen;

const styles = StyleSheet.create({
    text:{
        fontFamily:'Poppins-Regular',
        fontSize:17,

    
    },
    containerCard:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:20,
        paddingVertical:20,
    },
     
})