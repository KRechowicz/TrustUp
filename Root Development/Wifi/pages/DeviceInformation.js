import * as React from 'react';
import {Image, View, Text, StyleSheet, Dimensions, FlatList, SafeAreaView, ScrollView} from "react-native";
import {
    DefaultTheme,
    Provider as PaperProvider,
    Button,
    Subheading,
    IconButton,
    List
} from "react-native-paper";
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

const DeviceModal = ({ navigation, route }) => {
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

    console.log(item.reviews);

    let isReviews = true;
    if(!item.reviews){
        item.reviews = [];
        console.log(item.reviews);
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

    const renderEmptyContainer = () =>{
        return(
            <Subheading style={styles.paddingStyle}>
                No Reviews for this Company
            </Subheading>
        );

    }

    const renderItems = ({item}) => {
        let isReviews = true;
        if(!item.title){
            isReviews = false;
        }
        return (
            <List.Item style={{ margin: 0, padding: 0 }}
                       description={item.title.toString()}
                       theme={styles.theme}
                       accessible={true}

            />
        )
    }


    console.log(index);
    return (
        <PaperProvider theme={theme}>
            <>
                <View style={styles.innerBody}>

                    <Subheading style={styles.paddingStyle}>
                        Company Name - { item.wifi_vendor}
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

                    <Subheading style={styles.paddingStyle} accessible={true}
                                accessibilityLabel="This is the companies list of reviews."
                                screenReaderEnable={true}>
                        Reviews:
                    </Subheading>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={item.reviews}
                            keyExtractor= {(item, index) => index.toString()}
                            renderItem={renderItems}
                            ListEmptyComponent={renderEmptyContainer}
                        />
                    </View>

                    <Button style={styles.button} mode="contained" onPress={() => deleteDevice(null, index, navigation)} accessible={true}
                            accessibilityLabel="Tap to remove this company from your list."
                            accessibilityHint="This will navigate you to the home page."
                            screenReaderEnable={true}>
                        { isIndex ? 'Remove from List' : 'Add to List' }
                    </Button>

                    <View>
                        <Button
                            accessible={true}
                            accessibilityLabel="Tap for more details about the information on this page."
                            screenReaderEnable={true}
                            icon="information"
                            style={styles.IconButton}
                            size={30}
                            onPress={() => navigation.navigate('About')}

                        />
                    </View>
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
        alignContent: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .01,
        paddingHorizontal: SCREENSIZE.width * .01
    },
    divider:{
        padding: 1,
        margin: 2,
    },
    listContainer: {
        height:SCREENSIZE.height * 0.4,
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
    },
    iconButton:{
        alignItems: "center"
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
