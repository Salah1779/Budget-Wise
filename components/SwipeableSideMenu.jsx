import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SwipeableSideMenu = ({ menuItems, drawerWidth = width * 0.75, menuStyle = {}, itemStyle = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animationValue = useRef(new Animated.Value(-drawerWidth)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx > 10 || gestureState.dx < -10;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newPosX = gestureState.dx - (isOpen ? drawerWidth : 0);
        if (newPosX <= 0 && newPosX >= -drawerWidth) {
          animationValue.setValue(newPosX);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const shouldOpen = gestureState.dx > drawerWidth / 2;
        Animated.timing(animationValue, {
          toValue: shouldOpen ? 0 : -drawerWidth,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsOpen(shouldOpen);
        });
      },
    })
  ).current;

  const toggleMenu = () => {
    Animated.timing(animationValue, {
      toValue: isOpen ? -drawerWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(!isOpen);
    });
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: animationValue }] }, menuStyle]}>
        {menuItems.map((item, index) => (
          <Text key={index} onPress={item.onPress} style={[styles.menuItem, itemStyle]}>
            {item.label}
          </Text>
        ))}
      </Animated.View>

      <View style={styles.mainContent}>
        <Text onPress={toggleMenu} style={styles.toggleText}>
          {isOpen ? 'Close Menu' : 'Open Menu'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 15,
    fontSize: 18,
    color: '#333',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 20,
    color: '#007BFF',
  },
});

export default SwipeableSideMenu;
