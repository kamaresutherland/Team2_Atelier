import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThemeToggle from './ThemeToggle';
import {About} from '../components/About';


//Description: This file contains the Navigation bar that is used on the Landing page such as login, sign up

// Screen names must match the <Stack.Screen name="..."> entries in your navigator
const LINKS = [
  { label: 'About', screen: 'Home' },
  { label: 'Features', screen: 'Wardrobe' },
  { label: 'Log In', screen: 'Stylist' },
  { label: 'Sign Up', screen: 'SignUpScreen' },
];


const Atelier_Text = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container,styles.bar, isDark ? styles.barDark : styles.barLight]}>
      <Text style={[styles.logo, isDark && styles.textDark]}>Atelier</Text>
    </View>
  );
};


const LandingBar = ({ theme, setTheme, onSelectSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const isDark = theme === 'dark';

  const scrollViewRef = useRef(null);
  const [sectionPositions, setSectionPositions] = useState({});
  
    const scrollToSection = (sectionKey) => {
      const yOffset = sectionPositions[sectionKey]; // looks up location of about or feature 
      if (yOffset !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
      }
    };

  const goTo = (screen) => {
    setSidebarOpen(false);
    navigation.navigate(screen);
  };

  const [isSelected, setIsSelected] = useState(false);

  return (
    <>

      {/* Navigation */}


      {/* Right-side controls: theme toggle + menu button */}
      <View style={[styles.bar, styles.controlsBar, isDark ? styles.barDark : styles.barLight]}>

         <View style={[styles.landingBar, isDark ? styles.barDark : styles.barLight]}>

        {/* in page navigation */}

         <TouchableOpacity onPress={() => onSelectSection('about')}>
        <Text style={[styles.page, isDark && styles.textDark]}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSelectSection('features')}>
        <Text style={[styles.page, isDark && styles.textDark]}>Features</Text>
        </TouchableOpacity>

      
        {/* page 2 page navigation */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.page, isDark && styles.textDark]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.page, isDark && styles.textDark]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
        
        {/*
          <ThemeToggle theme={theme} setTheme={setTheme} /> Theme toggle button 


         <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.iconButton}>
         <Text style={[styles.icon, isDark && styles.textDark]}>☰</Text> Icon for sidebar 
        </TouchableOpacity>*/}
          </View>
     

      {/* Sidebar (replaces the max-sm:fixed menu) 
     <Modal
        visible={sidebarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View style={styles.overlay}>
           Tapping the dimmed area closes the menu 
          <Pressable style={styles.backdrop} onPress={() => setSidebarOpen(false)} />

          <View style={[styles.sidebar, isDark ? styles.sidebarDark : styles.sidebarLight]}>
            <TouchableOpacity
              onPress={() => setSidebarOpen(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.icon, isDark && styles.textDark]}>✕</Text>
            </TouchableOpacity>

            {LINKS.map((link) => (
              <TouchableOpacity
                key={link.screen}
                onPress={() => goTo(link.screen)}
                style={styles.link}
              >
                <Text style={[styles.linkText, isDark && styles.textDark]}>
                  {link.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> 
       </Modal> 
       */}
      
    </> 
  );
};

export {LandingBar, Atelier_Text};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#fff',
  },
  page:{
    fontSize: 12,
    color: '#000',
    fontFamily: 'Manrope_700Bold',
    gap:22,
  },
  textBar: {
    alignItems: 'center',
    paddingHorizontal: 0,
    flexDirection: 'row', // needed since View automatically stacks the page links in a column
    gap: 12,
   // puts it in the middle 
  },
  landingBar: { // changes items in navigation bar 
    alignItems: 'center',
    paddingVertical:0,
    flexDirection: 'row', // needed since View automatically stacks the page links in a column
    gap: 12,
    justifyContent: 'center',
    position:'absolute', left:'30%', right:'30%',
   // puts it in the middle 
  },
  bar: { // container specifically for page navigation
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:20,
    paddingVertical:10,
    justifyContent:"center",
  },
  barLight: { backgroundColor: 'rgba(255,255,255,0.85)' }, // changes background of container
  barDark: { backgroundColor: 'rgba(17,24,39,0.9)' }, // changes background of container
  
  logo: { fontSize: 60, fontWeight: '200', color: '#000', fontFamily: 'RockSalt_400Regular'},
  textDark: { color: '#fff' },
  

  
});