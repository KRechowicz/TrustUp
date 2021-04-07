import * as React from 'react';
import {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ListView,
    FlatList,
    SafeAreaView,
    ScrollView,
    TextInput,
    Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { FAB, DefaultTheme, Provider as PaperProvider, Button, DataTable, List } from 'react-native-paper';
import {SearchBar, ListItem, Icon} from "react-native-elements";

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

const deleteDevice = async (userID, ip, index) => {
    console.log("WHAT the fuck", userID);
    const response = await fetch(config.backend_endpoint + "/users/" + userID + "/scan/deleteDevice", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ip: ip, index:index})
    });
    //console.log(response.json());
}

const addDevice = async (userID, device) => {
    const response = await fetch(config.backend_endpoint + "/users/" + userID + "/scan/addDevice", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(device)
    });
    //console.log(response.json());
}



class HomeScreen extends Component{
    SearchList = ['Sony','paypal','spotify','pure','netflix','apple','microsoft','vk','yahoo','icloud','ask','hulu','signal','pocket','nvidia','bitdefender','sync','medium','brave','huawei','xiaomi','facebook','adobe','Element','amazon','Cisco','google','Rumble','slack','bitdefender','tosdr_vendor','symantec','service','sprint','virgin','cnet','bing','quake','multiple','lorea','onlive','king','cox','rac','enjin','none','uber','ello','mega','wix','looki','toggle','vero','identica','fitbit','taco','centurylink','jawbone','nokia','npr','flow','tmobile','path','revolut','Current','restream','canary','verizon','vive','bethesda','razer','drop','comcast','Reuters','bit','nsa','visions','chip','genius','emp','nrc','dudle','alza','shadow','baidu','inspire','target','nintendo','aol','vox','notion','garmin','waterfall','chase','honey','myspace','forbes','niche','gmx','hq','ixl','finn','leo','nexon','leet','minds','brilliant','gab','Trakt','yr','parsec','yase','icann','anki','grab','geco','akamai','chegg','bose','deepl','alpha','wired','dra','sophos','overleaf','byte','ebird','intercom','August Home','etsy','Nebula','xing','sony','visible','discovery','[spamtobedeleted]','adafruit','loom','xero','mla','whirlpool','matrix','pandora','oculus','yandex','ebay','mimo','samsung','petco','wire','adk','Logitech','Briar','Lenovo','Asus','Netgear','Sony','Motorola','Linksys','Belkin','TomTom','LYKA','Sweet','ADT','Ring LLC','Vice','Dash','Unity','Affirm','LogMeIn','amazon'];
    //deviceList:[];


    constructor(props) {
        super(props);
        this.state = {
            userID:null,
            searchText: "",
            selectedId: -1,
            data: [],
            filteredData: [],
            deviceList:[

                {

                    "grade": "E",

                    "ip": "192.168.0.6",

                    "lastScanned": "2021-4-5/13:38",

                    "mac": "B0:2A:43:69:AC:A8",

                    "reviews": [

                        {

                            "case": "This service uses your personal information for many different purposes",

                            "id": 12829,

                            "point": "bad",

                            "score": 40,

                            "title": "This service uses your personal information for many different purposes",

                            "tldr": "List (summarized):\r\n\"We use the information we collect from all our services for the following purposes: Provide our services[...] Maintain &amp. improve our services[...] Develop new services[...] Provide personalized services, including content and ads[...] Communicate with you[...]\""

                        },

                        {

                            "case": "There is a date of the last update of the agreements",

                            "id": 856,

                            "point": "neutral",

                            "score": 50,

                            "title": "There is a date of the last update of the terms",

                            "tldr": ""

                        },

                        {

                            "case": "Private messages can be read",

                            "id": 13935,

                            "point": "bad",

                            "score": 70,

                            "title": "The service can read your private emails",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "The service provides details about what kinds of personal information they collect",

                            "id": 13934,

                            "point": "good",

                            "score": 30,

                            "title": "The service provides details about what kinds of personal information they collect",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "The service reviews its privacy policy on a regular basis",

                            "id": 13938,

                            "point": "good",

                            "score": 30,

                            "title": "The service reviews its privacy policy on a regular basis",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "A complaint mechanism is provided for the handling of personal data",

                            "id": 13940,

                            "point": "good",

                            "score": 30,

                            "title": "The service provides a complaint mechanism for the handling of personal data",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "You have the right to leave this service at any time",

                            "id": 13956,

                            "point": "good",

                            "score": 15,

                            "title": "You have the right to leave this service at any time",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "This service provides archives of their Terms of Service so that changes can be viewed over time",

                            "id": 950,

                            "point": "good",

                            "score": 50,

                            "title": "Partial archives of their terms are available",

                            "tldr": "At http://www.google.com/intl/en/policies/terms/archive/ you can see at least one previous versions of Google's terms"

                        }

                    ],

                    "tosdr_vendor": "google",

                    "wifi_vendor": "Google Inc."

                },

                {

                    "grade": "E",

                    "ip": "192.168.0.199",

                    "lastScanned": "2021-4-5/13:38",

                    "mac": "1C:F2:9A:47:14:96",

                    "reviews": [

                        {

                            "case": "This service uses your personal information for many different purposes",

                            "id": 12829,

                            "point": "bad",

                            "score": 40,

                            "title": "This service uses your personal information for many different purposes",

                            "tldr": "List (summarized):\r\n\"We use the information we collect from all our services for the following purposes: Provide our services[...] Maintain &amp. improve our services[...] Develop new services[...] Provide personalized services, including content and ads[...] Communicate with you[...]\""

                        },

                        {

                            "case": "There is a date of the last update of the agreements",

                            "id": 856,

                            "point": "neutral",

                            "score": 50,

                            "title": "There is a date of the last update of the terms",

                            "tldr": ""

                        },

                        {

                            "case": "Private messages can be read",

                            "id": 13935,

                            "point": "bad",

                            "score": 70,

                            "title": "The service can read your private emails",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "The service provides details about what kinds of personal information they collect",

                            "id": 13934,

                            "point": "good",

                            "score": 30,

                            "title": "The service provides details about what kinds of personal information they collect",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "The service reviews its privacy policy on a regular basis",

                            "id": 13938,

                            "point": "good",

                            "score": 30,

                            "title": "The service reviews its privacy policy on a regular basis",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "A complaint mechanism is provided for the handling of personal data",

                            "id": 13940,

                            "point": "good",

                            "score": 30,

                            "title": "The service provides a complaint mechanism for the handling of personal data",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "You have the right to leave this service at any time",

                            "id": 13956,

                            "point": "good",

                            "score": 15,

                            "title": "You have the right to leave this service at any time",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "This service provides archives of their Terms of Service so that changes can be viewed over time",

                            "id": 950,

                            "point": "good",

                            "score": 50,

                            "title": "Partial archives of their terms are available",

                            "tldr": "At http://www.google.com/intl/en/policies/terms/archive/ you can see at least one previous versions of Google's terms"

                        }

                    ],

                    "tosdr_vendor": "google",

                    "wifi_vendor": "Google Inc."

                },

                {

                    "grade": "E",

                    "ip": "192.168.0.160",

                    "lastScanned": "2021-4-5/13:38",

                    "mac": "88:E9:FE:3C:9C:9C",

                    "reviews": [

                        {

                            "case": "This service keeps a license on user-generated content even after users close their accounts.",

                            "id": 16636,

                            "point": "bad",

                            "score": 50,

                            "title": "This service keeps a license on user-generated content even after users close their accounts.",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "You can opt out of targeted advertising",

                            "id": 2094,

                            "point": "good",

                            "score": 25,

                            "title": "Apple provides an opt-out method for Apple targeted advertising",

                            "tldr": "Apple provides an opt-out method for Apple targeted advertising"

                        },

                        {

                            "case": "Your data may be processed and stored anywhere in the world",

                            "id": 11299,

                            "point": "bad",

                            "score": 25,

                            "title": "Your data may be processed and stored anywhere in the world",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "The service may change its terms at any time, but the user will receive notification of the changes.",

                            "id": 10287,

                            "point": "neutral",

                            "score": 0,

                            "title": "The service may change its terms at any time, but the user will receive notification of the changes.",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "Blocking first party cookies may limit your ability to use the service",

                            "id": 11300,

                            "point": "neutral",

                            "score": 50,

                            "title": "Blocking first party cookies may limit your ability to use the service",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "This service may use your personal information for marketing purposes",

                            "id": 11298,

                            "point": "bad",

                            "score": 50,

                            "title": "This service may use your personal information for marketing purposes",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "This service shares your personal data with third parties that are not involved in its operation",

                            "id": 11717,

                            "point": "bad",

                            "score": 70,

                            "title": "This service can share your personal information to third parties ",

                            "tldr": "Generated through the annotate view"

                        },

                        {

                            "case": "The service can delete specific content without reason and may do it without prior notice",

                            "id": 11301,

                            "point": "blocker",

                            "score": 50,

                            "title": "The service can delete specific content without reason and may do it without prior notice",

                            "tldr": "Generated through the annotate view"

                        }

                    ],

                    "tosdr_vendor": "apple",

                    "wifi_vendor": "Apple"

                },

                {

                    "ip": "192.168.0.1",

                    "lastScanned": "2021-4-5/13:38",

                    "mac": "70:03:7E:F0:32:02",

                    "tosdr_vendor": "Not in Database",

                    "wifi_vendor": "Technicolor CH USA Inc."

                },

                {

                    "ip": "192.168.0.63",

                    "lastScanned": "2021-4-5/13:38",

                    "mac": "1A:44:6B:FD:76:1E",

                    "tosdr_vendor": "Not in Database",

                    "wifi_vendor": "Unknown Vendor"

                },

                {

                    "ip": "192.168.0.151",

                    "lastScanned": "2021-4-5/13:38",

                    "mac": "02:CB:00:F2:B4:42",

                    "tosdr_vendor": "Not in Database",

                    "wifi_vendor": "Unknown Vendor"

                },

                {

                    "ip": "192.168.0.157",

                    "lastScanned": "2021-4-5/13:38",

                    "mac": "F4:30:B9:BD:61:10",

                    "tosdr_vendor": "Not in Database",

                    "wifi_vendor": "Hewlett-Packard Company"

                },

                {

                    "ip": "192.168.0.189",

                    "lastScanned": "2021-4-5/13:39",

                    "mac": "D4:9E:3B:7B:77:78",

                    "tosdr_vendor": "Not in Database",

                    "wifi_vendor": "Guangzhou Shiyuan Electronic Technology Company Limited"

                }

            ],
        }

    }

    async componentDidMount() {

        const getUser = await getData();
        this.setState({userID:getUser});

        // Need to call this twice because focus listener is not called on initial mount for some reason
        const list = [];
        console.log(this.state.userID);
        if(this.state.userID){
            const response = await fetch(config.backend_endpoint + "/users/" + this.state.userID + "/scan");
            const json = await response.json();
            try{
                for(const items of json){
                    list.push(items);
                }
            }
            catch{
                if(!json.error){
                    console.log("No devices currently in database");
                }

            }

            this.setState({deviceList:list});

            //console.log(this.deviceList);
        }


        const listener = await this.props.navigation.addListener('focus', async() => {
            const list = [];
            console.log(this.state.userID);
            if(this.state.userID){
                const response = await fetch(config.backend_endpoint + "/users/" + this.state.userID + "/scan");
                const json = await response.json();
                try{
                    for(const items of json){
                        list.push(items);
                    }
                }
                catch{
                    if(!json.error){
                        console.log("No devices currently in database");
                    }

                }

                this.setState({deviceList:list});
            }


        })

        console.log(this.state.deviceList);
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus');
        console.log('Removed');
    }
    alertItemName = (item) => {
        alert(item.grade)
    }
    search = (searchText) => {
        this.setState({searchText: searchText});

        let filteredData = this.state.data.filter(function (item) {
            return item.SearchList.includes(searchText);
        });

        this.setState({filteredData: filteredData});
    };


    renderItem = ({ item, index }) => {
        let isGrade = true;
        let isManuallyAdded = false;

        if(!item.grade){
            isGrade = false;
        }

        if(item.ip === "Manually Added"){
            isManuallyAdded = true;
        }
        return(
            <DataTable.Row onPress={() => this.props.navigation.navigate('DeviceModal', {item: item, index: index})}>
                <DataTable.Cell>
                    { isManuallyAdded ? item.tosdr_vendor: item.wifi_vendor}
                </DataTable.Cell>

                <DataTable.Cell>
                    {isGrade? item.grade : "Unknown"}
                </DataTable.Cell>
            </DataTable.Row>
        );
    }

    /*
                <FlatList
                data={this.state.deviceList}
                keyExtractor= {(item, index) => index.toString()}
                renderItem={this.renderItem}
                />

                 <List.Item
                    title={ isManuallyAdded ? "Vendor Name: " + item.tosdr_vendor: "Vendor Name: " + item.wifi_vendor}
                    description={isGrade? "Grade : "+ item.grade : "Grade : Unknown"}
                    theme={styles.theme}
                />

                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Company</DataTable.Title>
                                <DataTable.Title>Grade</DataTable.Title>
                            </DataTable.Header>
                        </DataTable>

                        <IconButton
                           icon="wifi-plus"
                           color={DefaultTheme.primaryColor}
                           size={20}
                           onPress={() => console.log('Pressed')}
                       />
     */

    render(){
        return(
            <PaperProvider theme={theme}>
                        <View style={styles.container}>
                            {/*<TextInput placeholder="Search" style={{padding:5}}*/}
                            {/*           onChangeText={(name_address) => this.setState({name_address})}/>*/}
                            <View style={styles.information}>
                                <Icon name="information-outline" type="material-community" size={24} />
                                <Text style={styles.row}>Scan your network to identify connected devices </Text>
                            </View>

                            <Button style={styles.button} mode="contained" onPress={() => this.props.navigation.navigate('UnknownVendorScreen')}>
                                Grade Unknown Company
                            </Button>

                            <View style={styles.information}>
                                <Icon name="information-outline" type="material-community" size={24} />
                                <Text style={styles.row}>Each company is a device on your network, tap on a device for more information  </Text>
                            </View>

                            <View style={styles.listContainer}>
                                <DataTable.Header>
                                    <DataTable.Title style={styles.name}>Company</DataTable.Title>
                                    <DataTable.Title>Grade</DataTable.Title>
                                </DataTable.Header>
                                <FlatList
                                    data={this.state.deviceList}
                                    keyExtractor= {(item, index) => index.toString()}
                                    renderItem={this.renderItem}
                                />
                            </View>

                            <Button style={styles.button} mode="contained" onPress={() => this.props.navigation.navigate('ScanningScreen',{userID:this.userID})}>
                                Scan for my Devices
                            </Button>

                        </View>
            </PaperProvider>
/*
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={this.state.deviceList}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}

                />
            </SafeAreaView>



 */

            // <PaperProvider theme={theme}>
            //     <SafeAreaView style={styles.container}>
            //         <FlatList data={this.state.deviceList} renderItem={this.renderItem}
            //         />
            //
            //         <View style={styles.search}>
            //             <SearchBar
            //                 round={true}
            //                 lightTheme={true}
            //                 placeholder="Search for Devices..."
            //                 autoCapitalize='none'
            //                 autoCorrect={false}
            //                 onChangeText={this.search}
            //                 value={this.state.searchText}
            //                 style={styles.searchInput}
            //             />
            //             <FlatList
            //                 data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.state.data}
            //                 keyExtractor={(item) => `item-${item}`}
            //                 renderItem={({item}) => <searchList
            //                     id={item}
            //
            //                 />}
            //                 ItemSeparatorComponent={() => <View style={styles.separator}/>}
            //             />
            //         </View>
            //
            //         <Button mode="contained" onPress={() => this.props.navigation.navigate('ScanningScreen',{userID:this.userID})}
            //                 style = {styles.scanButton}
            //                 icon = 'camera'>
            //             <Text style = {styles.scanText}>
            //                 Scan for my Devices
            //             </Text>
            //         </Button>
            //         <Text style = {styles.homeText}>
            //             Your Devices:
            //         </Text>
            //
            //         <FlatList data={this.state.deviceList} renderItem={this.renderItem}
            //                   />
            //
            //         {/*{*/}
            //         {/*    this.state.deviceList.map((item, index) => (*/}
            //
            //         {/*        <Button*/}
            //         {/*            accessible={true}*/}
            //         {/*            accessibilityLabel="Go to device information screen"*/}
            //         {/*            accessibilityHint="Navigates to device information screen"*/}
            //         {/*            mode="contained"*/}
            //         {/*            key = {item.wifi_vendor}*/}
            //         {/*            //style = {styles.container}*/}
            //         {/*            onPress={() => this.props.navigation.navigate('DeviceModal')}*/}
            //         {/*            style = {styles.modalButton}>*/}
            //         {/*            <Text style = {styles.buttonText}>*/}
            //         {/*                {item.wifi_vendor}*/}
            //         {/*            </Text>*/}
            //         {/*        </Button>*/}
            //         {/*    ))*/}
            //         {/*}*/}
            //         <Button mode="contained" onPress={() => this.props.navigation.navigate('UnknownVendorScreen')} style = {styles.scanButton}>
            //             <Text style = {styles.scanText}>
            //                 Go to Unknown Page
            //             </Text>
            //         </Button>
            //     </SafeAreaView>
            // </PaperProvider>
            //
            // //     <Button
            // //         title="Go to Scanning Screen"
            // //         onPress={() => this.props.navigation.navigate('ScanningScreen',{userID:this.userID})}
            // //     />
            // //
            // //     <Button
            // //         title = "Go to Unknown Page"
            // //         onPress={() => this.props.navigation.navigate('UnknownVendorScreen')}
            // //     />
            // // </View>




        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0.2,
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .01,
        paddingHorizontal: SCREENSIZE.width * .05
    },
    paddingStyle:{
        padding: 5
    },
    listContainer: {
        height:SCREENSIZE.height * 0.55,
        paddingHorizontal: SCREENSIZE.width * .05,
        //flexGrow: 1,
        //padding: 5,
        margin: 5,
        backgroundColor: '#ffffff',
    },
    icon:{
        width:30,
        height:30,
    },
    iconBtnSearch:{
        alignSelf:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        marginLeft:15,
        justifyContent: 'center'
    },
    notificationList:{
        marginTop:20,
        padding:10,
    },
    card: {
        height:null,
        paddingTop:10,
        paddingBottom:10,
        marginTop:5,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        borderTopWidth:40,
        marginBottom:20,
    },
    cardContent:{
        flexDirection:'row',
        marginLeft:10,
    },
    imageContent:{
        marginTop:-40,
    },
    tagsContent:{
        marginTop:10,
        flexWrap:'wrap'
    },
    image:{
        width:60,
        height:60,
        borderRadius:30,
    },
    name:{
        fontSize:20,
        fontWeight: 'bold',
        marginLeft:10,
        alignSelf: 'center'
    },
    btnColor: {
        padding:10,
        borderRadius:40,
        marginHorizontal:3,
        backgroundColor: "#eee",
        marginTop:5,
    },
    button:{
        paddingHorizontal: SCREENSIZE.width * .05,
        margin: 3
    },
    row:{
        padding: 1
    },
    information: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .005,
    },
    divider:{
        padding: 1,
        margin: 2,
    },
});

const theme = {
    ...DefaultTheme,
    roundness: 2,
    fontSize:90,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0060a9',
        accent: '#f3cd1f',

    },
}

export default HomeScreen;
    /*

    alertItemName = (item) => {
        alert(item.grade)
    }

    render(){
        return(

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Button
                    title="Go to Scanning Screen"
                    onPress={() => this.props.navigation.navigate('ScanningScreen',{userID:this.userID})}
                />

                <Button
                    title = "Go to Unknown Page"
                    onPress={() => this.props.navigation.navigate('UnknownVendorScreen')}
                />
            </View>

        );

    }

}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 3,
        backgroundColor: '#d9f9b1',
        alignItems: 'center',
    },
    box1: {
        width: 75,
        height: 75,
        // Uncomment the following style to see flex effects
        //flex: 1,
        backgroundColor: 'steelblue'
    },
    box2: {
        width: 75,
        height: 75,
        // Uncomment the following style to see flex effects
        //flex: 2,
        backgroundColor: 'pink'
    },
    box3: {
        width: 75,
        height: 75,
        // Uncomment the following style to see flex effects
        //flex: 3,
        backgroundColor: 'orange'
    },
    textStyle: {
        color: 'black',
        alignSelf: 'center',
        margin: 25,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    logo: {
        width: 66,
        height: 58,
    },
})

export default HomeScreen;

     */
