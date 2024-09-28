import React, { useState ,useEffect,useContext} from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, TouchableOpacity,Button } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../constants/Colors";
import { ThemeContext } from "../context/ThemeContext";
import CustomizedStatusBar from "../components/CustomizedStatusBar";

const Dot = ({ selected, theme }) => {
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: selected ? Colors[theme].secondaryButton : Colors[theme].primaryButton,
          width: selected ? 25 : 15,
        },
      ]}
    />
  );
};

const NextButton = ({ ...props }) => {
  const { theme } = props;
  return (
    <TouchableOpacity style={styles.nextButton} {...props}>
      <Text style={[styles.nextButtonText, { color: Colors[theme].header }]}>Next</Text>
    </TouchableOpacity>
  );
};

const DoneButton = ({ ...props }) => {
  const { theme } = props;
  return (
    <TouchableOpacity style={[styles.nextButton]} {...props}>
      <Text style={[styles.nextButtonText, { color: Colors[theme].header }]}> Done</Text> 
    
    </TouchableOpacity>
  );
};

const OnboardingScreen = () => {
  const navigation = useNavigation();
  //const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
 

  return (
    <>
    <CustomizedStatusBar 
        backgroundColor={Colors[theme].background}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        translucent
        hidden={false}
        animated
      />
    <Onboarding
      DotComponent={(props) => <Dot {...props} theme={theme} />}
      NextButtonComponent={(props) => <NextButton {...props} theme={theme} />}
      DoneButtonComponent={(props) => <DoneButton {...props} theme={theme} />}
      onDone={() => navigation.replace("Log")}
      bottomBarHighlight={false}
      bottomBarHeight={width * 0.22}
      showSkip={false}
      transitionAnimationDuration={1000}
      allowFontScaling={false}
      pages={[
        {
          backgroundColor: Colors[theme].background,
          image: (
            <Image
              source={require('../assets/images/budget-onboarding.png')}         
              style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
            />
          ),
          title: (
            <Text style={[styles.title, { color: Colors[theme].header , fontSize: width * 0.06 }]}>
              Seamless Expense Tracking
            </Text>
          ),
          subtitle: (
            <Text style={[styles.subtitle, {color: Colors[theme].text, fontSize: width * 0.05 }]}>
              Effortlessly monitor your spending with real-time updates and detailed insights.
            </Text>
          ),
        },
        {
          backgroundColor: Colors[theme].background,
          image: (
            <Image
              source={require('../assets/images/analytics-onboarding.png')}
              style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
            />
          ),
          title: (
            <Text style={[styles.title, { color: Colors[theme].header , fontSize: width * 0.06 }]}>
              Your Finances, Simplified
            </Text>
          ),
          subtitle: (
            <Text style={[styles.subtitle, {color: Colors[theme].text, fontSize: width * 0.05 }]}>
              All your financial data in one place, making budgeting and saving easier than ever.
            </Text>
          ),
        },
        {
          backgroundColor: Colors[theme].background,
          image: (
            <Image
              source={require('../assets/images/report-onboarding.png')}
              style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
            />
          ),
          title: (
            <Text style={[styles.title, { color: Colors[theme].header , fontSize: width * 0.06 }]}>
              Smart Spending Insights
            </Text>
          ),
          subtitle: (
            <Text style={[styles.subtitle, {color: Colors[theme].text, fontSize: width * 0.05 }]}>
              Receive personalized tips and recommendations to help you manage and optimize your budget.
            </Text>
          ),
        },
        {
          backgroundColor: Colors[theme].background,
          image: (
            <Image
              source={require('../assets/images/saving-onboarding.png')}
              style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
            />
          ),
          title: (
            <Text style={[styles.title, { color: Colors[theme].header , fontSize: width * 0.06 }]}>
              Reach Your Financial Goals
            </Text>
          ),
          subtitle: (
            <Text style={[styles.subtitle, {color: Colors[theme].text, fontSize: width * 0.05 }]}>
              Set and achieve your financial milestones with clear, actionable steps and progress tracking.
            </Text>
          ),
        }
        
      ]}
    />
  
    </>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 7,
    marginHorizontal: 5,
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 15,
  },
 
  nextButtonText: {
    fontSize: 20,
    fontWeight: "bold",

  },
  title:
  {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle:
  {
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    
  },
  image: {
    resizeMode: "contain",
    marginBottom: 10,
  },
});
