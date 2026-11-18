import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'theme';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} });

/**
 * Holds the one shared theme for the whole app and saves it to storage.
 * Wrap the app in this component once, in App.js.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The app to provide the theme to.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load the saved theme once when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved) {
          setTheme(saved);
        }
      } catch (e) {
        console.log('Could not load theme', e);
      } finally {
        setThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save the theme whenever it changes (after the saved one has loaded)
  useEffect(() => {
    if (!themeLoaded) {
      return;
    }
    AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch((e) =>
      console.log('Could not save theme', e)
    );
  }, [theme, themeLoaded]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Gives any component the shared theme.
 * @returns {{ theme: string, setTheme: Function }} The current theme and its setter.
 */
export function useTheme() {
  return useContext(ThemeContext);
}