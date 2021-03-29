import * as React from 'react';
import {Component} from "react";
import { StyleSheet, View, Image, Text, Button, TouchableOpacity, ListView} from 'react-native';
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const config = require('../config');


const getData = async () => {
    try {
        const value = await AsyncStorage.getItem(config.id_key)
        if(value !== null) {
            return value;
        }
    } catch(e) {
        console.log(e);
    }
}


class HomeScreen extends Component{
    deviceList= [];

    constructor(props) {
        super(props);
        this.state = {
            userID:null,
        }

    }

    async componentDidMount() {
        const testing = this.props.navigation.addListener('focus', async() => {
            const getUser = await getData();
            this.setState({userID:getUser});
            this.deviceList = [];
            console.log(this.state.userID);
            if(this.state.userID){
                const response = await fetch(config.backend_endpoint + "/users/" + this.state.userID + "/scan");
                const json = await response.json();
                try{
                    for(const items of json){
                        this.deviceList.push(items);
                    }
                }
                catch{
                    if(!json.error){
                        console.log("No devices currently in database");
                    }

                }

                console.log(this.deviceList);
            }


        })

    }

    componentWillUnmount() {

    }

    alertItemName = (item) => {
        alert(item.grade)
    }

    render(){
        return(

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Button
                    title="Go to Scanning Screen"
                    onPress={() => this.props.navigation.navigate('ScanningScreen',{userID:this.userID})}
                />

                <Button
                    title = "Go to Unknown Page"
                    onPress={() => this.props.navigation.navigate('UnknownVendorScreen')}
                />
            </View>




        );

    }

}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 3,
        backgroundColor: '#d9f9b1',
        alignItems: 'center',
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