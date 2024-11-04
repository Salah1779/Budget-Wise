import React, { useEffect,useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Button, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { ThemeContext } from '../context/ThemeContext';
import {Colors} from '../constants/Colors';

const { height,width } = Dimensions.get('window');

const BottomSheetModal = ({ isVisible, onClose, children, SheetHeight =height*0.8}) => {
  const { theme } = useContext(ThemeContext);
  const translateY = useSharedValue(0);
  const sheetHeight = SheetHeight;

  // Define the pan gesture handler
  const panGesture = Gesture.Pan()
    .onStart((event, context) => {
      context.startY = translateY.value;
    })
    .onUpdate((event, context) => {
      translateY.value = Math.max(context.startY + event.translationY, 0); // Prevent upward movement beyond 0
    })
    .onEnd(() => {
      if (translateY.value > sheetHeight / 2) {
        translateY.value = withSpring(sheetHeight, {}, () => runOnJS(onClose)());
      } else {
        translateY.value = withSpring(0);
      }
    });

  // Define the animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Open the modal smoothly when visible
  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0); // Open the modal smoothly
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={[styles.modal,]}
      animationIn="slideInUp"
      animationOut="slideOutDown"
     useNativeDriverForBackdrop // Improve performance on backdrop interactions
     onBackButtonPress={onClose}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheetContainer, { height: sheetHeight }, animatedStyle, { backgroundColor: Colors[theme].background }]}>
         
            {children}
           
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  button: {
    marginTop: 20,
    borderRadius:20,
  },
});

export default BottomSheetModal;
