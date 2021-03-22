import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import ScanScreen from './Objects/Scan.js';
import LoginScreen from './pages/Login'
import UnknownVendorScreen from './pages/UnknownVendor';
import UnknwonVendorDisplayScreen from './pages/UnknownVendorDisplay';
import Home from "./pages/Home";

const Stack = createStackNavigator();

export default function App() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="HomeScreen" component={Home} />
                    <Stack.Screen name="ScanningScreen" component={ScanScreen} />
                    <Stack.Screen name="UnknownVendorScreen" component={UnknownVendorScreen} />
                    <Stack.Screen name="UnknownVendorDisplayScreen" component={UnknwonVendorDisplayScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
}