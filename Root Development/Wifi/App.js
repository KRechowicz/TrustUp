import * as React from 'react';
import { View, Text , Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import ScanScreen from './Objects/Scan.js';
import LoginScreen from './pages/Login'
import UnknownVendorScreen from './pages/UnknownVendor';
import UnknownVendorDisplayScreen from './pages/UnknownVendorDisplay';
import Home from "./pages/Home";
import {Component} from "react";
<<<<<<< Updated upstream
import DeviceModal from "./pages/DeviceInformation";
import { FAB, DefaultTheme, Provider as PaperProvider, List } from 'react-native-paper';
=======
import DeviceModal from "./pages/DeviceInformation"
import About from "./pages/About";
>>>>>>> Stashed changes

const Stack = createStackNavigator();

export default class App extends Component{
    login = new LoginScreen();
    constructor() {
        super();
        this.state ={
            isSignedIn: false,
        }
        this.setSignedIn = this.setSignedIn.bind(this)
    }

    setSignedOut() {
        this.setState({
            isSignedIn:false,
        })
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
                            <Stack.Screen name="HomeScreen" component={Home} options={{
                                headerTitle: "Home",
                                headerRight: () => (
                                    <Button
                                        onPress={() => this.setSignedOut()}
                                        title="Logout"
                                    />
                                ),
                            }}/>
                            <Stack.Screen name="ScanningScreen" component={ScanScreen} options={{ title: 'Loading' }} />
                            <Stack.Screen name="UnknownVendorScreen" component={UnknownVendorScreen} options={{ title: 'Unknown Vendor' }} />
                            <Stack.Screen name="UnknownVendorDisplayScreen" component={UnknownVendorDisplayScreen} options={{ title: 'Unknown Vendor' }} />
                            <Stack.Screen name="DeviceModal" component={DeviceModal} options={{ title: 'Device Information' }}/>
                            <Stack.Screen name="About" component={About} options={{ title: 'Additional Information' }}/>
                        </Stack.Navigator>
                    </NavigationContainer>

                ) : (
                    <LoginScreen handleState = {this.setSignedIn}>
                    </LoginScreen>

                )

        );
    }


}
