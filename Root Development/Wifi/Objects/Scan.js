import React, { Component } from 'react';
import {Text, StyleSheet, View, Dimensions, TextInput, NativeEventEmitter, Button} from 'react-native';
import {RNLanScanEvent, RNRnLanScan} from 'react-native-rn-lan-scan';
import ScanResults from './ScanResult';
import Reviews from  './Reviews';
import NetInfo from '@react-native-community/netinfo'


//var results = [];

export default class Scan extends Component {
    eventStuff = new NativeEventEmitter(RNLanScanEvent);
    results = [];
    knownVendorList = [];
    unknownVendorList = [];

    constructor(props) {
        super(props);
        this.state = {
            scanning: false,
            scanComplete: false,
            sendToDB: false,
            isCheckingVendors: false,

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
                this.setState({scanning:false,isCheckingVendors:true});
                this.checkForUnknown();
            }
            if(data['name'] === 'Started'){
                this.setState({scanning: true, scanComplete:false});
                console.log("Scan started");
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

        fetch('http://127.0.0.1:3000/users/B/scan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.knownVendorList)
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
                this.knownVendorList.push(item);
            }
        }
        this.results = [];
        this.checkVendorReferenceSheet();
    }

    checkVendorReferenceSheet = () => {
        fetch('http://127.0.0.1:3000/vendorReferenceSheet')
            .then(res => res.json())
            .then(res => {
                //console.log("\nThis is the known vendor list: \n", this.knownVendorList, "\n");
                for(const item of res){
                    for(const [index,result] of this.knownVendorList.entries()){
                        if(item.wifi_vendor === result.wifi_vendor){
                            this.knownVendorList[index].addTOSDRVendor(item.tosdr_vendor);
                            //console.log(this.knownVendorList[index]);

                        }
                    }
                }



                this.tosdrCheckForGrade();
            })
            .catch((error) => {
                console.log(error);
            });
    }


    sendInfoToNLP = (urlToSendForScraping) => {
        fetch('http://127.0.0.1:3000/users/B/sendToNLP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({url: urlToSendForScraping})
        }).then(res => {
            res.json().then((data) => {
                console.log(data);
            })
        })
    }

    tosdrCheckForGrade = () => {
        console.log("clicked");
        var stringToCheck = "Ring LLC"
        const n = 8;

        for(const [index,result] of this.knownVendorList.entries()){
            var reviews = [];
            if(result.wifi_vendor !== "Unknown_Vendor" && typeof result.tosdr_vendor !== "undefined"){
                fetch("https://tosdr.org/api/1/service/" + result.tosdr_vendor +".json")
                    .then(res => {
                        res.json().then((data) => {
                            if(typeof  data.class !== false || typeof data.class !== undefined || data.error[0] === "INVALID_SERVICE" || data.class !== "false"){
                                var points = data.points;
                                console.log("Current item we are checking: " + result.tosdr_vendor + " with grade of " + data.class);
                                try {
                                    const newPointsArray = points.slice(0, n);

                                    for(var items in newPointsArray){

                                        reviews.push(new Reviews(data.pointsData[newPointsArray[items]].id, data.pointsData[newPointsArray[items]].title, data.pointsData[newPointsArray[items]].tosdr.case,
                                            data.pointsData[newPointsArray[items]].tosdr.point, data.pointsData[newPointsArray[items]].tosdr.score, data.pointsData[newPointsArray[items]].tosdr.tldr));
                                    }
                                }
                                catch (TypeError) {
                                    console.log("Oh well item no found");
                                }

                                this.knownVendorList[index].addGradeReviews(data.class, reviews);
                                reviews = [];
                            }
                            else if(data.links === "Privacy Policy"){
                                this.sendInfoToNLP(data.links["Privacy Policy"]);
                            }


                        }).then(data => {
                            if(index === this.knownVendorList.length - 1){
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


    }





    testing = () => {
        fetch('http://127.0.0.1:3000/sendToNLP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'WOah',
                userId: 'hello'
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
                <Button onPress = { isScanning ? this.testing : this.testing }
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
    }
});