import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    NativeEventEmitter,
    Button,
    TouchableOpacity
} from 'react-native';
import {RNLanScanEvent, RNRnLanScan} from 'react-native-rn-lan-scan';
import ScanResults from './ScanResult';
import Reviews from  './Reviews';
import NetInfo from '@react-native-community/netinfo'
import Home from '../UI/screens/Home'
import WifiScanButton from "../UI/components/WifiScanButton";
import HomeButton from "../UI/components/HomeButton.js";
import SearchBar from "../UI/components/SearchBar";
import ModalButton from "../UI/components/ModalButton";


var URL = "http://127.0.0.1:3000"


//var results = [];

export default class Scan extends Component {
    eventStuff = new NativeEventEmitter(RNLanScanEvent);
    results = [];
    knownVendorList = [];
    unknownVendorList = [];
    inTOSDRVendorList = [];

    constructor(props) {
        super(props);
        this.state = {
            scanning: false,
            scanComplete: false,
            sendToDB: false,
            isCheckingVendors: false,
            currentUserID: null,

        };
    }

    componentDidMount() {

        this.eventStuff.addListener("EventReminder", (data) => {
            if(data['type'] === 'devices'){
                if(data['name'][2] != null){
                    this.results.push(new ScanResults(data['name'][0], data['name'][2]));

                }
            }
            if(data['name'] === 'Finish') {
                console.log("Scan is finished");
                //console.log(this.results);
                this.setState({scanning:false,isCheckingVendors:true});
                this.checkForUnknown();
            }
            if(data['name'] === 'Started'){
                console.log("Scan has started");
                this.setState({scanning: true, scanComplete:false});
            }
        });
        console.log("Listener Registered.")
    }
    componentWillUnmount() {
        this.eventStuff.removeAllListeners("EventReminder",);
        console.log("Listener Removed.")
    }


    storeToDB = () => {
        /*
        fetch('http://127.0.0.1:3000/users/T/scan')
            .then(res => res.json())
            .then(res => {
                console.log(res[0].ip);
            })
            .catch((error) => {
                console.log(error);
            });

         */

        fetch(URL + '/users/B/scan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.inTOSDRVendorList)
        });

        console.log("Stored to Database");
        this.setState({scanComplete:true});


    }

    scan = () => {
        RNRnLanScan.getModuleList((error, someData) => {
            if (error) {
                console.error(error)
            } else {
                //console.log(someData)
            }
        })
    }

    checkForUnknown = () =>{
        for(const item of this.results){
            if(item.wifi_vendor !== "Unknown_Vendor"){
                this.knownVendorList.push(item);
            }
            else{
                this.unknownVendorList.push((item))
                //this.knownVendorList.push(item);
            }
        }
        this.results = [];
        this.checkVendorReferenceSheet();
    }

    checkVendorReferenceSheet = () => {
        fetch(URL + '/vendorReferenceSheet')
            .then(res => res.json())
            .then(res => {
                //console.log("\nThis is the known vendor list: \n", this.knownVendorList, "\n");
                for(const [index,result] of this.knownVendorList.entries()){
                    var found = false;
                    for(const item of res){
                        if(item.wifi_vendor === result.wifi_vendor){
                            this.knownVendorList[index].addTOSDRVendor(item.tosdr_vendor);
                            this.inTOSDRVendorList.push(this.knownVendorList[index]);
                            found = true;
                            //console.log(this.knownVendorList[index]);
                        }
                    }

                    if(!found){
                        this.knownVendorList[index].addTOSDRVendor("Not in Database");
                        this.unknownVendorList.push(this.knownVendorList[index]);
                    }
                }

                console.log("InTOSDR LIST: ", this.inTOSDRVendorList);
                console.log("UNKNWON LIST", this.unknownVendorList);

                this.tosdrCheckForGrade();
            })
            .catch((error) => {
                console.log(error);
            });
    }


    sendInfoToNLP = (url, docType, tosdrData, itemIndex, isFromUnknownPage) => {
        console.log("Sending info to NLP...");
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
                if(!isFromUnknownPage){
                    const amountOfReviews = 8;
                    var reviews = [];
                    var points = tosdrData.points;
                    console.log("Recieved grade from NLP for " + this.inTOSDRVendorList[itemIndex].tosdr_vendor + " with grade of " + data.grade);
                    try{
                        const newPointsArray = points.slice(0, amountOfReviews);

                        for(var items in newPointsArray){

                            reviews.push(new Reviews(tosdrData.pointsData[newPointsArray[items]].id, tosdrData.pointsData[newPointsArray[items]].title, tosdrData.pointsData[newPointsArray[items]].tosdr.case,
                                tosdrData.pointsData[newPointsArray[items]].tosdr.point, tosdrData.pointsData[newPointsArray[items]].tosdr.score, tosdrData.pointsData[newPointsArray[items]].tosdr.tldr));
                        }
                    }
                    catch (TypeError) {
                        console.log("Oh well item no found");
                    }

                    this.inTOSDRVendorList[itemIndex].addGradeReviews(data.grade, reviews);
                    console.log(data);
                }

            })
        }).catch(function(error){
                console.log('request failed', error)
            })
    }

    tosdrCheckForGrade = () => {
        console.log("Checking TOSDR API");
        var stringToCheck = "Ring LLC"
        const amountOfReviews = 8;

        for(const [index,result] of this.inTOSDRVendorList.entries()){
            var reviews = [];
            fetch("https://tosdr.org/api/1/service/" + result.tosdr_vendor +".json")
                .then(res => {
                    res.json().then((data) => {
                        if(data.class){
                            var points = data.points;
                            console.log("Current item we are checking: " + result.ip + " with grade of " + data.class);
                            try {
                                const newPointsArray = points.slice(0, amountOfReviews);

                                for(var items in newPointsArray){

                                    reviews.push(new Reviews(data.pointsData[newPointsArray[items]].id, data.pointsData[newPointsArray[items]].title, data.pointsData[newPointsArray[items]].tosdr.case,
                                        data.pointsData[newPointsArray[items]].tosdr.point, data.pointsData[newPointsArray[items]].tosdr.score, data.pointsData[newPointsArray[items]].tosdr.tldr));
                                }
                            }
                            catch (TypeError) {
                                console.log("Oh well item no found");
                            }

                            this.inTOSDRVendorList[index].addGradeReviews(data.class, reviews);
                            reviews = [];
                        }
                        else{
                            var url;
                            var docType;
                            if(data.links["Privacy Policy"]){
                                url = data.link['Privacy Policy'].url;
                                docType = "Privacy Policy";
                                console.log("Link for ", result.tosdr_vendor,  data.links['Privacy Policy']);
                            }
                            else if(data.links["Privacy Policy "]){
                                url = data.links['Privacy Policy '].url;
                                docType = "Privacy Policy";
                                console.log("Link for ", result.tosdr_vendor,  data.links['Privacy Policy ']);
                            }
                            else if(data.links["Terms of Use"]){
                                url = data.link['Terms of Use'].url;
                                docType = "Terms Of Service";
                                console.log("Link for ", result.tosdr_vendor,  data.links['Terms of Use']);
                            }
                            else if(data.links["Conditions of Use"]){
                                url = data.link['Conditions of Use'].url;
                                docType = "Terms Of Service";
                                console.log("Link for ", result.tosdr_vendor,  data.links['Conditions of Use']);
                            }

                            this.sendInfoToNLP(url, docType, data, index, false);

                        }


                    }).then(data => {
                        if(index === this.inTOSDRVendorList.length - 1){
                            this.setState({isCheckingVendors:false});
                            this.storeToDB();
                        }
                    })
                        .catch(function(error) {
                        console.log('Data failed', error)
                    });
                })
                .catch(function(error){
                console.log('request failed', error)
            })


        }


    }





    testing = () => {
        fetch(URL + '/sendToNLP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=202140280',
                docType: "tos"
            })
        });
    }

    render() {
        const isScanning = this.state.scanning;


        return (


            <View style = { styles.container }>


                <Text style = { styles.header }> Scan </Text>
                <Text>
                    Are you scanning: { isScanning ? 'YES' : ' NO ' }</Text>
                <Button onPress = { isScanning ? this.testing : this.scan }
                        title = { isScanning ? 'Cant Scan' : 'Scan' }/>
            </View >




        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    scanForMyDevices: {
        color: "#121212",
        fontSize: 18,
        marginTop: 76,
        marginLeft: 8
    },
    companyGrade: {
        color: "#121212",
        fontSize: 25,
        marginTop: 35,
        alignSelf: "center"
    },
    cupertinoButtonInfo2: {
        height: 60,
        width: 159,
        borderRadius: 8
    },
    cupertinoSearchBarWithMic1: {
        height: 60,
        width: 216,
        borderRadius: 8
    },
    cupertinoButtonInfo2Row: {
        height: 51,
        flexDirection: "row",
        marginTop: -115
    },
    cupertinoButtonWhiteTextColor: {
        height: 44,
        width: 271,
        borderWidth: 2,
        borderColor: "#000000",
        borderRadius: 10,
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            width: 3,
            height: 3
        },
        elevation: 5,
        shadowOpacity: 0.01,
        shadowRadius: 0,
        marginTop: 91,
        marginLeft: 52
    }
});