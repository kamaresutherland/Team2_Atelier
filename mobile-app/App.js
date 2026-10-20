import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import ClosetScreen from './ClosetScreen';
import AddItemScreen from './AddItemScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Closet"
          component={ClosetScreen}
          options={{ title: 'My Closet' }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: 'Add to Closet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Note: Signup and ForgotPassword screens referenced inside LoginScreen.js
// aren't wired in here yet since those files haven't been added to this
// project. Add them to the Stack.Navigator above once they exist.
