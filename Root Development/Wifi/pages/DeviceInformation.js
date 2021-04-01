import * as React from 'react';
import { Image, View, Text, StyleSheet } from "react-native";
import { DefaultTheme, Provider as PaperProvider, Button } from "react-native-paper";
import HomeScreen from '../pages/Home'
import ScanResults from "../Objects/ScanResult";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const deleteDevice = async (ip, index, navigation) => {
    const getID = await getData();
    const response = await fetch(config.backend_endpoint + "/users/" + getID + "/scan/deleteDevice", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ip: ip, index:index})
    });

    navigation.navigate('HomeScreen');
    //console.log(response.json());
}



const DeviceModal = ({ navigation, route}) => {
    let isIndex = true;
    let isGrade = true;
    const {item, index} = route.params;

    if(!index){
        isIndex = false;
    }

    if(!item.grade){
        isGrade = false
    }

    console.log(index);
    return (
        <PaperProvider theme={theme}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>{item.wifi_vendor}</Text>
                <Text>Grade: { isGrade ? item.grade: 'Unknown'}</Text>
                <Button mode="contained" onPress={() => deleteDevice(null, index, navigation)}>
                    { isIndex ? 'Remove from List' : 'Add to List' }
                </Button>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    scanButton: {
        padding: 10,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 50,
        marginRight: 50,
        borderColor: "#111",
        borderRadius: 10,
        backgroundColor: '#0060A9',

    }
})
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0060a9',
        accent: '#f3cd1f',

    },
}


export default DeviceModal;