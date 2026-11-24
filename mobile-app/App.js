import React from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';

import { useFonts } from 'expo-font';
import { Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { RockSalt_400Regular } from '@expo-google-fonts/rock-salt';
import { Bungee_400Regular } from '@expo-google-fonts/bungee';
import { CarterOne_400Regular } from '@expo-google-fonts/carter-one';
import { EricaOne_400Regular } from '@expo-google-fonts/erica-one';
import { ChangaOne_400Regular } from '@expo-google-fonts/changa-one';
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LandingScreen } from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import { Blank } from './screens/Navigation';
import { Home } from './pages/Home';
import { Wardrobe } from './pages/Wardrobe';
import { Stylist } from './pages/Stylist';
import { Settings } from './pages/Settings';
import { Preferences } from './pages/SubSettings/Preferences';
import SignUpScreen from './screens/NewSignUpScreen';
import ClosetScreen from './pages/SubWardrobe/ClosetScreen';
import AddItemScreen from './pages/SubWardrobe/AddItemScreen';

const Stack = createNativeStackNavigator();

/**
 * All screens and routing. Must be rendered inside ThemeProvider
 * so the header colors can follow the shared theme.
 */
function AppNavigator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <NavigationContainer> {/* acts as the routing for the website/app */}
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? '#091217' : '#fff' }, // header background
          headerTintColor: isDark ? '#fff' : '#000', // back button color
          headerTitleStyle: { color: isDark ? '#fff' : '#091217' }, // title text color
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Blank" component={Blank} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Wardrobe" component={Wardrobe} options={{ headerShown: false }} />
        <Stack.Screen name="Stylist" component={Stylist} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen
          name="Preferences"
          component={Preferences}
          options={{ title: 'Preferences', headerBackTitle: 'Back' }} // headerBack... is the back button
        />
        <Stack.Screen
          name="Closet"
          component={ClosetScreen}
          options={{ title: 'My Closet', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: 'Add to Closet', headerBackTitle: 'Back' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Root of the app. Loads fonts, then provides the shared theme to everything.
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
    RockSalt_400Regular,
    Bungee_400Regular,
    CarterOne_400Regular,
    EricaOne_400Regular,
    ChangaOne_400Regular,
    ArchivoBlack_400Regular,
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

// Note: Signup and ForgotPassword screens referenced inside LoginScreen.js
// aren't wired in here yet since those files haven't been added to this
// project. Add them to the Stack.Navigator above once they exist.