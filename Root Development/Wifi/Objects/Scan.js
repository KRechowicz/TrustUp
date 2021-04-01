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
import Home from '../pages/Search'
import WifiScanButton from "../UI/components/WifiScanButton";
import HomeButton from "../UI/components/HomeButton.js";
import SearchBar from "../UI/components/SearchBar";
import ModalButton from "../UI/components/ModalButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = require('../config');

var nlpPromise;
var tosdrPromise;


//var results = [];

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

export default class Scan extends Component {
    eventStuff = new NativeEventEmitter(RNLanScanEvent);
    results = [];
    knownVendorList = [];
    unknownVendorList = [];
    inTOSDRVendorList = [];
    listToStore = [];

    userIDFromHome = null;
    searchList = ['Sony','paypal','spotify','pure','netflix','apple','microsoft','vk','yahoo','icloud','ask','hulu','signal','pocket','nvidia','bitdefender','sync','medium','brave','huawei','xiaomi','facebook','adobe','Element','amazon','Cisco','google','Rumble','slack','bitdefender','tosdr_vendor','symantec','service','sprint','virgin','cnet','bing','quake','multiple','lorea','onlive','king','cox','rac','enjin','none','uber','ello','mega','wix','looki','toggle','vero','identica','fitbit','taco','centurylink','jawbone','nokia','npr','flow','tmobile','path','revolut','Current','restream','canary','verizon','vive','bethesda','razer','drop','comcast','Reuters','bit','nsa','visions','chip','genius','emp','nrc','dudle','alza','shadow','baidu','inspire','target','nintendo','aol','vox','notion','garmin','waterfall','chase','honey','myspace','forbes','niche','gmx','hq','ixl','finn','leo','nexon','leet','minds','brilliant','gab','Trakt','yr','parsec','yase','icann','anki','grab','geco','akamai','chegg','bose','deepl','alpha','wired','dra','sophos','overleaf','byte','ebird','intercom','August Home','etsy','Nebula','xing','sony','visible','discovery','[spamtobedeleted]','adafruit','loom','xero','mla','whirlpool','matrix','pandora','oculus','yandex','ebay','mimo','samsung','petco','wire','adk','Logitech','Briar','Lenovo','Asus','Netgear','Sony','Motorola','Linksys','Belkin','TomTom','LYKA','Sweet','ADT','Ring LLC','Vice','Dash','Unity','Affirm','LogMeIn','amazon'];

    constructor(props) {
        super(props);
        this.state = {
            scanning: false,
            scanComplete: false,
            sendToDB: false,
            isCheckingVendors: false,
            currentUserID: null,
            checkingNLP: false,
            userIDFromHome:null,

        };
    }

    async componentDidMount() {

        const getID = await getData();
        console.log(getID);
        this.userIDFromHome = getID;




        this.eventStuff.addListener("EventReminder", (data) => {
            if(data['type'] === 'devices'){
                if(data['name'][2] != null){
                    this.results.push(new ScanResults(data['name'][0], data['name'][2]));

                }
            }
            if(data['name'] === 'Finish') {
                console.log("Scan is finished");
                //console.log(this.results);
                this.setState({scanning:false,isCheckingVendors:true, scanComplete:true});
                this.checkForUnknown();
            }
            if(data['name'] === 'Started'){
                console.log("Scan has started");
                this.setState({scanning: true});
            }
        });
        console.log("Listener Registered.")

        this.scan();
        //this.searchButton();

    }
    componentWillUnmount() {
        this.eventStuff.removeAllListeners("EventReminder",);
        console.log("Listener Removed.")
    }


    storeToDB = () => {

        this.listToStore = this.inTOSDRVendorList.concat(this.unknownVendorList);

        fetch(config.backend_endpoint + '/users/' + this.userIDFromHome + '/scan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.listToStore)
        }).then(r =>  {
            console.log("Stored to Database")
            this.props.navigation.navigate('HomeScreen');
            this.setState({scanComplete:true})
        });


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
        fetch(config.backend_endpoint + '/vendorReferenceSheet')
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

                console.log('Devices that are in the TOSDR database');
                console.log('--------------------------------------')
                for(const items of this.inTOSDRVendorList){
                    console.log(JSON.stringify(items));
                }

                console.log('Devices that are NOT in the TOSDR database');
                console.log('--------------------------------------')
                for(const items of this.unknownVendorList){
                    console.log(JSON.stringify(items));
                }

                this.tosdrCheckForGrade();
            })
            .catch((error) => {
                console.log(error);
            });
    }


    sendInfoToNLP = async(url, docType, tosdrData, vendor, itemIndex) =>{
        console.log("Sending info to NLP...Waiting For grade...");
        this.setState({checkingNLP:true});
        const response = await fetch(config.backend_endpoint + '/sendToNLP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                docType: docType
            })
        })
        const json = await response.json();
        const amountOfReviews = 8;
        var reviews = [];
        var points = tosdrData.points;
        var device = null;
        console.log("Recieved grade from NLP for " + vendor + " with grade of " + json.grade);
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


        this.inTOSDRVendorList[itemIndex].addGradeReviews(json.grade, reviews);
        return(
            console.log("Items added to list")
        );

    }


    fetchTOSDRInfo = async(vendor, itemIndex) => {
        const amountOfReviews = 8;
        var reviews = [];
        var device = null;
        var dataError = false;
        console.log("We are currently fetching information from TOSDR for ", vendor);

        if (vendor === 'Ring LLC') {
            vendor = '2700';
        }

        const response = await fetch("https://tosdr.org/api/1/service/" + vendor + ".json")
        const data = await response.json();
        try {
            if (data.class) {
                var points = data.points;
                console.log("It has a grade of " + data.class);
                try {
                    const newPointsArray = points.slice(0, amountOfReviews);

                    for (var items in newPointsArray) {

                        reviews.push(new Reviews(data.pointsData[newPointsArray[items]].id, data.pointsData[newPointsArray[items]].title, data.pointsData[newPointsArray[items]].tosdr.case,
                            data.pointsData[newPointsArray[items]].tosdr.point, data.pointsData[newPointsArray[items]].tosdr.score, data.pointsData[newPointsArray[items]].tosdr.tldr));
                    }
                } catch (TypeError) {
                    console.log("Oh well item no found");
                }
                if (itemIndex || itemIndex === 0) {
                    this.inTOSDRVendorList[itemIndex].addGradeReviews(data.class, reviews);
                    return(
                        console.log("Items added to list")
                    );
                } else {
                    device = new ScanResults(null, null);
                    device.addGradeReviews(data.class, reviews);
                    device.addTOSDRVendor(vendor);
                    return(
                        device
                    );
                }

            } else if (data.error) {
                console.log(data);
                dataError = true;

            } else if (!data.class && !dataError) {

                console.log("Uh Oh! No grade for ", vendor);
                console.log("We are retrieving their Privacy Policy and TOS from TOSDR....");
                var url;
                var docType;
                if(vendor === 'amazon'){
                    url = 'https://www.amazon.com/gp/help/customer/display.html/ref=sxts_snpl_4_1_0dcbd4ef-f1c1-45ec-9038-c0e812b07c72?pf_rd_p=0dcbd4ef-f1c1-45ec-9038-c0e812b07c72&pf_rd_r=5HJQ212GH7YH67D4CQ0G&pd_rd_wg=EVQvB&pd_rd_w=m1GXk&nodeId=468496&qid=1617245401&pd_rd_r=3c63f541-91d1-4b15-938e-8e1a4d140684';

                }
                if (data.links) {
                    for (var key in data.links) {
                        if (key === 'Privacy Policy') {
                            url = data.links[key].url;
                            docType = key;
                            console.log(data.links[key].url);
                            break;
                        } else if (key === 'Terms of Service') {
                            url = data.links[key].url;
                            docType = key;
                            console.log(data.links[key].url);
                            break;
                        } else if (key === 'Terms of Use') {
                            url = data.links[key].url;
                            docType = key;
                            console.log(data.links[key].url);
                            break;
                        }
                        else if (key === 'Privacy Policy ') {
                            url = data.links[key].url;
                            docType = key;
                            console.log(data.links[key].url);
                            break;
                        }
                    }


                    const response = await this.sendInfoToNLP(url, docType, data, vendor, itemIndex)
                    return(
                        response
                    );
                }

            }
        } catch (error) {
            console.log(error);
        }

    }



    tosdrCheckForGrade = async () => {
        console.log("Checking TOSDR API....");
        var stringToCheck = "Ring LLC"
        const amountOfReviews = 8;

        for(const [index,result] of this.inTOSDRVendorList.entries()){
            const response = await this.fetchTOSDRInfo(result.tosdr_vendor, index)
        }


        console.log("Scan Complete!!!!");
        this.storeToDB();

    }

    search = () => {
        ///This function was supposed to pull from database but its a small list and decided it would be better
        ///to store the string instead of hitting the database everytime someone wants to search.
        ///Leaving here for the future if we need to update list.
        /*
        fetch(URL + '/vendorReferenceSheet')
            .then(res => res.json())
            .then(res => {
                for(const item of res){
                    //console.log(item.tosdr_vendor);
                    this.searchList.push(item.tosdr_vendor);
                }
                var quotedAndCommaSeparated = "'" + this.searchList.join("','") + "'";
                console.log(quotedAndCommaSeparated);
            })
            .catch((error) => {
                console.log(error);
            });

         */
        console.log("Search Function...")
    }



    searchButton = () => {
        console.log("User search for Samsung....");
        this.fetchTOSDRInfo("amazon", null);
    }

    unknownVendorButton = (url, doctype, vendor, product) => {
        var testURL = 'https://www.hpe.com/us/en/legal/privacy.html#privacystatement';
        var docType = 'TOS';
        var vendor = "Hewlett-Packard Company";
        console.log("User submitted an unknown vendor request with the following information \n");
        console.log("Url: " , testURL, '\n');
        console.log("Document Type: ", docType, '\n');
        console.log("Company Name: ", vendor, '\n');
        this.sendInfoToNLP(testURL,docType, null, vendor, null, true);
    }



    render() {



        return (

            <View style = { styles.container }>

                <Text style = { styles.header }> Scan </Text>
                <Text>
                    Currently Loading ... One moment...</Text>

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