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
import {FAB, DefaultTheme, Provider as PaperProvider, Button, DataTable, List, Subheading, Paragraph, Divider} from 'react-native-paper';
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
            deviceList:[],
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
            if(json){
                for(const items of json){
                    list.push(items);
                }
            }
            else{
                if(json.error){
                    console.log("No devices currently in database");
                }

            }

            this.setState({deviceList:list});

            console.log(this.state.deviceList);
        }


        const listener = await this.props.navigation.addListener('focus', async() => {
            const list = [];
            console.log(this.state.userID);
            if(this.state.userID){
                const response = await fetch(config.backend_endpoint + "/users/" + this.state.userID + "/scan");
                const json = await response.json();
                if(json){
                    for(const items of json){
                        list.push(items);
                    }
                }
                else{
                    if(!json.error){
                        console.log("No devices currently in database");
                    }

                }

                this.setState({deviceList:list});
            }

            console.log(this.state.deviceList);

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

    renderEmptyContainer = () =>{
        return(
            <Subheading style={styles.paddingStyle}>
                No Companies in your List.
            </Subheading>
        );

    }


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

        <View accessible={true}
              screenReaderEnable={true}>
            <DataTable.Row style={styles.border} onPress={() => this.props.navigation.navigate('DeviceModal', {item: item, index: index})} accessible={false}>
                <DataTable.Cell accessible={false}>
                    { item.wifi_vendor}
                </DataTable.Cell>

                <DataTable.Cell accessible={false}>
                    {isGrade? item.grade : "Unknown"}
                </DataTable.Cell>
            </DataTable.Row>

        </View>

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
//ItemSeparatorComponent={Divider}
    render(){
        return(
            <PaperProvider theme={theme}>
                <View style={styles.container}>

                    <View style={styles.information} accessible={true}
                          accessibilityLabel="Tap the Add Company Button to add a company to your list.  "
                          screenReaderEnable={true}>
                        <Icon style={styles.row} name="information-outline" type="material-community" size={24} />
                        <Text style={styles.row}>Tap the Add Company Button to add a Company to your list.  </Text>
                    </View>
                    <View style={styles.information} accessible={true}
                          accessibilityLabel="Each item on the list is a company, tap on a company for more information  "
                          screenReaderEnable={true}>
                        <Icon name="information-outline" type="material-community" size={24} />
                        <Text style={styles.row}>Each company is a device on your network, tap on a device for more information  </Text>
                    </View>

                    <View style={styles.listContainer}>
                        <DataTable>
                            <DataTable.Header style={styles.border}
                                              accessible={true}
                                              accessibilityLabel="List of your Devices with Company name and Privacy Grade"
                                              accessibilityHint="This is a list of your devices. Press on a company to view its trust features."
                                              screenReaderEnable={true}>
                                <DataTable.Title accessible={false}><Paragraph>Company</Paragraph></DataTable.Title>
                                <DataTable.Title accessible={false}><Paragraph>Grade</Paragraph></DataTable.Title>
                            </DataTable.Header>

                            <FlatList
                                data={this.state.deviceList}
                                keyExtractor= {(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                ListEmptyComponent={this.renderEmptyContainer}
                            />
                        </DataTable>
                    </View>

                    <View style={styles.paddingStyle}>
                        <Button mode="contained"
                                onPress={() => this.props.navigation.navigate('UnknownVendorScreen')}
                                accessible={true}
                                accessibilityLabel="Add Company."
                                accessibilityHint="Navigates to Add Company Screen."
                                screenReaderEnable={true}
                        >
                            Add Company
                        </Button>
                    </View>
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
        paddingHorizontal: 3,
    },
    information: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: SCREENSIZE.height * .005,
        paddingHorizontal: SCREENSIZE.width * .0075
    },
    divider:{
        padding: 0.5,
        margin: 1,
        backgroundColor: '#000000'
    },
    border:{
        borderBottomColor: '#000000',
        borderStartColor: '#000000',
        borderEndColor: '#000000',
        borderStyle: 'solid',
        borderBottomWidth: 1
    }
});

const theme = {
    ...DefaultTheme,
    roundness: 2,
    fontSize:90,
    grey: '#000000',

    colors: {
        ...DefaultTheme.colors,
        primary: '#0060a9',
        accent: '#f3cd1f',
    },
    fonts:{
        fontSize: 'regular',
        fontColor: '#000000'
    }
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
