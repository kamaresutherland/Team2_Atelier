import React from 'react';

import { useFonts } from 'expo-font';
import { Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { RockSalt_400Regular } from '@expo-google-fonts/rock-salt';
import { Bungee_400Regular } from '@expo-google-fonts/bungee';
import { CarterOne_400Regular } from '@expo-google-fonts/carter-one';
import { EricaOne_400Regular } from '@expo-google-fonts/erica-one';
import { ChangaOne_400Regular } from '@expo-google-fonts/changa-one';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import {Home} from './pages/Home';
import {Stylist} from './pages/Stylist';
import ClosetScreen from './ClosetScreen';
import AddItemScreen from './AddItemScreen';



const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
    RockSalt_400Regular,
    Bungee_400Regular,
    CarterOne_400Regular,
    EricaOne_400Regular,
    ChangaOne_400Regular,
  });

  if (!fontsLoaded) return null; // or a loading spinner

  return (
    <NavigationContainer> {/* acts as the routing for the website/app */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stylist"
          component={Stylist}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Closet"
          component={ClosetScreen}
          options={{ title: 'My Closet' }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: 'Add to Closet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Note: Signup and ForgotPassword screens referenced inside LoginScreen.js
// aren't wired in here yet since those files haven't been added to this
// project. Add them to the Stack.Navigator above once they exist.
