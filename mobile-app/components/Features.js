import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

 function Features({ scrollViewRef, setSectionPositions, }) {

    const items = [
  'Track your progress in real time with clean dashboards.',
  'Sync seamlessly across all your devices.',
  'Customize your experience to fit your workflow.',
];

  return (
    <View style={styles.container}>
    <ScrollView ref={scrollViewRef}>
      <View
        onLayout={(event) => {
          const y = event.nativeEvent.layout.y;
          setSectionPositions((prev) => ({ ...prev, features: y }));
        }}
      >
        <Text style={styles.section}>Features</Text>
         {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>{'\u2022'}</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
    </ScrollView>
    </View>
  );
}

export {Features} ;


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
    flex: 1, // Crucial: forces long text to wrap cleanly instead of overflowing off-screen
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
   section: {
    color:"#000",
    fontSize:20,
    textAlign:"center",
    paddingHorizontal:50,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 22,
    marginRight: 8,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row', // Places the bullet and text side-by-side
    alignItems: 'flex-start', // Keeps the bullet aligned with the first line of text
    marginBottom: 8,
  },
  });