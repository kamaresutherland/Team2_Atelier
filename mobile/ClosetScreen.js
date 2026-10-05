import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://localhost:3000';

export default function ClosetScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to load closet:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh the closet every time this screen comes into focus,
  // so a newly added item shows up immediately.
  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A3728" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your closet is empty. Add your first item!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <Text style={styles.itemName} numberOfLines={1}>{item.item_name}</Text>
          {item.description ? (
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          ) : null}
          <Text style={styles.status}>{item.status}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 },
  grid: { padding: 10 },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 8,
  },
  image: { width: '100%', height: 140, borderRadius: 8, marginBottom: 6 },
  itemName: { fontWeight: '600', fontSize: 14 },
  description: { fontSize: 12, color: '#666', marginTop: 2 },
  status: { fontSize: 11, color: '#4A3728', marginTop: 4, textTransform: 'capitalize' },
});
