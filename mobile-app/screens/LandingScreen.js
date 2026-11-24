import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { LandingBar, Atelier_Text } from '../components/LandingBar';
import Hero from '../components/Hero';
import { About } from '../components/About';
import { Features } from '../components/Features';

/**
 * Landing page. Owns the scroll logic: the nav bar asks it to scroll,
 * and each section reports where it sits on the page.
 */
const LandingScreen = () => {
 
  const scrollViewRef = useRef(null);
  const sectionPositions = useRef({}); // a ref, not state: saving a position shouldn't re-render

  // Returns an onLayout handler that saves where a section starts
  const handleSectionLayout = (sectionKey) => (event) => {
    sectionPositions.current[sectionKey] = event.nativeEvent.layout.y;
  };

  const scrollToSection = (sectionKey) => {
    const yOffset = sectionPositions.current[sectionKey];
    if (yOffset !== undefined) {
      scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <Atelier_Text />
        <LandingBar onSelectSection={scrollToSection} />
        <Hero/>

        <View onLayout={handleSectionLayout('about')}>
          <About />
        </View>

        <View onLayout={handleSectionLayout('features')}>
          <Features />
        </View>
      </ScrollView>
    </View>
  );
};

export { LandingScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
});