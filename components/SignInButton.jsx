// GoogleSignInButton.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const SignInButton = ({ signin , icon, colorIcon='#4285F4' , label,size=20, buttonColor='#4285F4' }) => {
  return (
    <TouchableOpacity style={[styles.button,{backgroundColor: buttonColor}]} onPress={signin}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={size} color={colorIcon} />
      </View>
      <Text style={[styles.buttonText,styles.font]} >{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    backgroundColor: '#4285F4', // Google blue color
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 10,
    
    
    
  },
  iconContainer: {
    
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -6,
   
    
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  font:
  {
    fontFamily: "Poppins-Regular",
  }
});

export default SignInButton;
