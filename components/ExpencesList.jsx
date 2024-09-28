import { View, Text, FlatList,StyleSheet, ActivityIndicator,Image,Dimensions } from 'react-native'
import React from 'react'
import Expence from './Expence'
import {useState,useContext} from 'react'
import {ThemeContext} from '../context/ThemeContext'
import { clamp } from 'react-native-reanimated';

const {height,width}=Dimensions.get('window')
const ExpencesList = ({expenceData=[],
                      contentContainerStyle={},
                      titleStyle = {},
                      dateStyle = {},
                      amountStyle = {},
                      articleStyle = {},
                      refreshFetch ,
                    }) => {
    const {theme,searchQuery} = useContext(ThemeContext)
    const [loading,setLoading] = useState(false)
    return (
      expenceData.length > 0 ? (
        <FlatList
          style={{marginTop: 10}}
          data={expenceData}
          renderItem={({ item }) => (
            <Expence
              category={item.cat}
              amount={item.expence_amount}
              date={item.date}
              article={item.article}
              contentContainerStyle={contentContainerStyle}
              titleStyle={titleStyle}
              dateStyle={dateStyle}
              amountStyle={amountStyle}
              articleStyle={articleStyle}
            />
          )}
          keyExtractor={(item) => item.id_expence}
          showsVerticalScrollIndicator={false}
          
         
          ItemSeparatorComponent={() => <View style={{ height: 10, width: 10 }} />}
          scrollEnabled={true}
          refreshing={loading}
          onRefresh={() => {
            //refreshFetch();
            setLoading(false);
          }}
        />
      ) : searchQuery.length > 0 ? (
        <Image
          source={require('../assets/images/NotFound.png')}
          style={[{width:clamp(width*0.51,160,267),height:clamp(height*0.23,148,240),left:10},styles.empty]}
        />
      ) : (
        <Image
          source={require('../assets/images/noExpense.png')}
          style={[styles.empty,{width:120,height:100}]}
        />
      )
    );
    
}

export default ExpencesList;

const styles = StyleSheet.create({
  empty:{
    
    alignSelf: 'center',
    porition: 'relative',
    top:height*0.14,
    // width:267,
    // height:240,

  
      
    
  }
})