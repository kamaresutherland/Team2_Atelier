import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { useNavigation } from '@react-navigation/native'; 

/**
 * Settings page. The only page where the theme can be changed.
 */
const Settings = () => {
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
        <Text style={[styles.heading, isDark && styles.headingDark]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
       {/* <ThemeToggle /> */}
        <TouchableOpacity onPress={() => navigation.navigate('Preferences')}>
          <Text style={[styles.text, isDark ? styles.textDark : styles.text]}>Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export {Settings};

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
    alignItems: 'center',
  },
  heading: {
    color: '#000',
    textAlign: 'center',
    fontSize: 45,
    fontFamily: 'Manrope_700Bold',
  },
  headingDark: {
    color: '#fff',
  },
  text: {
    color: '#000',
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Manrope_700Bold',
  },
  textDark: {
    color: '#fff',
  },
});