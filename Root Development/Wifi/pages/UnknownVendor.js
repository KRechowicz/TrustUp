import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { Appbar, TextInput, Subheading, Button, RadioButton, DefaultTheme, Provider as PaperProvider } from 'react-native-paper'


const SCREENSIZE = Dimensions.get('screen');
const config = require('../config');
var userID = 'B';
var url = 'https://www.hpe.com/us/en/legal/privacy.html#privacystatement';
var vendor = "Hewlett-Packard Company";
var docType = 'TOS';





export default class App extends Component {
    companyName: "";
    productName: "";

    constructor(props) {
        super(props);
        this.state = {
            vendor: {
                PP: "Placeholder",
                TOS: "Placeholder",
            },
        };
    }

    getSearchResult = (query) => {
        fetch(config.backend_endpoint + '/getSearch', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
            })
        }).then(res => {
            res.json().then((data) => {
                this.props.navigation.navigate('UnknownVendorDisplayScreen', {vendor:query, docType: docType, url:data.url})
            })
        }).catch(function(error){
            console.log('request failed', error)
        })

    }

    render() {
        return (
            /*
            <View style={styles.container}>
                <View style={styles.appBody}>
                    <View style={styles.innerBody}>
                        <View style={styles.contentBox}>
                            <Text>Header</Text>
                        </View>
                        <View style={{ ...styles.contentBox, flex: .4 }}>
                            <TextInput
                                style={styles.boxes}
                                value={"value"}
                                />
                            <TextInput
                                style={styles.boxes}
                                value={"value"}
                            />
                            <TextInput
                                style={styles.boxes}
                                value={"value"}
                            />
                    </View>
                    <View style={styles.contentBox}>
                        <Text>Some text here</Text>
                    </View>
                        <Button
                            title="Go to Unknown Page"
                            onPress={ () => this.props.navigation.navigate('UnknownVendorDisplayScreen', {userID:userID, vendor:vendor, docType: docType, url:url})}
                        />
                </View>
            </View>
        <View style={styles.appFooter}>
        </View>
    </View >
     */
            <PaperProvider theme={theme}>
                <>
                    <View style={styles.innerBody}>
                        <Subheading>
                            Add a device that wasn't listed. Fill in the fields below and hit submit to process it.
                        </Subheading>

                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Company"
                            placeholder="Example: Apple"
                            // onChangeText={(text) => {this.setState({companyName: text})}}
                            onChangeText={(text) => {this.companyName = text}}
                        />

                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Product Name"
                            placeholder="Example: iPhone 12 Pro"
                            onChangeText={(text) => {this.setState({productName: text})}}
                        />

                        <Button style={styles.button} mode="contained" onPress={ () => this.getSearchResult("Apple Privacy Policy")}>
                            submit
                        </Button>
                    </View>
                </>
            </PaperProvider>
        )
    }
}

const styles = StyleSheet.create({
    innerBody: {
        //alignItems: 'center',
        flex: 0.5,
        //position: 'absolute',
        paddingVertical: SCREENSIZE.height * .05,
        paddingHorizontal: SCREENSIZE.width * .05,
        justifyContent: 'space-between'
    },
    input:{
        margin: 4
    },
    button:{
        margin: 4
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

    /*
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.appBody}>
                    <View style={styles.innerBody}>
                        <View style={styles.contentBox}>
                            <Text>Header</Text>
                        </View>
                        <View style={{ ...styles.contentBox, flex: .4 }}>
                            <TextInput
                                style={styles.boxes}
                                value={"value"}
                                />
                            <TextInput
                                style={styles.boxes}
                                value={"value"}
                            />
                            <TextInput
                                style={styles.boxes}
                                value={"value"}
                            />
                    </View>
                    <View style={styles.contentBox}>
                        <Text>Some text here</Text>
                    </View>
                        <Button
                            title="Go to Unknown Page"
                            onPress={() => {getSearchResult("Apple Privacy Policy"), this.props.navigation.navigate('UnknownVendorDisplayScreen', {vendor:vendor, docType: docType, url:url })}}
                        />
                </View>
            </View>
        <View style={styles.appFooter}>
        </View>
    </View >
    )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffa9aa',
    },
    appBody: {
        flex: .78,
    },
    innerBody: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: SCREENSIZE.height * .08,
        paddingHorizontal: SCREENSIZE.width * .2,
        justifyContent: 'space-between'
    },
    appFooter: {
        flex: .22,
        backgroundColor: 'white'
    },
    contentBox: {
        backgroundColor: 'white',
        width: SCREENSIZE.width * .8,
        flex: .2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxes: {
        width: SCREENSIZE.width * .4,
        height: 40,
        borderColor: 'gray',
        borderWidth:1,
        alignContent: 'center',
    },
})

     */