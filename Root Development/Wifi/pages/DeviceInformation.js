import * as React from 'react';
import {Image, View, Text, StyleSheet, Dimensions, FlatList, SafeAreaView, ScrollView} from "react-native";
import {DefaultTheme, Provider as PaperProvider, Button, Subheading, List, DataTable, Divider} from "react-native-paper";
import { Icon } from 'react-native-elements'
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
                {item.title.toString()}
            </Text>
        )
    }

    console.log(index);
    return (
        <PaperProvider theme={theme}>
            <SafeAreaView>
                <ScrollView>
                    <>
                        <View style={styles.innerBody}>
                            <View style={styles.information}>
                                <Icon name="information-outline" type="material-community" size={24} />
                                <Text style={styles.row}>Company - This is the name of the company that either made or manages your device or its software.</Text>
                                <Text style={styles.row}>IP - This is an address assigned by your network for this device. Please note that this may change and can be different from the address seen from outside of your network.</Text>
                                <Text style={styles.row}>Mac address - Each device has a unique identifier which is different from any other device. This helps guarantee devices cannot pretend to be something else.</Text>
                                <View style={styles.grades}>
                                    <Text style={styles.row}>Grades: </Text>
                                    <Text style={styles.row}>A - The best terms of services: they treat the user fairly, respect their rights, and will not abuse their data.</Text>
                                    <Text style={styles.row}>B - The terms of services are fair towards the user but they could be improved.</Text>
                                    <Text style={styles.row}>C - The terms of service are okay but some issues need your consideration.</Text>
                                    <Text style={styles.row}>D - The terms of service are very uneven or some important issues need the user's attention.</Text>
                                    <Text style={styles.row}>E - The terms of service raise very serious concerns.</Text>
                                    <Text style={styles.row}>No Grade - The terms have not been completely graded yet.</Text>
                                </View>

                            </View>

                            <Divider style={styles.divider}/>

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
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>

    );
}

const styles = StyleSheet.create({
    innerBody: {
        //alignItems: 'center',
        //position: 'absolute',
        flex: 0.4,
        //paddingVertical: SCREENSIZE.height * .02,
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
    row:{
        padding: 1
    },
    information: {
        // alignContent: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .01,
        paddingHorizontal: SCREENSIZE.width * .01
    },
    divider:{
        padding: 1,
        margin: 2,
    },
    listContainer: {
        height:SCREENSIZE.height * 0.35,
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    text:{
        padding: 1,
        margin: 1
    },
    grades:{
        //padding: 4,
        marginTop: 15
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
