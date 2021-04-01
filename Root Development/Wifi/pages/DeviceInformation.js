import * as React from 'react';
import {Image, View, Text, StyleSheet, Dimensions} from "react-native";
import {DefaultTheme, Provider as PaperProvider, Button, Subheading, TextInput} from "react-native-paper";
import HomeScreen from '../pages/Home'
import ScanResults from "../Objects/ScanResult";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = require('../config');
const SCREENSIZE = Dimensions.get('screen');

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
    let isManuallyAdded = false;
    const {item, index} = route.params;

    if(!index && index !== 0){
        isIndex = false;
    }

    if(!item.grade){
        isGrade = false
    }

    if(item.ip === "Manually Added"){
        isManuallyAdded = true;
    }


    console.log(index);
    return (
        <PaperProvider theme={theme}>
            <>
                <View style={styles.innerBody}>
                    <Subheading>
                        Vendor Name : { isManuallyAdded ? item.tosdr_vendor: item.wifi_vendor}
                    </Subheading>

                    <Subheading>
                        Grade: { isGrade ? item.grade: 'Unknown'}
                    </Subheading>

                    <Button mode="contained" onPress={() => deleteDevice(null, index, navigation)}>
                        { isIndex ? 'Remove from List' : 'Add to List' }
                    </Button>
                </View>
            </>
        </PaperProvider>

    );
}

const styles = StyleSheet.create({
    innerBody: {
        //alignItems: 'center',
        //position: 'absolute',
        flex: 0.4,
        paddingVertical: SCREENSIZE.height * .05,
        paddingHorizontal: SCREENSIZE.width * .05,
    },
    paddingStyle:{
        padding: 10
    },
    input:{
        margin: 4,
    },
    button:{
        margin: 4,
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
};


export default DeviceModal;