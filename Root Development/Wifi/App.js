import * as React from 'react';
import {View, Text, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import ScanScreen from './Objects/Scan.js';
import LoginScreen from './pages/Login'
import UnknownVendorScreen from './pages/UnknownVendor';
import UnknownVendorDisplayScreen from './pages/UnknownVendorDisplay';
import Home from "./pages/Home";
import {Component} from "react";
import { FAB, DefaultTheme, Provider as PaperProvider, List, Button } from 'react-native-paper';
import DeviceModal from "./pages/DeviceInformation"
import About from "./pages/About";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { LogBox } from 'react-native';

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

    alert(title, message) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
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
        LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
        LogBox.ignoreAllLogs();//Ignore all log notifications
        return (

            this.state.isSignedIn ? (
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                            headerTitleStyle: {
                                fontSize: hp('1.7%')
                            },
                        }}>
                            <Stack.Screen name="HomeScreen" component={Home} options={{
                                headerTitle: "Home",
                                headerRight: () => (
                                    <Button
                                        onPress={() => this.setSignedOut()}
                                        mode='text'
                                        accessible={true}
                                        accessibilityLabel="Logout"
                                        screenReaderEnable={true}
                                        labelStyle={{fontSize: hp('1.5%'), color:'#00589b'}}
                                    >
                                        Logout
                                    </Button>
                                ),
                            }}/>
                            <Stack.Screen name="ScanningScreen" component={ScanScreen} options={{ title: 'Loading' }} />
                            <Stack.Screen name="UnknownVendorScreen" component={UnknownVendorScreen} options={{ title: 'Add Company', headerBackTitle: 'Back', fontSize: hp('1.7%') }}/>
                            <Stack.Screen name="UnknownVendorDisplayScreen" component={UnknownVendorDisplayScreen} options={{ title: 'Adding Company', headerBackTitle: 'Back', fontSize: hp('1.7%') }}
                                          />
                            <Stack.Screen name="DeviceModal" component={DeviceModal} options={{ headerBackTitle: 'Back', fontSize: hp('1.7%')  }}/>
                            <Stack.Screen name="About" component={About} options={{ title: 'Additional Information', headerBackTitle: 'Back', fontSize: hp('1.7%') }}/>
                        </Stack.Navigator>
                    </NavigationContainer>

                ) : (
                    <LoginScreen handleState = {this.setSignedIn}>
                    </LoginScreen>

                )

        );
    }


}
