/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    Alert,
    // Button,
    StyleSheet,
    // Text
    View,
    Image, Dimensions, Text
} from 'react-native';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DefaultTheme, Provider as PaperProvider, Title, Button, Paragraph} from "react-native-paper";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const SCREENSIZE = Dimensions.get('screen');

import { Logo } from '../Images';
import {Icon} from "react-native-elements";

var credentials = require('../configs/auth0-configuration');
const auth0 = new Auth0(credentials);

var auth0Domain = 'https://dev-awc6c4u1.us.auth0.com/'

const config = require('../config');

var userID = "4";


const storeData = async (value) => {
    try {
        await AsyncStorage.setItem(config.id_key, value)
    } catch (e) {
        // saving error
    }
}




class Login extends Component {
    nickname: '';
    listToStore = [];
    constructor(props) {
        super(props);
        this.state = {
            accessToken: null,
            userID: null,
        };
    }

    storeToDB = async (userID) => {

        fetch(config.backend_endpoint + '/users/' + userID + '/scan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.listToStore)
        }).then(r =>  {
            console.log("Stored to Database")
            this.setState({scanComplete:true})
        });


    }

    checkUsers = async(userIDToCheck) =>{
        console.log(userIDToCheck);
        const response = await fetch(config.backend_endpoint + '/users/' + userIDToCheck);
        const json = await response.json();
        if(!json.userID){
            fetch(config.backend_endpoint+ '/users', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userIDToCheck
            })
        });
            const createPath = await this.storeToDB(userIDToCheck);

        }

        console.log(json);
    }



    getObject = () => {
            var getObject = {
                method: "GET",
                headers: {
                    'token': 'Bearer '+ this.accessToken
                }
            }

            fetch( auth0Domain + "userinfo", getObject)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                })
                .catch((error) => {
                    console.log(error);
                });


}

    onSuccess = async(credentials) =>{
        auth0.auth
            .userInfo({ token: credentials.accessToken })
            .then(async(profile)=> {
                this.setState({nickname:profile.nickname});
                const checkDB = await this.checkUsers(profile.nickname);
                const response = await storeData(profile.nickname);
                this.props.handleState();
            })
            .catch(error => this.alert('Error', error.json.error_description));
    }

    alert(title, message) {
        Alert.alert(
            title,
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
    }

    webAuth(connection) {
        auth0.webAuth
            .authorize({
                scope: 'openid profile email',
                connection: connection,
                audience: 'https://' + credentials.domain + '/userinfo'
            })
            .then(credentials => {
                //storeData(credentials.email).then(r => console.log("Email stored", credentials.email));
                this.onSuccess(credentials);


            })
            .catch(error => this.alert('Error', error.error_description));
    };


    _onLogin = () => {
        auth0.webAuth
            .authorize({
                scope: 'openid profile email'
            })
            .then(credentials => {
                /*
                auth0.webAuth.client.userInfo(credentials.accessToken, function(err, user){
                    console.log(user)
                })

                 */
                checkUsers(userID);

                this.setState({ accessToken: credentials.accessToken});
            })
            .catch(error => console.log(error));

    };

    _onLogout = () => {
        auth0.webAuth
            .clearSession({})
            .then(success => {
                Alert.alert('Logged out!');
                this.setState({ accessToken: null });
            })
            .catch(error => {
                console.log('Log out cancelled');
            });
    };

    render() {
        // let loggedIn = this.state.accessToken === null ? false : true;
        return (
            <PaperProvider>
                <View style = { styles.container }>
                    <Title style = { styles.header }> Welcome to our App! </Title>
                    <Button mode="contained" style={styles.button} icon='apple'
                            onPress = { () => this.webAuth('apple')} accessible={true}
                            accessibilityLabel="Sign in with Apple."
                            accessibilityHint="Use this button to sign in with Apple."
                            screenReaderEnable={true}>
                        Sign in with Apple
                    </Button>
                    <Button mode="contained" style={styles.button} icon='google'
                            onPress = { () => this.webAuth('google-oauth2')} accessible={true}
                            accessibilityLabel="Sign in with Google."
                            accessibilityHint="Use this button to sign in with Google."
                            screenReaderEnable={true}>
                        Sign in with Google
                    </Button>
                    <View style={styles.information} accessible={true}
                          accessibilityLabel="TrustUp tells discovers and explains Privacy issues and Security Risks associated with devices on your network"
                          screenReaderEnable={true}>
                        <Icon name="information-outline" type="material-community" size={24} />
                        <Text>TrustUp discovers and explains Privacy issues and Security Risks associated with devices</Text>
                    </View>
                </View>
            </PaperProvider>
        );
    }
}
//title = { loggedIn ? 'Log Out' : 'Log In' }

/*
<Text> You are currently{ loggedIn ? ' ' : ' not ' }logged in . </Text>
 */

/*
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
});
*/

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0060a9',
        accent: '#f3cd1f',
    },
};

const styles = StyleSheet.create({
    header: {
        fontSize: 26,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 14,
    },
    image: {
        width: 200,
        height: 100,
        marginBottom: 12,
        marginLeft: SCREENSIZE.width * .020,
        // alignItems: 'center',
        // alignContent: 'center',
    },
    container: {
        flex: 1,
        //padding: 20,
        //width: '100%',
        //maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button:{
        marginVertical: 20,
        backgroundColor: theme.colors.primary,
        //fontColor: '#000000'
        //textColor: '#000000'
    },
    text:{
        fontSize: 20
    },
    information: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .005,
        paddingHorizontal: SCREENSIZE.width * .1
    },

});


export default Login;
