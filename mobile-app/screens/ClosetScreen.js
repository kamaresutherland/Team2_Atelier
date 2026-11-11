import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://localhost:3000';

// Colors for the status badge so worn and dirty items stand out from clean ones.
const STATUS_COLORS = {
  clean: '#2E7D32',
  worn: '#B26A00',
  dirty: '#C62828',
};

export default function ClosetScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [washIds, setWashIds] = useState([]); // ids of items that need washing
  const [loading, setLoading] = useState(true);

  // Ask the backend which items need washing. The wash rule lives on the server.
  const fetchNeedsWashing = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/items/needs-washing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setWashIds(data.items.map((item) => item.id));
      }
    } catch (err) {
      console.error('Failed to load items that need washing:', err);
    }
  };

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
        await fetchNeedsWashing();
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

  // Copy the new status and wear count from the server into the item
  // on screen, so the card updates right away without reloading the list.
  const applyUpdate = (updated) => {
    setItems((current) =>
      current.map((item) =>
        item.id === updated.id
          ? { ...item, status: updated.status, wear_count: updated.wear_count }
          : item
      )
    );
  };

  const sendUpdate = async (path, method, body) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/items/${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      if (response.ok) {
        applyUpdate(data.item);
        // The change may add or remove this item from the wash list.
        fetchNeedsWashing();
      } else {
        Alert.alert('Could not update item', data.error || 'Please try again.');
      }
    } catch (err) {
      console.error('Failed to update item:', err);
      Alert.alert('Could not update item', 'Check your connection and try again.');
    }
  };

  const changeStatus = (itemId, status) =>
    sendUpdate(`${itemId}/status`, 'PATCH', { status });

  const washItem = (itemId) => sendUpdate(`${itemId}/wash`, 'POST');

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
      ListHeaderComponent={
        washIds.length > 0 ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {washIds.length} {washIds.length === 1 ? 'item needs' : 'items need'} washing
            </Text>
          </View>
        ) : null
      }
      renderItem={({ item }) => {
        const needsWash = washIds.includes(item.id);
        return (
          <View style={[styles.card, needsWash && styles.cardNeedsWash]}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <Text style={styles.itemName} numberOfLines={1}>{item.item_name}</Text>
            {item.description ? (
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            ) : null}

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: STATUS_COLORS[item.status] || '#888' },
                ]}
              >
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
              {item.wear_count != null ? (
                <Text style={styles.wearCount}>Worn {item.wear_count}x</Text>
              ) : null}
            </View>

            {needsWash ? <Text style={styles.washLabel}>Needs washing</Text> : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => changeStatus(item.id, 'worn')}
              >
                <Text style={styles.actionText}>Worn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => changeStatus(item.id, 'dirty')}
              >
                <Text style={styles.actionText}>Dirty</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => washItem(item.id)}
              >
                <Text style={styles.actionText}>Washed</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 },
  grid: { padding: 10 },
  banner: {
    backgroundColor: '#FDECEA',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 6,
    marginBottom: 6,
  },
  bannerText: { color: '#C62828', fontWeight: '600', fontSize: 14 },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardNeedsWash: { borderColor: '#C62828' },
  image: { width: '100%', height: 140, borderRadius: 8, marginBottom: 6 },
  itemName: { fontWeight: '600', fontSize: 14 },
  description: { fontSize: 12, color: '#666', marginTop: 2 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  wearCount: { fontSize: 11, color: '#666' },
  washLabel: { color: '#C62828', fontSize: 11, fontWeight: '600', marginTop: 4 },
  buttonRow: { flexDirection: 'row', marginTop: 8, gap: 4 },
  actionButton: {
    flex: 1,
    backgroundColor: '#4A3728',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
