import * as React from 'react';
import {Image, View, Text, StyleSheet, Dimensions, FlatList, ListView} from "react-native";
import {DefaultTheme, Provider as PaperProvider, Button, Subheading, List, DataTable} from "react-native-paper";
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

const renderItem = (rowData) => {
    return (<Text>{rowData.title}</Text>);
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

    /*
    <Text>
        {item.reviews[0].title}
    </Text>

    <FlatList
        data={item.reviews}
        keyExtractor= {(reviews, index) => index.toString()}
        renderItem={renderItems}
    />

    {
        item.reviews.map(function(reviews, index){
            return <Text key={index}>{reviews.title}</Text>
        })
    }
     */

    const renderItems = ({item}) => {
        return (
            <Text theme={styles.theme} style={styles.text}>
                - {item.title.toString()}
            </Text>
        )
    }

    console.log(index);
    return (
        <PaperProvider theme={theme}>
            <>
                <View style={styles.innerBody}>
                    <Subheading style={styles.paddingStyle}>
                        Company Name - { isManuallyAdded ? item.tosdr_vendor: item.wifi_vendor}
                    </Subheading>

                    <Subheading style={styles.paddingStyle}>
                        IP - {item.ip}
                    </Subheading>

                    <Subheading style={styles.paddingStyle}>
                        MAC - {item.mac}
                    </Subheading>

                    <Subheading style={styles.paddingStyle}>
                        Grade - { isGrade ? item.grade: 'Unknown'}
                    </Subheading>

                    <Subheading style={styles.paddingStyle}>
                        Reviews:
                    </Subheading>

                    <View style={styles.listContainer}>
                            <FlatList
                            data={item.reviews}
                            renderItem={renderItems}
                            />
                    </View>

                    <Button style={styles.button} mode="contained" onPress={() => deleteDevice(null, index, navigation)}>
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
        paddingVertical: SCREENSIZE.height * .02,
        paddingHorizontal: SCREENSIZE.width * .05,
    },
    paddingStyle:{
        padding: 4,
        margin: 4,
        fontWeight: "bold"
    },
    button:{
        margin: 10,
    },
    listContainer: {
        height:SCREENSIZE.height * 0.45,
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    text:{
        padding: 1,
        margin: 1
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
