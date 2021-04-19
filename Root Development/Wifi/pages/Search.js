import React, { Component } from 'react';
import { Text } from 'react-native';
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

const sendToDB = async(userID, device) => {

///Append to database list

    const nlpInfo = await fetch(config.backend_endpoint + '/users/B/scan', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(device)
    });

    console.log("Stored to Database");

}


class Search extends Component {
    render() {
        return (
            <Text>Hello, I am your cat!</Text>
        );
    }
}

export default Search;