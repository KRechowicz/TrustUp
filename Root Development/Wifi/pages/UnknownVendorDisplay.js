import * as React from 'react';
import { StyleSheet, View, Image, Text, Button} from 'react-native';
import { FAB } from 'react-native-paper';
import Reviews from "../Objects/Reviews";
import ScanResults from "../Objects/ScanResult";

var URL = "http://127.0.0.1:3000";

const sendInfoToNLP = (url, docType, vendor, userID) => {
    console.log("Sending info to NLP...Waiting For grade...");
    var device = null;
    fetch(URL + '/sendToNLP', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url,
            docType: docType
        })
    }).then(res => {
        res.json().then((data) => {
                device = new ScanResults(null, null);
                device.addGradeReviews(data.grade, null);
                device.addTOSDRVendor(vendor);
                console.log(device);

        })
    }).then(data => {
        if(device){
            sendToDB(userID,device);
        }
        else{
            console.log("Error getting grade from NLP...");
        }

    })

        .catch(function(error){
        console.log('request failed', error)
    })
}

const sendToDB = (userID, device) => {

///Append to database list
    fetch(URL + '/users/B/scan', {
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

    const {userID, vendor, docType, url} = route.params;


    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Button
                title="Trust Us"
                onPress={() => {sendInfoToNLP(url, docType, vendor, userID); navigation.navigate('HomeScreen');}}
            />
            <Button
                title="Dont Trust Us"
                onPress={() => navigation.navigate('HomeScreen')}
            />
        </View>
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

export default UnknownVendorDisplay;