import {useContext}  from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import {Colors} from '../constants/Colors';
import { ThemeContext } from '../context/ThemeContext';
import {clamp} from 'react-native-reanimated';
const GOOGLE_BLUE = '#4285F4';
const {width}=Dimensions.get('window');
const MenuScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const sections = [
    {
      icon: 'person',
      title: 'Profile',
      body: 'View and update your personal information, including name, gender, and password. ',
      screen: 'UserProfile',
    },
    
    {
      icon: 'palette',
      title: 'Theme',
      body: 'Customize the app appearance by choosing between light, dark, and system default themes.',
      screen: 'Theme',
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      body: 'Manage notification preferences for important updates, reminders, and budgeting alerts..',
      screen: 'NotificationsSetting',
    },
    {
      icon: 'lock',
      title: 'Security',
      body: "Enhance the security of your account by\nenabling PIN code authentication and Fingerprint .",
      screen: 'Security',
    },
    {
      icon: 'privacy-tip',
      title: 'Privacy & Data',
      body: " manage how your personal data is collected, used, and shared..",
      screen: 'PersonalDataPrivacy',
    },
  ];
  
  //{backgroundColor:Colors[theme].cardBackground}
  const renderSection = ({ item }) => {
    return (
      <TouchableOpacity
         activeOpacity={1}
        onPress={() => navigation.navigate(item.screen)}
        style={[styles.sectionContainer,]}
      >
        <MaterialIcons name={item.icon} size={24} color={GOOGLE_BLUE} />
        <View style={[styles.textContainer]}>
            <Text style={[styles.title,{color:theme==='dark'?'lightgrey':Colors[theme].header}]}>{item.title}</Text>
            <Text style={[styles.body,{color:theme==='dark'?'#888':Colors[theme].text}]}>{item.body}</Text>
        </View>
       
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 ,backgroundColor:Colors[theme].background}}>
        <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item, index) => index.toString()} // Use index as a unique key
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    </View>
  );
};

export default MenuScreen;
const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal:15,
    flexDirection: 'row',
    alignItems: 'center',
    gap:15,
  },
  textContainer: {
    flexDirection: 'column',
    //paddingRight:20,
   
    
  },
  title: {
  
    fontSize:clamp(width*0.04, 15, 22),
    fontWeight: 'bold', 
    
  },
  body: {
    fontSize: clamp(width*0.023, 13, 20),
    fontFamily: 'Poppins-Regular',
    paddingRight:10,
    flexShrink: 1,
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  
  separator: {
    height: 1,
   
  },
});

