import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import { clamp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const NotificationsSetting = () => {
  const { theme } = useContext(ThemeContext);
  const [notificationSettings, setNotificationSettings] = useState({
    budgetExceeded: true,
    budgetClose: false,
    monthlyReport: true,
    savingsGoal: false,
    recommendations: true,
  });

  const settings = [
    {
      title: 'Notify if budget is exceeded',
      key: 'budgetExceeded',
    },
    {
      title: 'Notify if budget is close to being exceeded',
      key: 'budgetClose',
    },
    {
      title: 'Notify when the monthly report is ready',
      key: 'monthlyReport',
    },
    {
      title: 'Notify when a savings goal is successful',
      key: 'savingsGoal',
    },
    {
      title: 'Send recommendations and advice',
      key: 'recommendations',
    },
  ];

  const toggleSwitch = (key) => {
    setNotificationSettings((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const renderNotificationSetting = ({ item }) => {
    return (
      <View style={styles.settingContainer}>
        <Text style={[styles.settingText, { color: Colors[theme].text }]}>
          {item.title}
        </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#4285F4' }}
          thumbColor={notificationSettings[item.key] ? '#4285F4' : '#f4f3f4'}
          onValueChange={() => toggleSwitch(item.key)}
          value={notificationSettings[item.key]}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <FlatList
        data={settings}
        renderItem={renderNotificationSetting}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default NotificationsSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  settingText: {
    fontSize: clamp(width * 0.034, 13, 22),
    fontFamily: 'Poppins-Regular',
    flexShrink: 1, 
    flexWrap: 'wrap', 
    marginRight: 10, 
    //flexGrow: 1, 
  },
  separator: {
    height: 0.3,
    backgroundColor: 'lightgrey',
    width: '80%',
    alignSelf: 'center',
  },
});
