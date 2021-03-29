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
    Button,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    constructor(props) {
        super(props);
        this.state = {
            accessToken: null,
            userID: null,
        };
    }

    checkUsers = async(userIDToCheck) =>{

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
        let loggedIn = this.state.accessToken === null ? false : true;
        return (
            <View style = { styles.container }>
                <Text style = { styles.header }> Auth0Sample - Login </Text>
                <Text>
                    You are{ loggedIn ? ' ' : ' not ' }logged in . </Text>
                <Button onPress = { () => this.webAuth('google-oauth2')}
                        title = { loggedIn ? 'Log Out' : 'Log In' }/>
            </View >
        );
    }
}

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

export default Login;