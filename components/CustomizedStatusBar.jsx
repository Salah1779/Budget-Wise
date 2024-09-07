import React from 'react';
import { StatusBar, View, Platform, StyleSheet } from 'react-native';

const CustomizedStatusBar = ({
  backgroundColor = 'midnightblue',
  barStyle = 'light-content',
  translucent = false,
  hidden = false,
  networkActivityIndicatorVisible = false,
  showHideTransition = 'fade',
  animated = true,
  ...props
}) => {
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar
        translucent={translucent}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        hidden={hidden}
        networkActivityIndicatorVisible={networkActivityIndicatorVisible}
        showHideTransition={showHideTransition}
        animated={animated}
        {...props}
      />
    </View>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default CustomizedStatusBar;
