import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import ScanScreen from './Objects/Scan.js';
import LoginScreen from './pages/Login'
import UnknownVendorScreen from './pages/UnknownVendor';
import UnknownVendorDisplayScreen from './pages/UnknownVendorDisplay';
import Home from "./pages/Home";
import {Component} from "react";
import DeviceModal from "./pages/DeviceInformation"

const Stack = createStackNavigator();

export default class App extends Component{
    constructor() {
        super();
        this.state ={
            isSignedIn: false,
        }
        this.setSignedIn = this.setSignedIn.bind(this)
    }

    setSignedIn() {
        this.setState({
            isSignedIn:true,
        })
    }
    render() {
        console.log(this.state.isSignedIn);
        return (

            this.state.isSignedIn ? (
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen name="HomeScreen" component={Home} />
                            <Stack.Screen name="ScanningScreen" component={ScanScreen} />
                            <Stack.Screen name="UnknownVendorScreen" component={UnknownVendorScreen} />
                            <Stack.Screen name="UnknownVendorDisplayScreen" component={UnknownVendorDisplayScreen} />
                            <Stack.Screen name="DeviceModal" component={DeviceModal} />
                        </Stack.Navigator>
                    </NavigationContainer>

                ) : (
                    <LoginScreen handleState = {this.setSignedIn}>
                    </LoginScreen>

                )


        );
    }


}