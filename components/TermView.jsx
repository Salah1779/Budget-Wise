import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const TermView = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#C0C0C0', flex: 0.1
     }]}>
      <Text style={styles.text}>
        By using Budget Wise, you agree to our{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/terms')}
        >
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/privacy')}
        >
          Privacy Policy
        </Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  link: {
    color: '#1E90FF', // Link color
    textDecorationLine: 'underline',
  },
});

export default TermView;
