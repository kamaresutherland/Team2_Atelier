import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

// Expects navigation to have already picked an image and passed its URL
// (e.g. from Gavin's ClosetCameraScreen) via route.params.imageUrl.
export default function AddItemScreen({ route, navigation }) {
  const { imageUrl } = route.params || {};
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!itemName) {
      Alert.alert('Missing info', 'Please give the item a name.');
      return;
    }
    if (!imageUrl) {
      Alert.alert('Missing photo', 'Please take or choose a photo first.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/items/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          category,
          color,
          description,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Could not save item', data.error || 'Something went wrong');
        return;
      }

      Alert.alert('Saved!', 'Item added to your closet.', [
        { text: 'OK', onPress: () => navigation.navigate('Closet') },
      ]);
    } catch (err) {
      Alert.alert('Network error', 'Could not reach the server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add to Closet</Text>

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No photo selected</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Item name (e.g. Blue Denim Jacket)"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Category (e.g. Jacket, Shirt, Shoes)"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (e.g. material, fit, occasion)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save to Closet</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  preview: { width: '100%', height: 220, borderRadius: 10, marginBottom: 16 },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: { color: '#888' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#4A3728',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
