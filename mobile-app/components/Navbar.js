
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
  { label: 'Home', screen: 'Home' },
  { label: 'Wardrobe', screen: 'Wardrobe' },
  { label: 'Stylist', screen: 'Stylist' },
  { label: 'Settings', screen: 'Settings' },
];

/* Just the logo and the name */
const NonNavBar = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container,styles.bar, isDark ? styles.barDark : styles.barLight]}>
      <Text style={[styles.logo, isDark && styles.textDark]}>Atelier</Text>
    </View>
  );
};

/* Top menu bar with a slide-in sidebar */
const NavBar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const isDark = theme === 'dark';

  const goTo = (screen) => {
    setSidebarOpen(false);
    navigation.navigate(screen);
  };

  return (
    <>

      {/* Navigation */}
  

      {/* Right-side controls: theme toggle + menu button */}
      <View style={[styles.bar, styles.controlsBar, isDark ? styles.barDark : styles.barLight]}>

       <View style={[styles.textBar, isDark ? styles.barDark : styles.barLight]}>

      <TouchableOpacity onPress={() => navigation.navigate('Stylist')}>
          <Text style={[styles.page, isDark && styles.textDark]}>Stylist</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Stylist')}>
          <Text style={[styles.page, isDark && styles.textDark]}>Wardrobe</Text>
        </TouchableOpacity>
        </View>
        
        <ThemeToggle theme={theme} setTheme={setTheme} />

        <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.iconButton}>
          <Text style={[styles.icon, isDark && styles.textDark]}>☰</Text>
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

export { NonNavBar, NavBar };

const styles = StyleSheet.create({


  linkk: {
    paddingVertical: 8
  },
  linkActive:{
    borderBottomWidth: 1,
    borderBottomColor: '#fff'
  },
  page:{
    fontSize: 16,
    color: '#374151',
  },
  textBar: {
    alignItems: 'center',
    paddingHorizontal: 0,
    flexDirection: 'row', // needed since View automatically stacks the page links in a column
    gap: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  barLight: { backgroundColor: 'rgba(255,255,255,0.85)' }, // changes background of container
  barDark: { backgroundColor: 'rgba(17,24,39,0.9)' }, // changes background of container
  controlsBar: { justifyContent: 'flex-end', gap: 12 }, // pushes all the way to the right 

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
  link: { paddingVertical: 12 },
  linkText: { fontSize: 18, color: '#000' },

  
});