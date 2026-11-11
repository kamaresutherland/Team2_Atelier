import {MyTabs} from "../components/HomeBar";
import { View, StyleSheet } from 'react-native';

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Blank = () => {
  const [theme, setTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load the saved theme once on mount (replaces localStorage.getItem)
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('theme');
        if (saved) setTheme(saved);
      } catch (e) {
        console.log('Could not load theme', e);
      } finally {
        setThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save the theme whenever it changes (replaces localStorage.setItem)
  useEffect(() => {
    if (!themeLoaded) return; // avoid overwriting the saved value with the default
    AsyncStorage.setItem('theme', theme).catch((e) =>
      console.log('Could not save theme', e)
    );
  }, [theme, themeLoaded]);

return (
    <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
      <MyTabs/> {/* Home Bar */}
    </View>
  );
};

export {Blank};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#fff',
  },
});