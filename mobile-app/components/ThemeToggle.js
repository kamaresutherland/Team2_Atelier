import React from 'react';
import { TouchableOpacity, Image, StyleSheet, ScrollView, Text} from 'react-native';
import { useTheme } from './ThemeContext';

const SUN_ICON = require('../assets/images/sun_icon.png');
const MOON_ICON = require('../assets/images/moon_icon.png');

/**
 * Button that switches the whole app between light and dark mode.
 * Only rendered on the Settings page.
 */
 function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark ? styles.containerDark : styles.container]}>
      <Text style={[styles.text, isDark ? styles.textDark : styles.textLight]}>Toggle Theme
    <TouchableOpacity
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      style={styles.button}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Image source={isDark ? SUN_ICON : MOON_ICON} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
    </Text>
      </ScrollView>
  );
}

export {ThemeToggle};

const styles = StyleSheet.create({
  button: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    gap:12,
    //justifyContent: 'flex-end',
  },
  containerDark: {
    flex:1,
    backgroundColor: '#091217',
    gap:2,
  },
  textDark: {
    color: '#fff',
  },
  textLight: {
    color: '#000',
  },
});