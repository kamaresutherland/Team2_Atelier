import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Copy your image from frontend/src/assets into mobile-app/assets and match the filename here
const wardrobeDark = require('../assets/images/wardrobe_dark.png');
const wardrobeLight = require('../assets/images/wardrobe_light.png');

const Hero = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.welcome, isDark && styles.textDark]}>
        Welcome back Kam!
      </Text>

      <Text style={[styles.title, isDark && styles.textDark]}>
        Your personal closet,{' '}
        <Text style={styles.highlight}>right on your phone</Text>
      </Text>

    <br/>

      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Create and planning outfits from your fingertips!
      </Text>

      <View style={styles.imageWrapper}>
        <Image source={isDark ? wardrobeLight : wardrobeLight} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
};

export default Hero;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 60,
    paddingHorizontal: 16,
    gap: 24,
  },
  welcome: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  title: {
    fontSize: 84,
    fontWeight: '500',
    lineHeight: 80,
    textAlign: 'center',
    color: '#374151',
    //fontFamily: 'ChangaOne_400Regular',
  },
  highlight: {
    color: '#5044E5',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 500,
  },
  subtitleDark: {
    color: 'rgba(255,255,255,0.75)',
  },
  textDark: {
    color: '#fff',
  },
  imageWrapper: {
    width: '100%',
  },
  image: {
    width: '80%',
    height:'80%',
    aspectRatio: 2, // adjust to match your image's width/height
    alignSelf: 'center',
  },
});