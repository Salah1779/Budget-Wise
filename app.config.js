export default {
  expo: {
    scheme: "budgetwise",
    name: "Budget Wise",
    slug: "mobApp",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    platforms: ["ios", "android"],
    // jsEngine: "hermes",
    plugins: [
      "@react-native-google-signin/google-signin",
       "expo-font"
      

      ],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.salah.budgetwise",
      googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST, // Ensure this environment variable is correctly set
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.salah.budgetwise",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSN, // Ensure this environment variable is correctly set
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "e992371a-a3e4-4498-b485-2c0ce7904525",
      },
    },
    owner: "salah-dev",
  },
};
