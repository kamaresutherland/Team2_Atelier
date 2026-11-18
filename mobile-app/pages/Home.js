import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext';
//import { NavBar } from '../components/Navbar';

/**
 * Home page. Reads the shared theme; the theme can only be changed in Settings.
 */
const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Page title bar */}
      <View style={[styles.titleBar, isDark ? styles.titleBarDark : styles.titleBarLight]}>
        <Text style={[styles.heading, isDark && styles.textDark]}>Home</Text>
      </View>

      {/*<NavBar theme={theme} />*/}

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
  heading: {
    color: '#000',
    textAlign: 'center',
    fontSize: 45,
    fontFamily: 'Manrope_700Bold',
  },
  textDark: {
    color: '#fff',
  },
});