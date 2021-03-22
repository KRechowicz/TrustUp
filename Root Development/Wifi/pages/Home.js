import * as React from 'react';
import {Component} from "react";
import { StyleSheet, View, Image, Text, Button} from 'react-native';
import { FAB } from 'react-native-paper';

var userID = 'B';
var URL = "http://127.0.0.1:3000";

const getDeviceList = (userIDToCheck) => {
    fetch(URL + "/users/" + userIDToCheck + "/scan").then(r  => {
        r.json().then((data) => {
            if(!data[0].ip){
                console.log("You have no devices previously scanned...");
            }
            else{
                console.log(data);
            }
        })
    })

}


class HomeScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            userID:"B",
            deviceList:[]
        }

    }

    componentDidMount() {
        getDeviceList(this.state.userID);
    }

    render(){
        return(
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Button
                    title="Go to Scanning Screen"
                    onPress={() => this.props.navigation.navigate('ScanningScreen',{userID:userID})}
                />
                <Button
                    title="Go to Unknown Page"
                    onPress={() => this.props.navigation.navigate('UnknownVendorScreen')}
                />
            </View>

        );

    }





}

const styles = StyleSheet.create({
    container: {
        paddingTop: 200,
        flex: 1,
        flexDirection: 'row',
    },
    box1: {
        width: 75,
        height: 75,
        // Uncomment the following style to see flex effects
        //flex: 1,
        backgroundColor: 'steelblue'
    },
    box2: {
        width: 75,
        height: 75,
        // Uncomment the following style to see flex effects
        //flex: 2,
        backgroundColor: 'pink'
    },
    box3: {
        width: 75,
        height: 75,
        // Uncomment the following style to see flex effects
        //flex: 3,
        backgroundColor: 'orange'
    },
    textStyle: {
        color: 'black',
        alignSelf: 'center',
        margin: 25,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    logo: {
        width: 66,
        height: 58,
    },
})

export default HomeScreen;