import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Copy your image from frontend/src/assets into mobile-app/assets and match the filename here
const wardrobeDark = require('../assets/images/wardrobe_dark.png');
const wardrobeLight = require('../assets/images/wardrobe_light.png');

const Hero = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
     {/* } <Text style={[styles.welcome, isDark && styles.textDark]}>
        Welcome back Kam!
      </Text> */}

      <Text style={[styles.title, isDark && styles.textDark]}>
        Your personal closet,{' '}
        <Text style={styles.highlight}>right on your phone</Text>
      </Text>

   

      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Create and planning outfits from your fingertips!
      </Text>

      <View style={styles.imageWrapper}>
        <Image source={isDark ? wardrobeLight : wardrobeLight} style={styles.image} resizeMode="contain" />
      </View>

      <Text style={[styles.topic, isDark && styles.textDark, isDark ? styles.glowDark : styles.glow]}>
       About
      </Text>

    

      <Text style={[styles.topic, isDark && styles.textDark, isDark ? styles.glowDark : styles.glow]}>
       Features
      </Text>

  

    </View>

  );
};

export default Hero;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 16,
    gap: 24,
  },
  welcome: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
   paragraph: {
    fontSize: 16,
    color: '#374151',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 44,
    fontWeight: '500',
    //lineHeight: 50,
    textAlign: 'center',
    color: '#374151',
   // paddingVertical:50,
    //fontFamily: 'ChangaOne_400Regular',
  },
  topic: {
    fontSize: 55,
    fontWeight: '500',
    display: 'flex',
    justifyContent: 'center', /* Centers horizontally */
    alignItems: 'center',
    color: '#6b7280',
    textAlign: 'center',
   // fontFamily: 'ArchivoBlack_400Regular',
  },

  glow:{
    color: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 150,
    borderRadius: 200,
    backgroundColor: '#fff',
    padding: 10,
    boxSizing: 'border-box',
    
    // iOS Glow Properties
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 0 }, // Center the glow
    shadowOpacity: 0.8,
    shadowRadius: 30, // Higher numbers = softer, wider glow
    
    // Android Fallback
    elevation: 15,
   // fontFamily: 'ChangaOne_400Regular',
  },

    glowDark:{
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 150,
    borderRadius: 200,
    backgroundColor: '#007bff',
    padding: 10,
    boxSizing: 'border-box',
    
    // iOS Glow Properties
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 0 }, // Center the glow
    shadowOpacity: 1,
    shadowRadius: 50, // Higher numbers = softer, wider glow
    
    // Android Fallback
    elevation: 15,
   // fontFamily: 'ChangaOne_400Regular',
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
    width: '100%',
    height:'45%',
    aspectRatio: 2, // adjust to match your image's width/height
    alignSelf: 'center',
  },
});