import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

 function About({ scrollViewRef, setSectionPositions }) {
  return (
    <View style={styles.container}>
    <ScrollView ref={scrollViewRef} pos={setSectionPositions}>
      <View
        onLayout={(event) => {
          const y = event.nativeEvent.layout.y;
          setSectionPositions((prev) => ({ ...prev, about: y }));
        }}
      >
        <Text style={styles.section}>About</Text>
         <Text style={styles.text}>Welcome to Atelier, your go-to solution for staying organized, connecting with friends, managing your daily tasks.
          We built Atelier with a simple mission, to make one's wardrobe accessible for everyone, not matter where they are. Whether you put sweat and tears into every outfit or simply just wear what's available, our platform gives you the tools you need to get things done without the clutter.</Text>
      </View>
    </ScrollView>
    </View>
  );
}

export {About} ;


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 16,
    gap: 24,
    paddingBottom:500,
  },
  text: {
    color:"#000",
    textAlign:"center",
  },
   section: {
    color:"#000",
    fontSize:20,
    textAlign:"center",
    paddingHorizontal:50,
  },
  });