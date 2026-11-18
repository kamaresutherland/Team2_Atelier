import {MyTabs} from "../components/HomeBar";
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Blank = () => {
   const { theme } = useTheme();
   const isDark = theme === 'dark';
return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.container]}>
      <MyTabs/> {/* Home Bar */}
    </View>
  );
};

export {Blank};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:5,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#091217',
  },
});