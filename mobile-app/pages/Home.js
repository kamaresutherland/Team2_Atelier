import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { NavBar } from '../components/Navbar';

const Home = () => {
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
        <Text style={[styles.heading, isDark && styles.textDark]}>Home</Text>
      </View>

      {/*<NavBar theme={theme} setTheme={setTheme} />*/}

      <ScrollView contentContainerStyle={styles.content}>
      </ScrollView>
    </View>
  );
};

export {Home};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#091217',
  },
  titleBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  titleBarLight: { backgroundColor: 'rgba(255,255,255,0.85)' },
  titleBarDark: { backgroundColor: '#091217' },
  content: {
    padding: 16,
  },
  heading:{
    color:'#000',
    textAlign: 'center',
    fontSize:45,
    justifyContent: "center",
    fontFamily: 'Manrope_700Bold',
  },
  textDark: {
    color:'#fff',
  },
});