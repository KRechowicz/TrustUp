import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { Appbar, TextInput, Subheading, Button, RadioButton, DefaultTheme, Provider as PaperProvider } from 'react-native-paper'


const SCREENSIZE = Dimensions.get('screen');
const config = require('../config');
var userID = 'B';

// var url = 'https://www.hpe.com/us/en/legal/privacy.html#privacystatement';
// var vendor = "Hewlett-Packard Company";
// var docType = 'TOS';

export default class App extends Component {
    companyName: ""
    url: null
    displayURL: null
    SearchList = ['Sony','paypal','spotify','pure','netflix','apple','microsoft','vk','yahoo','icloud','ask','hulu','signal','pocket','nvidia','bitdefender','sync','medium','brave','huawei','xiaomi','facebook','adobe','Element','amazon','Cisco','google','Rumble','slack','bitdefender','tosdr_vendor','symantec','service','sprint','virgin','cnet','bing','quake','multiple','lorea','onlive','king','cox','rac','enjin','none','uber','ello','mega','wix','looki','toggle','vero','identica','fitbit','taco','centurylink','jawbone','nokia','npr','flow','tmobile','path','revolut','Current','restream','canary','verizon','vive','bethesda','razer','drop','comcast','Reuters','bit','nsa','visions','chip','genius','emp','nrc','dudle','alza','shadow','baidu','inspire','target','nintendo','aol','vox','notion','garmin','waterfall','chase','honey','myspace','forbes','niche','gmx','hq','ixl','finn','leo','nexon','leet','minds','brilliant','gab','Trakt','yr','parsec','yase','icann','anki','grab','geco','akamai','chegg','bose','deepl','alpha','wired','dra','sophos','overleaf','byte','ebird','intercom','August Home','etsy','Nebula','xing','sony','visible','discovery','[spamtobedeleted]','adafruit','loom','xero','mla','whirlpool','matrix','pandora','oculus','yandex','ebay','mimo','samsung','petco','wire','adk','Logitech','Briar','Lenovo','Asus','Netgear','Sony','Motorola','Linksys','Belkin','TomTom','LYKA','Sweet','ADT','Ring LLC','Vice','Dash','Unity','Affirm','LogMeIn','amazon'];
    // productName: "";

    constructor(props) {
        super(props);
        this.state = {
            /*
            vendor: {
                url: null,
                displayURL: null
                // TOS: "",
            },
             */
        };
    }


    async searchForResults() {
        const query = this.companyName + " " + "Privacy Policy";


        this.getSearchResult(query) //TOS: this.getSearchResult(querySecond) } } )

    }

    render() {
        return (
            <PaperProvider theme={theme}>
                <>
                    <View style={styles.innerBody}>
                        <Subheading>
                            Add a company to your list. Fill in the field below and tap submit to process the companies privacy information.
                        </Subheading>

                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            placeholder="Example: Apple"
                            // onChangeText={(text) => {this.setState({companyName: text})}}
                            onChangeText={(text) => {this.companyName = text}}
                            accessible={true}
                            accessibilityLabel="Enter company name."
                            screenReaderEnable={true}
                        />

                        <Button style={styles.button} mode="contained" onPress={ () => this.props.navigation.navigate('UnknownVendorDisplayScreen',
                            {companyName: this.companyName})}
                                accessible={true}
                                accessibilityLabel="Submit to process your company's privacy information."
                                screenReaderEnable={true}>
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
        //position: 'absolute',
        flex: 0.4,
        paddingVertical: SCREENSIZE.height * .05,
        paddingHorizontal: SCREENSIZE.width * .05,
        justifyContent: 'space-between'
    },
    input:{
        margin: 4,
    },
    button:{
        margin: 4,
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

