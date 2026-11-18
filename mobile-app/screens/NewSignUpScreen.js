/*
 * Closet app: sign-up screen (React Native)
 *
 * Uses only core React Native components, so there is nothing extra to install.
 *
 * Usage:
 *   import SignUpScreen from './SignUpScreen';
 *
 *   <SignUpScreen
 *     onSignUp={async ({ username, password }) => {
 *       // Call your API here. Throw an Error with a readable message to show it on the form,
 *       // e.g. throw new Error('That username is taken.');
 *     }}
 *     onComplete={({ username }) => navigation.replace('Closet')}
 *   />
 *
 * 
 */
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

const THEMES = {
  light: {
    bg: '#EDEFF3', panel: '#FFFFFF', ink: '#1B2030', muted: '#5B6275', line: '#C9CFDB',
    accent: '#2B4C7E', accentInk: '#FFFFFF', err: '#B3261E', ok: '#1E7A4C',
    brandBg: '#2B4C7E', brandInk: '#F2F5FB', seam: 'rgba(242,245,251,0.55)',
  },
  dark: {
    bg: '#12151C', panel: '#1A1F2A', ink: '#EEF0F5', muted: '#9AA3B5', line: '#344058',
    accent: '#8FB0E8', accentInk: '#0F1624', err: '#FF8A80', ok: '#6FD3A0',
    brandBg: '#22385C', brandInk: '#F2F5FB', seam: 'rgba(242,245,251,0.5)',
  },
};

const USERNAME_RE = /^[A-Za-z0-9._]{3,20}$/;

const passwordRules = (v) => [
  { key: 'len', label: 'At least 8 characters', met: v.length >= 8 },
  { key: 'letter', label: 'At least one letter', met: /[A-Za-z]/.test(v) },
  { key: 'num', label: 'At least one number', met: /\d/.test(v) },
];

// Placeholder so the screen works on its own. Replace with a real API call via the onSignUp prop.
const defaultSignUp = () => new Promise((resolve) => setTimeout(resolve, 700));

function Field({ label, theme, error, hint, children }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.ink }]}>{label}</Text>
      {children}
      {hint && !error ? <Text style={[styles.small, { color: theme.muted }]}>{hint}</Text> : null}
      {error ? (
        <Text style={[styles.small, { color: theme.err }]} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function PasswordInput({ theme, value, onChangeText, inputRef, onSubmitEditing, returnKeyType, label, hasError, onBlur }) {
  const [shown, setShown] = useState(false);
  return (
    <View style={styles.inputRow}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        secureTextEntry={!shown}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        accessibilityLabel={label}
        style={[
          styles.input,
          styles.inputWithButton,
          { color: theme.ink, borderColor: hasError ? theme.err : theme.line },
        ]}
      />
      <Pressable
        onPress={() => setShown((s) => !s)}
        accessibilityRole="button"
        accessibilityLabel={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        hitSlop={8}
        style={styles.toggle}
      >
        <Text style={[styles.toggleText, { color: theme.accent }]}>{shown ? 'Hide' : 'Show'}</Text>
      </Pressable>
    </View>
  );
}

export default function SignUpScreen({ onSignUp = defaultSignUp, onComplete }) {
  const theme = THEMES[useColorScheme() === 'dark' ? 'dark' : 'light'];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [doneUser, setDoneUser] = useState(null);

  const passRef = useRef(null);
  const confirmRef = useRef(null);
  const userRef = useRef(null);

  const checkUsername = (v = username) => {
    const t = v.trim();
    if (!t) return 'Enter a username.';
    if (!USERNAME_RE.test(t)) return 'Use 3 to 20 letters, numbers, periods, or underscores.';
    return '';
  };
  const checkPassword = (v = password) => {
    if (!v) return 'Enter a password.';
    if (!passwordRules(v).every((r) => r.met)) return 'Your password doesn’t meet all the requirements yet.';
    return '';
  };
  const checkConfirm = (v = confirm, p = password) => {
    if (!v) return 'Re-enter your password.';
    if (v !== p) return 'Passwords don’t match.';
    return '';
  };
  const setError = (key, msg) => setErrors((e) => ({ ...e, [key]: msg }));

  const handleSubmit = async () => {
    if (loading) return;
    setFormError('');
    const next = { username: checkUsername(), password: checkPassword(), confirm: checkConfirm() };
    setErrors(next);
    if (next.username) return userRef.current?.focus();
    if (next.password) return passRef.current?.focus();
    if (next.confirm) return confirmRef.current?.focus();

    setLoading(true);
    try {
      await onSignUp({ username: username.trim(), password });
      setDoneUser(username.trim());
    } catch (err) {
      setFormError(err?.message || 'We couldn’t create your account. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const rules = passwordRules(password);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={theme.bg === THEMES.dark.bg ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Brand banner: the dashed border is a nod to a garment seam */}
        <View style={[styles.brand, { backgroundColor: theme.brandBg }]}>
          <View style={[styles.seam, { borderColor: theme.seam }]}>
            <Text style={[styles.brandTitle, { color: theme.brandInk }]} accessibilityRole="header">
              Your whole closet, in your pocket.
            </Text>
            <Text style={[styles.brandBody, { color: theme.brandInk }]}>
              Snap a photo of each piece, then let the app pick what’s clean and right for the day.
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.line }]}>
          {doneUser ? (
            <View>
              <Text style={[styles.title, { color: theme.ink }]} accessibilityRole="header">
                Welcome, {doneUser}
              </Text>
              <Text style={[styles.sub, { color: theme.muted }]}>
                Your digital closet is ready. Start by taking a photo of something you wear often.
              </Text>
              <Pressable
                onPress={() => onComplete && onComplete({ username: doneUser })}
                accessibilityRole="button"
                style={[styles.button, { backgroundColor: theme.accent }]}
              >
                <Text style={[styles.buttonText, { color: theme.accentInk }]}>Add your first item</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <Text style={[styles.title, { color: theme.ink }]} accessibilityRole="header">
                Create your account
              </Text>
              <Text style={[styles.sub, { color: theme.muted }]}>
                Pick a username and password to start your digital closet.
              </Text>

              {formError ? (
                <View style={[styles.formError, { borderColor: theme.err }]} accessibilityLiveRegion="assertive">
                  <Text style={{ color: theme.err, fontSize: 15 }}>{formError}</Text>
                </View>
              ) : null}

              <Field
                label="Username"
                theme={theme}
                error={errors.username}
                hint="3 to 20 characters: letters, numbers, periods, or underscores."
              >
                <TextInput
                  ref={userRef}
                  value={username}
                  onChangeText={setUsername}
                  onBlur={() => username && setError('username', checkUsername())}
                  onSubmitEditing={() => passRef.current?.focus()}
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username-new"
                  textContentType="username"
                  maxLength={20}
                  accessibilityLabel="Username"
                  style={[styles.input, { color: theme.ink, borderColor: errors.username ? theme.err : theme.line }]}
                />
              </Field>

              <Field label="Password" theme={theme} error={errors.password}>
                <PasswordInput
                  theme={theme}
                  label="Password"
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (confirm) setError('confirm', checkConfirm(confirm, v));
                  }}
                  inputRef={passRef}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  hasError={!!errors.password}
                />
                <View style={styles.rules}>
                  {rules.map((r) => (
                    <Text
                      key={r.key}
                      style={[styles.small, { color: r.met ? theme.ok : theme.muted }]}
                      accessibilityLabel={`${r.label}: ${r.met ? 'met' : 'not met'}`}
                    >
                      {r.met ? '✓ ' : '○ '}
                      {r.label}
                    </Text>
                  ))}
                </View>
              </Field>

              <Field label="Confirm password" theme={theme} error={errors.confirm}>
                <PasswordInput
                  theme={theme}
                  label="Confirm password"
                  value={confirm}
                  onChangeText={setConfirm}
                  onBlur={() => confirm && setError('confirm', checkConfirm())}
                  inputRef={confirmRef}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  hasError={!!errors.confirm}
                />
              </Field>

              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                accessibilityRole="button"
                accessibilityState={{ disabled: loading, busy: loading }}
                style={[styles.button, { backgroundColor: theme.accent, opacity: loading ? 0.7 : 1 }]}
              >
                {loading ? (
                  <ActivityIndicator color={theme.accentInk} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme.accentInk }]}>Create account</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: 16,
    paddingTop: 16 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    gap: 16,
  },
  brand: { borderRadius: 20, padding: 10 },
  seam: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 12, padding: 20, gap: 8 },
  brandTitle: { fontSize: 22, fontWeight: '700', lineHeight: 27 },
  brandBody: { fontSize: 15, lineHeight: 21, opacity: 0.92 },
  card: { borderWidth: 1, borderRadius: 20, padding: 22 },
  title: { fontSize: 28, fontWeight: '700', lineHeight: 33, marginBottom: 4 },
  sub: { fontSize: 15, lineHeight: 21, marginBottom: 22 },
  field: { marginBottom: 16 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  inputRow: { justifyContent: 'center' },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    fontSize: 16,
  },
  inputWithButton: { paddingRight: 72 },
  toggle: { position: 'absolute', right: 8, paddingHorizontal: 8, paddingVertical: 8 },
  toggleText: { fontSize: 14, fontWeight: '600' },
  small: { fontSize: 14, lineHeight: 20, marginTop: 6 },
  rules: { marginTop: 4 },
  button: {
    minHeight: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
  formError: { borderWidth: 1.5, borderRadius: 10, padding: 12, marginBottom: 14 },
});
