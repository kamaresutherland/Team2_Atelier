import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThemeToggle from './ThemeToggle';

// Screen names must match the <Stack.Screen name="..."> entries in your navigator
const LINKS = [
  { label: 'About', screen: 'Home' },
  { label: 'Features', screen: 'Wardrobe' },
  { label: 'Log In', screen: 'Stylist' },
  { label: 'Sign Up', screen: 'SignUpScreen' },
];


const LandingBar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const isDark = theme === 'dark';

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

      <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <Text style={[styles.page, isDark && styles.textDark]}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <Text style={[styles.page, isDark && styles.textDark]}>Features</Text>
        </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.page, isDark && styles.textDark]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.page, isDark && styles.textDark]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

          <ThemeToggle theme={theme} setTheme={setTheme} />


        <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.iconButton}>
        {/* <Text style={[styles.icon, isDark && styles.textDark]}>☰</Text> */}
        </TouchableOpacity>
          </View>
     

      {/* Sidebar (replaces the max-sm:fixed menu) */}
      <Modal
        visible={sidebarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View style={styles.overlay}>
          {/* Tapping the dimmed area closes the menu */}
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
    </>
  );
};

export {LandingBar};

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    // Add a transparent bottom border by default to prevent layout shift 
    borderBottomWidth: 3,
    borderBottomColor: 'transparent', 
    backgroundColor:'rgba(17,24,39,0.9)',
  },
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
  landingBar: {
    alignItems: 'center',
    paddingVertical: 0,
    flexDirection: 'row', // needed since View automatically stacks the page links in a column
    gap: 12,
    justifyContent: 'center',
    position:'absolute', left:'30%', right:'30%',
   // puts it in the middle 
  },
  bar: { // container specifically for page navigation
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLight: { backgroundColor: 'rgba(255,255,255,0.85)' }, // changes background of container
  barDark: { backgroundColor: 'rgba(17,24,39,0.9)' }, // changes background of container
  controlsBar: { justifyContent: 'flex-end' }, // overarching container for navigation and theme toggle 

  logo: { fontSize: 40, fontWeight: '600', color: '#000', fontFamily: 'RockSalt_400Regular'},
  textDark: { color: '#fff' },

  iconButton: { padding: 4 },
  icon: { fontSize: 28, color: '#000' },

  overlay: { flex: 1, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sidebar: { width: 240, paddingTop: 80, paddingLeft: 32 },
  sidebarLight: { backgroundColor: '#fff' },
  sidebarDark: { backgroundColor: '#111827' },

  closeButton: { position: 'absolute', top: 48, right: 16, padding: 4 },
  

  
});