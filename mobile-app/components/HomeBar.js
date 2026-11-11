import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {StyleSheet} from 'react-native'
import {Home} from '../pages/Home';
import {Wardrobe} from '../pages/Wardrobe';
import {Stylist} from '../pages/Stylist';
import {Settings} from '../pages/Settings'
//import ThemeToggle from './ThemeToggle';

// importing icons for bar 
import { Ionicons } from '@react-native-vector-icons/ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

//import ClosetScreen from '../screens/ClosetScreen';
//import AddItemScreen from '../screens/AddItemScreen';



const Tab = createBottomTabNavigator();


function MyTabs() {
 // const isDark = theme === 'dark';

  return (
    <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor:"#2563EB",
            tabBarInactiveTintColor: "#9CA3AF",
            tabBarStyle: {
                backgroundColor: "#fff",
            },
            tabBarLabelStyle:{
                fontSize:10,
                fontFamily: 'Manrope_400Regular',
                fontWeight: "bold",
            },
        }}
    >
      
      <Tab.Screen name="Home" component={Home} options={{headerShown: false,  tabBarIcon: ({focused}) => <FontAwesome name="home" size={24} color={focused ? "#2563EB" : "#9CA3AF"} />  }}/> 
      <Tab.Screen name="Wardrobe" component={Wardrobe} options={{headerShown: false,  tabBarIcon: ({focused}) => <MaterialCommunityIcons name="wardrobe" size={24} color={focused ? "#2563EB" : "#9CA3AF"} />  }} />
      <Tab.Screen name="Stylist" component={Stylist} options={{headerShown: false, tabBarIcon: ({focused}) => <FontAwesome name="paint-brush" size={24} color={focused ? "#2563EB" : "#9CA3AF"} />  }} />
      <Tab.Screen name="Settings" component={Settings} options={{headerShown: false, tabBarIcon: ({focused}) => <MaterialIcons name="app-settings-alt" size={24} color={focused ? "#2563EB" : "#9CA3AF"} />  } } />
    </Tab.Navigator>
  );
}

export {MyTabs};


const styles = StyleSheet.create({
  barLight: { backgroundColor: 'rgba(255,255,255,0.85)' }, // changes background of container
  barDark: { backgroundColor: 'rgba(17,24,39,0.9)' }, // changes background of container
 
  logo: {  alignItems: 'center',fontSize: 40, fontWeight: '600', color: '#000', fontFamily: 'RockSalt_400Regular'},
  textDark: { color: '#fff' },

  iconButton: { padding: 4 },
  icon: { fontSize: 28, color: '#000' },

});