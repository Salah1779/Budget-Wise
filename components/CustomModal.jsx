import React,{useContext} from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const { width,height} = Dimensions.get('window');

const CustomModal = ({ visible, onClose , children, modalStyle = {}, titleStyle = {}, contentStyle = {}, animationType = "fade" }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
      onBackButtonPress={onClose}
      onDismiss={onClose}
      shouldRasterizeIOS
      useNativeDriverForBackdrop
      modalBackgroundStyle={{ backgroundColor: 'black' }}
      
    >
      <View style={styles.modalBackground}>
      <Animated.View 
        style={[
          styles.modalContainer, 
          modalStyle,
          Platform.select({
            ios: theme === 'light' ? {
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            } : {},
            android: {
              elevation: theme === 'light' ? 5 : 0,
            },
          })
        ]}
      >
         
            {children}
          
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: width * 0.8 ,
    height: height * 0.5,
    borderRadius: 10,
    padding: 20,
   
  
  
  },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 10,
  // },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
  // closeButton: {
  //   padding: 10,
  // },
  // closeButtonText: {
  //   fontSize: 16,
  //   color: '#007BFF',
  // },
  // content: {
  //   marginTop: 10,
  // },
});

export default CustomModal;
