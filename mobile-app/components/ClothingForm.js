import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// --- API URL Commented Out ---
// const API_URL = 'http://localhost:3001/api/items';

const TYPES = ['Top', 'Bottom', 'Dress', 'Outerwear', 'Shoes', 'Accessory', 'Other'];
const SEASONS = ['All seasons', 'Spring', 'Summer', 'Fall', 'Winter'];
const EMPTY = {
  name: '',
  type: '',
  color: '',
  brand: '',
  size: '',
  material: '',
  season: '',
  occasion: '',
  notes: '',
};

function ClothingItemForm({ imageUrl = null, onSaved }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | saving | saved | failed

  // React Native's TextInput gives you the text directly (no e.target.value)
  const set = (field) => (value) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
    if (status === 'saved') setStatus('idle');
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Give this item a name.';
    if (!values.type) errs.type = 'Choose a type.';
    if (!values.color.trim()) errs.color = 'Enter a color.';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('saving');

    // --- Mocking the save process locally without the API ---
    try {
      console.log('Form submitted successfully with data:', { ...values, image_url: imageUrl });

      // Simulate a small network lag, then succeed locally
      setTimeout(() => {
        setStatus('saved');
        setValues(EMPTY);
        onSaved?.({ ...values, image_url: imageUrl });
      }, 600);
    } catch {
      setStatus('failed');
    }
  };

  const Field = ({ id, label, required, children, style }) => (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>
        {label}
        {required && ' *'}
      </Text>
      {children}
      {errors[id] ? <Text style={styles.error}>{errors[id]}</Text> : null}
    </View>
  );

  const textInput = (id, placeholder) => (
    <TextInput
      value={values[id]}
      onChangeText={set(id)}
      placeholder={placeholder}
      placeholderTextColor="#999"
      style={styles.input}
    />
  );

  // React Native has no <select>, so options are tappable chips
  const chooser = (id, options) => (
    <View style={styles.chips}>
      {options.map((o) => {
        const selected = values[id] === o;
        return (
          <TouchableOpacity
            key={o}
            onPress={() => set(id)(selected ? '' : o)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Describe your item</Text>

      <Field id="name" label="Name" required>
        {textInput('name', 'Navy linen blazer')}
      </Field>

      <Field id="type" label="Type" required>
        {chooser('type', TYPES)}
      </Field>

      <Field id="color" label="Color" required>
        {textInput('color', 'Navy')}
      </Field>

      <View style={styles.row}>
        <Field id="brand" label="Brand" style={styles.rowItem}>
          {textInput('brand', 'Everlane')}
        </Field>
        <Field id="size" label="Size" style={styles.rowItem}>
          {textInput('size', 'M')}
        </Field>
      </View>

      <Field id="material" label="Material">
        {textInput('material', 'Linen')}
      </Field>

      <Field id="season" label="Season">
        {chooser('season', SEASONS)}
      </Field>

      <Field id="occasion" label="Occasion">
        {textInput('occasion', 'Work, dinner out')}
      </Field>

      <Field id="notes" label="Notes">
        <TextInput
          value={values.notes}
          onChangeText={set('notes')}
          placeholder="Runs slightly small, dry clean only"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={[styles.input, styles.textarea]}
        />
      </Field>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={status === 'saving'}
        style={[styles.button, status === 'saving' && styles.buttonDisabled]}
      >
        {status === 'saving' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save item</Text>
        )}
      </TouchableOpacity>

      {status === 'saved' && <Text style={styles.success}>Item saved to your closet.</Text>}
      {status === 'failed' && !Object.keys(errors).length && (
        <Text style={styles.error}>
          Couldn't save the item. Check your connection and try again.
        </Text>
      )}
    </View>
  );
}

export {ClothingItemForm};

const styles = StyleSheet.create({
  form: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: 24,backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  rowItem: { flex: 1 },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    backgroundColor: '#fff',
    color: '#000',
  },
  textarea: { minHeight: 80 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  chipSelected: { backgroundColor: '#22303c', borderColor: '#22303c' },
  chipText: { fontSize: 14, color: '#000' },
  chipTextSelected: { color: '#fff' },
  error: { color: '#b3261e', fontSize: 13, marginTop: 4 },
  success: { color: '#1b6e3c', fontSize: 14, marginTop: 12 },
  button: {
    padding: 14,
    backgroundColor: '#22303c',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});