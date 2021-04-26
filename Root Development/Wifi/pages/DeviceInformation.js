import * as React from 'react';
import {Image, View, Text, StyleSheet, Dimensions, FlatList, SafeAreaView, ScrollView, Linking} from "react-native";
import {
    DefaultTheme,
    Provider as PaperProvider,
    Button,
    Subheading,
    IconButton,
    List,
    Headline
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
    let isDocType = true;
    const {item, index} = route.params;
    let gradeColor;


    useEffect(() => {
        // Update the document title using the browser API
        navigation.setOptions({ title: item.wifi_vendor });
    });

    if(!item.docType){
        isDocType = false;
    }

    if(!index && index !== 0){
        isIndex = false;
    }

    if(!item.grade){
        isGrade = false
        gradeColor = '#343a40'
    }
    else{
        if(item.grade === 'A'){
            gradeColor = '#28a745'
        }
        else if(item.grade === 'B'){
            gradeColor = '#79b752'
        }
        else if(item.grade === 'C'){
            gradeColor = '#ffc107'
        }
        else if(item.grade === 'D'){
            gradeColor = '#d66f2c'
        }
        else if(item.grade === 'E'){
            gradeColor = '#dc3545'
        }
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
            <List.Item style={{ margin: 0 }}
                       description={item.title.toString()}
                       descriptionStyle={styles.TextInfo}
                       descriptionNumberOfLines={5}
                       titleNumberOfLines={0}
                       theme={styles.theme}
                       accessible={true}

            />
        )
    }

    if(isDocType){
    console.log(index);
    return (
        <PaperProvider theme={theme}>
            <ScrollView
              alwaysBounceVertical={false}
            >
            <>
                <View style={styles.innerBody}>

                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            Document Type:
                            <Text style={styles.TextInfo} accessible={false}>{ " " + item.docType }</Text>
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
                            <Subheading style={{fontWeight:'bold'}} accessible={true}
                                        screenReaderEnable={true} >
                                {item.wifi_vendor}
                            </Subheading>
                            <View
                                style = {{
                                    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                                    width: Dimensions.get('window').width * 0.2,
                                    height: Dimensions.get('window').width * 0.2,
                                    maxHeight: '45%',
                                    maxWidth: '15%',
                                    backgroundColor:gradeColor,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Headline style={{fontWeight:'bold', color:'#ffffff'}}
                                         accessible={true}
                                         screenReaderEnable={true}>
                                {isGrade ? item.grade: 'N/A'}
                            </Headline>
                            </View>

                        </View>


                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            Why?
                            <Text style={styles.TextInfo} accessible={false}> {" "+GradeList[item.grade]}</Text>
                        </Subheading>

                        <View style={styles.rowContainer}>

                            <Subheading style={styles.reviews} accessible={true}
                                        accessibilityLabel="This is the companies list of reviews."
                                        screenReaderEnable={true}>Reviews from TOS;DR:
                            </Subheading>

                            <Subheading style={styles.link} accessible={true}
                                        accessibilityLabel="This is a link to Terms of service didn't read website."
                                        screenReaderEnable={true}
                                        onPress={ ()=>{ Linking.openURL('https://tosdr.org')}}>TOS;DR Link
                            </Subheading>
                        </View>

                        <View style={ styles.listContainer}>
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
                            View { item.docType }
                        </Button>

                        <Button style={styles.button} mode="contained" onPress={() => deleteDevice(null, index, navigation)} accessible={true} color={'#8d0404'}
                                accessibilityLabel="Tap to remove this company from your list."
                                accessibilityHint="This will navigate you to the home page."
                                screenReaderEnable={true}>
                            { isIndex ? 'Remove from List' : 'Add to List' }
                        </Button>

                    </View>
                </>
            </PaperProvider>

        );
    }
    else{
        return (
            <PaperProvider theme={theme}>
                <>
                    <View style={styles.innerBody}>

                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            Document Type:
                            <Text style={styles.TextInfo} accessible={false}>{ ' No Document' }</Text>
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
                            <Subheading style={{fontWeight:'bold'}} accessible={true}
                                        screenReaderEnable={true} >
                                {item.wifi_vendor}
                            </Subheading>

                            <View
                                style = {{
                                    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                                    width: Dimensions.get('window').width * 0.2,
                                    height: Dimensions.get('window').width * 0.2,
                                    maxHeight: '45%',
                                    maxWidth: '15%',
                                    backgroundColor:gradeColor,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Headline style={{fontWeight:'bold', justifyContent:'center', color:'#ffffff'}}
                                          accessible={true}
                                          screenReaderEnable={true}>
                                    {isGrade ? item.grade: 'N/A'}
                                </Headline>
                            </View>
                        </View>
                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            Why?
                            <Text style={styles.TextInfo} accessible={false}> {" "+GradeList[item.grade]}</Text>
                        </Subheading>

                        <View style={styles.rowContainer}>

                            <Subheading style={styles.reviews} accessible={true}
                                        accessibilityLabel="This is the companies list of reviews."
                                        screenReaderEnable={true}>Reviews from TOS;DR:
                            </Subheading>

                            <Subheading style={styles.link} accessible={true}
                                        accessibilityLabel="This is a link to Terms of service didn't read website."
                                        screenReaderEnable={true}
                                        onPress={ ()=>{ Linking.openURL('https://tosdr.org')}}>TOS;DR Link

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

                        <Button style={styles.button} mode="contained" onPress={() => deleteDevice(null, index, navigation)} accessible={true} color={'#8d0404'}
                                accessibilityLabel="Tap to remove this company from your list."
                                accessibilityHint="This will navigate you to the home page."
                                screenReaderEnable={true}>
                            { isIndex ? 'Remove from List' : 'Add to List' }
                        </Button>

                </View>
            </>
            </ScrollView>
        </PaperProvider>

        );
    }
}

const styles = StyleSheet.create({
    innerBody: {
        flex: 0.5,
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .01,
        paddingHorizontal: SCREENSIZE.width * .05,
        bottom: SCREENSIZE.height * .2,
        top: SCREENSIZE.height * .01,
        minHeight: SCREENSIZE.height * 0.8,
        maxHeight: SCREENSIZE.height * 0.9,
        marginHorizontal: SCREENSIZE.width * 0.04

    },
    paddingStyle:{
        padding: 0.5,
        fontWeight: "bold"
    },
    paddingCompanyGrade:{
        margin: 0.5,
        fontWeight: "bold",
        flexDirection: 'column',
        alignItems: 'center'
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
        flex:1,
        //flexBasis:-1,
        //minHeight:'20%',
        //height:SCREENSIZE.height * 5,
        paddingHorizontal: SCREENSIZE.width * .01,
        paddingVertical: SCREENSIZE.height * .01,
        paddingBottom: SCREENSIZE.height * .01,
        //padding: 5,
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
    },
    TextInfo:{
        flexDirection:'row',
        fontWeight:'normal',
        color:'#000000',
        flexWrap: 'wrap'
    },
    reviews: {
        fontWeight: "bold",
    },
    link: {
        fontWeight: "bold",
        alignSelf: 'flex-end',
        color: '#0060a9',

    },
    rowContainer: {
        flexDirection: 'row',
        flexWrap:'wrap',
        justifyContent:'space-between'
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
