import React, { useState } from 'react';
import { View, Text, Button, Image, FlatList, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ClosetCameraScreen() {
  const [closetItems, setClosetItems] = useState([]);

  const addItem = (uri) => {
    setClosetItems((prev) => [...prev, { id: Date.now().toString(), uri }]);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Camera access is needed to take photos of your clothes.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (!result.canceled) {
      addItem(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Photo library access is needed to add existing photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      addItem(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Choose from Gallery" onPress={pickFromGallery} />
      </View>

      <FlatList
        data={closetItems}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        )}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items yet — take a photo to get started!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  grid: { gap: 8 },
  thumbnail: { width: 100, height: 100, margin: 4, borderRadius: 8 },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#888' },
});
