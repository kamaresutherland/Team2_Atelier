/*
 * Closet app: minimal sign-up screen (React Native)
 *
 * Core functionality only: enter a username and password, then create an account.
 *
 * Usage:
 *   <SignUpCore
 *     onSignUp={async ({ username, password }) => { ...call your API... }}
 *     onComplete={() => navigation.replace('Closet')}
 *   />
 */
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// Placeholder so the screen works on its own. Replace with a real API call via the onSignUp prop.
const defaultSignUp = () => new Promise((resolve) => setTimeout(resolve, 500));

export default function SignUpScreen({ onSignUp = defaultSignUp, onComplete }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await onSignUp({ username: username.trim(), password });
      if (onComplete) onComplete();
    } catch (err) {
      setError(err?.message || 'We couldn’t create your account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 24, textAlign:'center',},
  input: {
    borderWidth: 1,
    borderColor: '#C9CFDB',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  error: { color: '#B3261E', marginBottom: 12 },
  button: {
    backgroundColor: '#4A3728',
    borderRadius: 10,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
