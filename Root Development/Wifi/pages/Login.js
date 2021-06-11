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
    Image, Dimensions, Text,
    Platform
} from 'react-native';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DefaultTheme, Provider as PaperProvider, Title, Button, Paragraph} from "react-native-paper";
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import { AppleButton } from '@invertase/react-native-apple-authentication';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

if(Platform.OS === 'android'){
    GoogleSignin.configure({
        webClientId: '522533129784-95u3bo39f8nm9iahjcgt056l9140cdk4.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
}




const SCREENSIZE = Dimensions.get('screen');

import {Icon} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

var credentials = require('../configs/auth0-configuration');
const auth0 = new Auth0(credentials);

var auth0Domain = 'https://dev-awc6c4u1.us.auth0.com/'

const config = require('../config');


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
                console.log(profile);
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

    signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.setState({nickname:userInfo.user.id});
            const checkDB = await this.checkUsers(userInfo.user.id);
            const response = await storeData(userInfo.user.id);
            this.props.handleState();
            console.log(userInfo)
        } catch (error) {
            console.log('Message', error.message);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User Cancelled the Login Flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signing In');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play Services Not Available or Outdated');
            } else {
                console.log('Some Other Error Happened');
            }
        }
    };


    render() {

        if(Platform.OS === 'ios'){
            return (
                <PaperProvider theme={theme}>
                    <View style = { styles.container }>
                        <Title style = { styles.header }> Welcome to our App! </Title>
                        <Button mode="contained" style={styles.button} icon='apple'
                                onPress = { () => this.webAuth('apple')} accessible={true}
                                accessibilityLabel="Sign in with Apple."
                                accessibilityHint="Use this button to sign in with Apple."
                                screenReaderEnable={true}
                                labelStyle={{fontSize: hp('1.5%')}}>

                            Sign in with Apple
                        </Button>
                        <Button mode="contained" style={styles.button} icon='google'
                                onPress = { () => this.webAuth('google-oauth2')} accessible={true}
                                accessibilityLabel="Sign in with Google."
                                accessibilityHint="Use this button to sign in with Google."
                                screenReaderEnable={true}
                                labelStyle={{fontSize: hp('1.5%')}}>
                            Sign in with Google
                        </Button>

                        <View style={styles.information} accessible={true}
                              accessibilityLabel="This application tells, discovers, and explains Privacy issues and Security Risks associated with devices on your network"
                              screenReaderEnable={true}>
                            <Icon name="information-outline" type="material-community" size={24} />
                            <Text style={styles.text}>This application discovers and explains Privacy issues and Security Risks associated with devices</Text>
                        </View>
                    </View>
                </PaperProvider>
            );
        }
        else{
            return (
                <PaperProvider>
                    <View style = { styles.container }>
                        <Title style = { styles.header }> Welcome to our App! </Title>
                        <Button mode="contained" style={styles.button} icon='google'
                                onPress = { () => this.webAuth('google-oauth2')} accessible={true}
                                accessibilityLabel="Sign in with Google."
                                accessibilityHint="Use this button to sign in with Google."
                                screenReaderEnable={true}
                                labelStyle={{fontSize: hp('1.5%')}}>
                            Sign in with Google
                        </Button>
                        <View style={styles.information} accessible={true}
                              accessibilityLabel="This application tells, discovers, and explains Privacy issues and Security Risks associated with devices on your network"
                              screenReaderEnable={true}>
                            <Icon name="information-outline" type="material-community" size={24} />
                            <Text style={styles.text}>This application discovers and explains Privacy issues and Security Risks associated with devices</Text>
                        </View>
                    </View>
                </PaperProvider>
            );
        }
        // let loggedIn = this.state.accessToken === null ? false : true;

    }
}

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#00589b',
        accent: '#f3cd1f',
    },
};

const styles = StyleSheet.create({
    header: {
        fontSize: hp('3.6%'),
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
        margin:10,
    },
    button:{
        marginVertical: 20,
        //fontColor: '#000000'
        //textColor: '#000000'
        height: hp('4%'), // 70% of height device screen
        width: wp('60'),
        textAlign:'center'
    },
    text:{
        fontSize: hp('2%')
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
