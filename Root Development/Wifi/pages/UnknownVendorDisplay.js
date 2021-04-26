import * as React from 'react';
import {
    Appbar,
    Subheading,
    Button,
    DefaultTheme,
    List,
    Text,
    Provider as PaperProvider,
    ActivityIndicator
} from 'react-native-paper'
import {StyleSheet, View, Dimensions, Linking, Alert} from "react-native";

import { FAB } from 'react-native-paper';
import Reviews from "../Objects/Reviews";
import ScanResults from "../Objects/ScanResult";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Component, useEffect} from "react";

const SCREENSIZE = Dimensions.get('screen');

const config = require('../config');

const tosdrlist = require('../Objects/tosdrlist.json');

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

const addDevice = async (device) => {
    const getID = await getData();
    const response = await fetch(config.backend_endpoint + "/users/" + getID + "/scan/addDevice", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(device)
    });

    return response;
}

const fetchTOSDRInfo = async(vendor) => {
    const amountOfReviews = 12;
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
            var url;
            var docType;
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
            if(vendor === 'amazon'){
                url = 'https://www.amazon.com/gp/help/customer/display.html/ref=sxts_snpl_4_1_0dcbd4ef-f1c1-45ec-9038-c0e812b07c72?pf_rd_p=0dcbd4ef-f1c1-45ec-9038-c0e812b07c72&pf_rd_r=5HJQ212GH7YH67D4CQ0G&pd_rd_wg=EVQvB&pd_rd_w=m1GXk&nodeId=468496&qid=1617245401&pd_rd_r=3c63f541-91d1-4b15-938e-8e1a4d140684';
                docType = "Privacy Policy"
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

            }

            device = new ScanResults(null, null);
            device.addDocInfo(docType, url);
            device.addGradeReviews(data.class, reviews);
            device.addTOSDRVendor(vendor);
            return(
                device
            );


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
                docType = "Privacy Policy"

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

                device = new ScanResults(null, null);
                device.addDocInfo(docType, url);
                device.addTOSDRVendor(vendor);
                return(
                    device
                );
            }

        }
    } catch (error) {
        console.log(error);
    }

}

export default class UnknownVendorDisplay extends Component{
    SearchList = ['Sony','paypal','spotify','pure','netflix','apple','microsoft','vk','yahoo','icloud','ask','hulu','signal','pocket','nvidia','bitdefender','sync','medium','brave','huawei','xiaomi','facebook','adobe','Element','amazon','Cisco','google','Rumble','slack','bitdefender','tosdr_vendor','symantec','service','sprint','virgin','cnet','bing','quake','multiple','lorea','onlive','king','cox','rac','enjin','none','uber','ello','mega','wix','looki','toggle','vero','identica','fitbit','taco','centurylink','jawbone','nokia','npr','flow','tmobile','path','revolut','Current','restream','canary','verizon','vive','bethesda','razer','drop','comcast','Reuters','bit','nsa','visions','chip','genius','emp','nrc','dudle','alza','shadow','baidu','inspire','target','nintendo','aol','vox','notion','garmin','waterfall','chase','honey','myspace','forbes','niche','gmx','hq','ixl','finn','leo','nexon','leet','minds','brilliant','gab','Trakt','yr','parsec','yase','icann','anki','grab','geco','akamai','chegg','bose','deepl','alpha','wired','dra','sophos','overleaf','byte','ebird','intercom','August Home','etsy','Nebula','xing','sony','visible','discovery','[spamtobedeleted]','adafruit','loom','xero','mla','whirlpool','matrix','pandora','oculus','yandex','ebay','mimo','samsung','petco','wire','adk','Logitech','Briar','Lenovo','Asus','Netgear','Sony','Motorola','Linksys','Belkin','TomTom','LYKA','Sweet','ADT','Ring LLC','Vice','Dash','Unity','Affirm','LogMeIn','amazon'];
    userIDFromHome = null;
    companyName

    constructor(props) {
        super(props);
        this.state = {
            isWorking:true
        };
    }

    async componentDidMount() {
        const getID = await getData();
        console.log(getID);
        this.userIDFromHome = getID;

        this.companyName = this.props.route.params.companyName;

        this.props.navigation.addListener('beforeRemove', (e) => {
            if (!this.state.isWorking) {
                // If we don't have unsaved changes, then we don't need to do anything
                return;
            }

            e.preventDefault();

            Alert.alert(
                'Go back?',
                'We are currently gathering information about the company. If you leave now, all data will be lost. ',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Leave',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => this.props.navigation.dispatch(e.data.action),
                    },
                ]
            );
        })


        console.log(this.companyName);
        //await this.getAllServices();
        this.startCheck(this.companyName);
    }


    // const vendorObject = JSON.parse(vendor);


    startCheck = async (company) => {
        const searchResult = this.searchFilterFunction(company);
        let deviceResult;
        console.log(searchResult[0]);
        if(searchResult[0]){
            const result = await fetchTOSDRInfo(searchResult[0].slug);
            console.log(result);
            if(!result.grade && result.docURL){
                const nlpResult = await this.sendInfoToNLP(result.docURL);
                result.addGradeReviews(nlpResult, null);

            }
            result.getVendor(company);

            deviceResult = result;

        }
        else{
            const device = new ScanResults(null, null);
            const result = await this.getSearchResult(company);
            device.addDocInfo("Privacy Policy", result.url);
            const nlpResult =  await this.sendInfoToNLP(result.url);
            console.log(nlpResult)
            device.addGradeReviews(nlpResult, null);
            device.getVendor(company);

            deviceResult = device;
        }

        const addedResponse = await addDevice(deviceResult);

        if(addedResponse.status === 200){
            this.setState({isWorking:false});
            this.props.navigation.navigate('HomeScreen');
        }
         else {
            this.setState({isWorking:false});
            Alert.alert(
                "Error",
                "We could not add the device to your list.",
                [
                    {text: "OK", onPress: () => this.props.navigation.navigate('HomeScreen')}
                ]
            );
        }


    }


    getAllServices = async () => {
        /*
        const response = await fetch('https://api.tosdr.org/all-services/v1/')
        const data = await response.json();
        var list = [];
        for(const item of data.parameters.services){
            list.push({name: item.name, slug: item.slug})
        }
        console.log(list);


         */

        for(const items of tosdrlist){
            console.log(items);
        }
        //console.log(tosdrlist);
    }


    searchFilterFunction = (vendorToSearch) => {
        const vendorSearch = vendorToSearch.trim();
        // Check if searched text is not blank
        if (vendorSearch) {
            const result = tosdrlist.filter((vendor) => {
                const dataToCheck = vendor.name.toUpperCase();
                const companyToCheck = vendorSearch.toUpperCase();
                return dataToCheck.indexOf(companyToCheck) > -1;
            });
            return result;
        }else{
            return null;
        }
    };

    getSearchResult = async (query) => {
        const queryToSearch = query + 'Privacy Policy';
        const response = await fetch(config.backend_endpoint + '/getSearch', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: queryToSearch,
            })
        })
        const json = await response.json();
        console.log(json);
        return json;
    }


    sendInfoToNLP = async(url) => {
        console.log("Sending info to NLP...Waiting For grade...");
        const response = await fetch(config.backend_endpoint + '/sendToNLP', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                docType: "Privacy Policy"
            })
        })
        const data = await response.json();
        return data.grade;
    }


    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" theme = {theme}/>
                <Subheading>
                    Checking our database. One moment.
                </Subheading>
            </View>

        );
    }


}

/*
<Text style={styles.link}>
    {vendor.TOS}
</Text>
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    innerBody: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .02,
        paddingHorizontal: SCREENSIZE.width * .05
    },
    /*
    subheading:{
        fontSize: 20
    },
    */
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .01,
        paddingHorizontal: SCREENSIZE.width * .05
    },
    button: {
        margin: 4
    },
    link: {
        paddingVertical: SCREENSIZE.height * .02,
        paddingHorizontal: SCREENSIZE.width * .05,
        margin: 3,
        fontSize: 18,
        color: '#0060a9'
    }
});

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0060a9',
        accent: '#f3cd1f',
    },
};

