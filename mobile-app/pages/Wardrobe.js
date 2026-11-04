import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavBar } from '../components/Navbar';
import {ClothingItemForm} from '../components/ClothingForm'; // must be converted to React Native first

const Wardrobe = () => {
  const [theme, setTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const isDark = theme === 'dark';

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
    if (!themeLoaded) return;
    AsyncStorage.setItem('theme', theme).catch((e) =>
      console.log('Could not save theme', e)
    );
  }, [theme, themeLoaded]);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Page title bar */}
      <View style={[styles.titleBar, isDark ? styles.titleBarDark : styles.titleBarLight]}>
        <Text style={[styles.heading, isDark && styles.textDark]}>Wardrobe</Text>
      </View>

      <NavBar theme={theme} setTheme={setTheme} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.test, isDark && styles.textDark]}>Test</Text>

        <View style={styles.formArea}>
          <ClothingItemForm /> {/*this holds the form to fill out new clothes */}
        </View>
      </ScrollView>
    </View>
  );
};

export {Wardrobe};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  titleBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleBarLight: { backgroundColor: 'rgba(255,255,255,0.85)' },
  titleBarDark: { backgroundColor: 'rgba(17,24,39,0.9)' },
  heading: {
    fontSize: 48,
    textAlign: 'center',
    color: '#000',
    // fontFamily: 'Bungee_400Regular', // whichever font your "heading" class used
  },
  test: {
    fontSize: 48,
    textAlign: 'center',
    paddingTop: 20,
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  formArea: {
    alignItems: 'flex-start', // the web version's "flex-start" intent
  },
});