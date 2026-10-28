import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';


const ThemeToggle = ({ theme, setTheme }) => {
  const isDark = theme === 'dark';
  const sun = require('../assets/images/sun_icon.png');
  const moon = require('../assets/images/moon_icon.png');

  return (
    <TouchableOpacity
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      style={styles.button}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Image source={isDark ? sun : moon} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { 
    width:25, 
    height: 25,
  },
});