import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Expence from './Expence'
import {useContext} from 'react'
import {ThemeContext} from '../context/ThemeContext'


const ExpencesList = ({expenceData=[]}) => {
    const {theme} = useContext(ThemeContext)
  return (
    <FlatList 
    style={{marginBottom:10}}
    data={expenceData}
    renderItem={({item}) => <Expence category={item.category} 
                             amount={item.amount}
                             date={item.date}
                             methode={item.method}
                             currency={item.currency}
                            
                             />}
    keyExtractor={(item) => item.id}
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={<Text style={{textAlign:'center', 
                        fontSize:18,
                        color:theme==='dark'?'lightgray':'grey',
                        fontStyle:'italic'}}>
                            No Expeces Found
                        </Text>}  
    ItemSeparatorComponent={() => <View style={{height:10,width:10}}/>} 
    scrollEnabled={true}
    
    
    
    />
    
    
  )
}

export default ExpencesList