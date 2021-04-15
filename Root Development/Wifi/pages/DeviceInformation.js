import * as React from 'react';
import {Image, View, Text, StyleSheet, Dimensions, FlatList, SafeAreaView, ScrollView, Linking} from "react-native";
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
import {useEffect} from "react";
import {Alert} from "react-native";

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

    Alert.alert(
        "Remove from your list?",
        "This will not remove the device from your network, only tracking in this app!",
        [
            {
                text: "Delete Entry",
                onPress: async () => {
                    const response = await fetch(config.backend_endpoint + "/users/" + getID + "/scan/deleteDevice", {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ip: ip, index: index})
                    });

                    navigation.navigate('HomeScreen');
                },
                style: "cancel"
            },
            { text: "Keep Entry in List", onPress: () => console.log("OK Pressed") }
        ]
    );




    //console.log(response.json());


}

const DeviceModal = ({ navigation, route }) => {
    const GradeList =  {'A': 'The best terms of services; they treat the user fairly, respect their rights, and will not abuse their data.'
            , 'B': 'The terms of services are fair towards the user but they could be improved.'
            , 'C': 'The terms of service are okay but some issues need your consideration.'
            , 'D': 'The terms of service are very uneven or some important issues need the user\'s attention.'
            , 'E': 'The terms of service raise very serious concerns.'
            , 'undefined': 'The terms have not been completely graded yet.'}
    let isIndex = true;
    let isGrade = true;
    let isManuallyAdded = false;
    const {item, index} = route.params;

    useEffect(() => {
        // Update the document title using the browser API
        navigation.setOptions({ title: item.wifi_vendor });
    });


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
                       descriptionStyle={styles.TextInfo}
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

                    <Subheading style={styles.paddingStyle}
                                accessible={true}
                                screenReaderEnable={true}>
                        Document Type:
                        <Text style={styles.TextInfo} accessible={false}>{ " "+item.docType}</Text>
                    </Subheading>

                    <Subheading style={styles.paddingStyle}
                                accessible={true}
                                screenReaderEnable={true}
                                accessibilityLabel={"This item was added to your list at " + item.lastScanned}>
                        Added:
                    <Text style={styles.TextInfo} accessible={false}>{ " "+item.lastScanned}</Text>
                    </Subheading>


                    <View style={styles.paddingCompanyGrade} accessible={true}
                          screenReaderEnable={true}
                          accessibilityLabel={item.wifi_vendor + " has a grade of " + item.grade}>
                        <Subheading style={styles.company} accessible={true}
                                    screenReaderEnable={true} >
                            {item.wifi_vendor}
                        </Subheading>
                        <Subheading style={styles.grade}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            {isGrade ? item.grade: 'Unknown'}
                        </Subheading>
                    </View>


                    {/*<Subheading style={styles.paddingStyle}>*/}
                    {/*    IP - {item.ip}*/}
                    {/*</Subheading>*/}

                    {/*<Subheading style={styles.paddingStyle}>*/}
                    {/*    MAC - {item.mac}*/}
                    {/*</Subheading>*/}



                    <Subheading style={styles.paddingStyle}
                                accessible={true}
                                screenReaderEnable={true}>
                        Why?
                        <Text style={styles.TextInfo} accessible={false}> {" "+GradeList[item.grade]}</Text>
                    </Subheading>

                    <View style={styles.rowContainer}>

                    <Subheading style={styles.reviews} accessible={true}
                                accessibilityLabel="This is the companies list of reviews."
                                screenReaderEnable={true}>
                        Reviews from TOS;DR:
                    </Subheading>

                    <Subheading style={styles.link} accessible={true}
                                accessibilityLabel="This is a link to Terms of service didn't read website."
                                screenReaderEnable={true}
                                onPress={ ()=>{ Linking.openURL('https://tosdr.org')}}>
                        TOS;DR Link

                    </Subheading>
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={item.reviews}
                            keyExtractor= {(item, index) => index.toString()}
                            renderItem={renderItems}
                            ListEmptyComponent={renderEmptyContainer}
                        />
                    </View>

                    <Button style={styles.button} mode="contained" onPress={ ()=>{ Linking.openURL(item.docURL)}} accessible={true}
                            accessibilityLabel={"Tap to view the companies " + item.docType + ". This will launch the webpage."}
                            accessibilityHint="This will launch the webpage."
                            screenReaderEnable={true}>
                        View { item.docType } Document
                    </Button>

                    <Button style={styles.button} mode="contained" onPress={() => deleteDevice(null, index, navigation)} accessible={true}
                            accessibilityLabel="Tap to remove this company from your list."
                            accessibilityHint="This will navigate you to the home page."
                            screenReaderEnable={true}>
                        { isIndex ? 'Remove from List' : 'Add to List' }
                    </Button>

                    {/*<View>*/}
                    {/*    <Button*/}
                    {/*        accessible={true}*/}
                    {/*        accessibilityLabel="Tap for more details about the information on this page."*/}
                    {/*        screenReaderEnable={true}*/}
                    {/*        icon="information"*/}
                    {/*        style={styles.IconButton}*/}
                    {/*        size={30}*/}
                    {/*        onPress={() => navigation.navigate('About')}*/}

                    {/*    />*/}
                    {/*</View>*/}
                </View>
            </>
        </PaperProvider>

    );
}

const styles = StyleSheet.create({
    innerBody: {
        flex: 0.5,
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .01,
        paddingHorizontal: SCREENSIZE.width * .05,
        bottom: 15
    },
    paddingStyle:{
        padding: 5,
        margin: 1,
        fontWeight: "bold"
    },
    paddingCompanyGrade:{
        margin: 1,
        fontWeight: "bold",
        flexDirection: 'column',
    },
    button:{
        margin: 5,
        marginTop:8,
        padding: 2
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
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        height:SCREENSIZE.height * 0.35,
        paddingHorizontal: SCREENSIZE.width * .05,
        paddingVertical: SCREENSIZE.height * .01,
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
    },
    TextInfo:{fontWeight:'normal',
    color:'#000000'},
    grade: {
        flex: 1,
        //padding: 20,
        //width: '100%',
        //maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        paddingVertical: 17,
    },
    company: {
        flex: 0.5,
        //padding: 20,
        //width: '100%',
        //maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 20,
        marginTop:0
    },
    reviews: {
        margin: 1,
        fontWeight: "bold",
    },
    link: {
        margin: 1,
        fontWeight: "bold",
        alignSelf: 'flex-end',
        color: '#0060a9',
        paddingLeft: SCREENSIZE.width * 0.13
    },
    rowContainer: {
        flexDirection: 'row'
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
