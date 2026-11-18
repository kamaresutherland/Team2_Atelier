import React from 'react';
import { View, Text, ScrollView, StyleSheet,TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeContext';
//import { NavBar } from '../components/Navbar';

import { useNavigation } from '@react-navigation/native'; 


/**
 * Home page. Reads the shared theme; the theme can only be changed in Settings.
 */
const Wardrobe = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navigation = useNavigation();

  
  const goTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Page title bar */}
      <View style={[styles.titleBar, isDark ? styles.titleBarDark : styles.titleBarLight]}>
        <Text style={[styles.heading, isDark && styles.textDark]}>Wardrobe</Text>
      </View>

      {/*<NavBar theme={theme} />*/}

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('Closet')}>
                  <Text style={[styles.textLight, isDark ? styles.textDark : styles.textLight]}>Access you clothes here!</Text>
                </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddItem')}>
                  <Text style={[styles.textLight, isDark ? styles.textDark : styles.textLight]}>Add clothes here!</Text>
                </TouchableOpacity>
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
    textAlign: 'center',
  },
  textLight: {
    color:"#000",
    textAlign: 'center',
  }
});