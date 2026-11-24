import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react';
//import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet,View} from 'react-native'
import {Home} from '../pages/Home';
import {Wardrobe} from '../pages/Wardrobe';
import {Stylist} from '../pages/Stylist';
import {Settings} from '../pages/Settings'
//import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';

// importing icons for bar 
import { Ionicons } from '@react-native-vector-icons/ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

//import ClosetScreen from '../screens/ClosetScreen';
//import AddItemScreen from '../screens/AddItemScreen';


// Description: This file contains the navigation bar that is used once logged in 
// Here you can change the styling of the navigation bar, what pages appear on it, where they direct to, etc.


const Tab = createBottomTabNavigator();


function MyTabs() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

  
  return (
   <Tab.Navigator
  screenOptions={{
    tabBarStyle: isDark ? styles.themeDark : styles.themeLight,
    tabBarItemStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50, // Matches tabBarStyle height so items center vertically
    },
    tabBarLabelStyle: { // page text 
      fontSize: 10,
      fontFamily: 'Manrope_400Regular',
     // fontWeight: 'bold',
    },
  }}
>

      <Tab.Screen name="Home" component={Home} options={{headerShown: false,  tabBarIcon: ({focused}) => <FontAwesome name="home" size={24} color={focused ? styles.tabBarActiveTintColor : styles.tabBarInactiveTintColor} />  }}/> 
      <Tab.Screen name="Wardrobe" component={Wardrobe} options={{headerShown: false,  tabBarIcon: ({focused}) => <MaterialCommunityIcons name="wardrobe" size={24} color={focused ? styles.tabBarActiveTintColor  : styles.tabBarInactiveTintColor} />  }} />
      <Tab.Screen name="Stylist" component={Stylist} options={{headerShown: false, tabBarIcon: ({focused}) => <FontAwesome name="paint-brush" size={24} color={focused ? styles.tabBarActiveTintColor  : styles.tabBarInactiveTintColor} />  }} />
      <Tab.Screen name="Settings" component={Settings} options={{headerShown: false, tabBarIcon: ({focused}) => <MaterialIcons name="app-settings-alt" size={24} color={focused ? styles.tabBarActiveTintColor : styles.tabBarInactiveTintColor} />  } } />
    </Tab.Navigator>
   
  );
  
}

export {MyTabs};


const styles = StyleSheet.create({

  themeDark: { // navigation bar in dark mode
      backgroundColor: '#091217',
      width: 300,
      height: 50,
      borderRadius: 55, // Half of height (50) for a clean pill shape
      borderColor:"#000",
      borderWidth:1,
      paddingHorizontal: 10,
      alignSelf: 'center', // Centers the 300px tab bar horizontally on screen
      justifyContent: 'center',
      fontSize: 10,
      fontFamily: 'Manrope_400Regular',
    },
    themeLight: { // navigation bar in light mode
      backgroundColor: '#fff',
      width: 300,
      height: 50,
      borderRadius: 25, // Half of height (50) for a clean pill shape
      borderColor:"#fff",
      borderWidth:1,
      paddingHorizontal: 10,
      alignSelf: 'center', // Centers the 300px tab bar horizontally on screen
      justifyContent: 'flex-end',
    },
    tabBarActiveTintColor: '#2563EB',
    tabBarInactiveTintColor: '#9CA3AF',
    

});