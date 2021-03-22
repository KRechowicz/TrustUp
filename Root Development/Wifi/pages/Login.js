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

var credentials = require('../configs/auth0-configuration');
const auth0 = new Auth0(credentials);

var auth0Domain = 'https://dev-awc6c4u1.us.auth0.com/'

var URL = "http://127.0.0.1:3000"
var userID = "4";

const checkUsers = (userIDToCheck) =>{
    fetch(URL + "/users/" + userIDToCheck).then(r  => {
        r.json().then((data) => {
            if(data.userID){
                console.log("WOAH there, you're already a user. Getting your data!", data);
            }
            else{
                console.log("WOAH there, you're not a user! Creating a spot for oyu in our database!");
                fetch(URL+ '/users', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userID
                    })
                });
            }
        })
    })
}



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: null,
            userID: null,
        };
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
                <Button onPress = { loggedIn ? this._onLogout : this._onLogin }
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