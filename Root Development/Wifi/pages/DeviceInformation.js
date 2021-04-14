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
    const GradeList =  {'A': 'The best terms of services; they treat the user fairly, respect their rights, and will not abuse their data.'
            , 'B': 'The terms of services are fair towards the user but they could be improved.'
            , 'C': 'The terms of service are okay but some issues need your consideration.'
            , 'D': 'The terms of service are very uneven or some important issues need the user\'s attention.'
            , 'E': 'The terms of service raise very serious concerns.'
            , 'No Grade': 'The terms have not been completely graded yet.'}
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
                        Company Name -
                    <Text style={styles.TextInfo} accessible={false}>{ " "+item.wifi_vendor}</Text>
                    </Subheading>

                    {/*<Subheading style={styles.paddingStyle}>*/}
                    {/*    IP - {item.ip}*/}
                    {/*</Subheading>*/}

                    {/*<Subheading style={styles.paddingStyle}>*/}
                    {/*    MAC - {item.mac}*/}
                    {/*</Subheading>*/}

                    <Subheading style={styles.paddingStyle}
                                accessible={true}
                                screenReaderEnable={true}>
                        Grade -
                        <Text style={styles.TextInfo} accessible={false}>{" " + isGrade ? item.grade: 'Unknown'}</Text>
                    </Subheading>

                    <Subheading style={styles.paddingStyle}
                                accessible={true}
                                screenReaderEnable={true}>
                        Grade Meaning -
                        <Text style={styles.TextInfo} accessible={false}> {" "+GradeList[item.grade]}</Text>
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
        //alignItems: 'center',
        //position: 'absolute',
        flex: 0.4,
        paddingTop:30,
        //paddingVertical: SCREENSIZE.height * .02,
        paddingHorizontal: SCREENSIZE.width * .05,
    },
    paddingStyle:{
        padding: 10,
        margin: 1,
        fontWeight: "bold"
    },
    button:{
        margin: 10,
        marginTop:30,
        padding: 5
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
    },
    TextInfo:{fontWeight:'normal',
    color:'#000000'},

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
