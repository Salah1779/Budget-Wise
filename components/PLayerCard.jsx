import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"

function PLayerCard({ Player, Nation, club, position, rating, CardStyle, borderColor }) {
  return (
    <View style={[CardStyle, styles.card]}>
        <View style={[styles.container, { justifyContent: 'space-between' }]}>
          <Text>{club}</Text>
          <Text>{Nation}</Text>
        </View>
        <View style={styles.container}>
          <Text>{Player}</Text>
          <TouchableOpacity disabled style={[styles.Button, { borderColor }]}>
            <Text style={styles.buttonText}>{position}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text>{rating}</Text>
        </View>
    </View>
  )
}

export default PLayerCard

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  Button: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
  card: {

    padding: 10,
    borderRadius: 10,
    borderWidth:2,
    borderColor:'#000',

    
  },
  buttonText: {
    color: 'black',
  },
})
