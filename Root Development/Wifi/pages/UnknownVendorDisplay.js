import * as React from 'react';
import { Appbar, Subheading, Button, DefaultTheme, List, Text, Provider as PaperProvider } from 'react-native-paper'
import { StyleSheet, View, Dimensions, Linking } from "react-native";

import { FAB } from 'react-native-paper';
import Reviews from "../Objects/Reviews";
import ScanResults from "../Objects/ScanResult";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREENSIZE = Dimensions.get('screen');

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

const UnknownVendorDisplay = ({navigation, route}) => {

    const {companyName, url, displayURL} = route.params;

    // const vendorObject = JSON.parse(vendor);

    // console.log(vendorObject);

    const sendInfoToNLP = async(url, docType, vendor) => {
        console.log("Sending info to NLP...Waiting For grade...");
        var device = null;
        const response = await fetch(config.backend_endpoint + '/sendToNLP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                docType: docType
            })
        })
        const data = await response.json();
        device = new ScanResults(null, null);
        device.addGradeReviews(data.grade, null);
        device.addTOSDRVendor(vendor);
        console.log(device);
        navigation.navigate('HomeScreen')
    }


    return (
        <PaperProvider theme={theme}>
            <View style={styles.innerBody}>
                <Subheading>
                    We believe that this is the correct document to process:
                </Subheading>

                <Text style={styles.link}
                      onPress={() => Linking.openURL(url)}>
                    {displayURL}
                </Text>

                <List.Section style={styles.row}>
                    <Button mode="contained" style={styles.button} onPress={() => {sendInfoToNLP(url, docType, vendor, userID);
                        navigation.navigate('HomeScreen');}}>
                        Trust Us
                    </Button>

                    <Button mode="contained" style={styles.button} onPress={() => {navigation.navigate('HomeScreen')}}>
                        Don't Trust Us
                    </Button>
                </List.Section>
            </View>
        </PaperProvider>

        /*
    <View style = { styles.container }>

        <Text style = { styles.header }> Unknown Vendor Display Page </Text>
        <Text>
            Information here....</Text>
        <Button
            title="Trust Us"
            onPress={() => {sendInfoToNLP(url, docType, vendor, userID); navigation.navigate('HomeScreen');}}
        />
        <Button
        title="Dont Trust Us"
        onPress={() => navigation.navigate('UnknownVendorScreen')}
    />
    </View >
         */
    );
}

/*
<Text style={styles.link}>
    {vendor.TOS}
</Text>
*/

const styles = StyleSheet.create({
    innerBody: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .02,
        paddingHorizontal: SCREENSIZE.width * .05
    },
    /*
    subheading:{
        fontSize: 20
    },
    */
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .01,
        paddingHorizontal: SCREENSIZE.width * .05
    },
    button: {
        margin: 4
    },
    link: {
        paddingVertical: SCREENSIZE.height * .02,
        paddingHorizontal: SCREENSIZE.width * .05,
        margin: 3,
        fontSize: 18,
        color: '#0060a9'
    }
});

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0060a9',
        accent: '#f3cd1f',
    },
};

export default UnknownVendorDisplay;
