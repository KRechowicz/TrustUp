import * as React from 'react';
import {Image, View, Text, StyleSheet, Dimensions, FlatList, SafeAreaView, ScrollView} from "react-native";
import {
    DefaultTheme,
    Provider as PaperProvider,
    Button,
    Subheading,
    IconButton
} from "react-native-paper";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";


const config = require('../config');
const SCREENSIZE = Dimensions.get('screen');

const DeviceModal = ({ navigation, route }) => {

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
    /*
    const renderDialog = () => {
        setVisible(true)
        return(
            <Portal>
                <Dialog visible={visible} onDismiss={setVisible(false)}>
                    <Dialog.title>
                        Additional Information
                    </Dialog.title>
                    <Dialog.Content>
                        <View style={styles.information}>
                            <Text style={styles.row}>Company - This is the name of the company that either made or manages your device or its software.</Text>
                            <Text style={styles.row}>IP - This is an address assigned by your network for this device. Please note that this may change and can be different from the address seen from outside of your network.</Text>
                            <Text style={styles.row}>Mac address - Each device has a unique identifier which is different from any other device. This helps guarantee devices cannot pretend to be something else.</Text>
                            <View style={styles.grades}>
                                <Text style={styles.row}>Grades: </Text>
                                <Text style={styles.row}>A - The best terms of services: they treat the user fairly, respect their rights, and will not abuse their data.</Text>
                                <Text style={styles.row}>B - The terms of services are fair towards the user but they could be improved.</Text>
                                <Text style={styles.row}>C - The terms of service are okay but some issues need your consideration.</Text>
                                <Text style={styles.row}>D - The terms of service are very uneven or some important issues need the user's attention.</Text>
                                <Text style={styles.row}>E - The terms of service raise very serious concerns.</Text>
                                <Text style={styles.row}>No Grade - The terms have not been completely graded yet.</Text>
                            </View>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }
     */

    return (
        <PaperProvider theme={theme}>
            <ScrollView>
            <>
                <View style={styles.information}>
                    <Subheading style={styles.paddingStyle}
                                accessible={true}
                                screenReaderEnable={true}>
                        Company -
                        <Text style={styles.row}> This is the name of the company that either made or manages your device or its software.</Text>
                    </Subheading>
                    {/*<Text style={styles.row}>IP - This is an address assigned by your network for this device. Please note that this may change and can be different from the address seen from outside of your network.</Text>*/}
                    {/*<Text style={styles.row}>Mac address - Each device has a unique identifier which is different from any other device. This helps guarantee devices cannot pretend to be something else.</Text>*/}
                    <View style={styles.grades} accessible={true}
                          screenReaderEnable={true}>
                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            Grades:
                        </Subheading>
                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            A -
                        <Text style={styles.row}>The best terms of services: they treat the user fairly, respect their rights, and will not abuse their data.</Text>
                        </Subheading>
                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            B -
                            <Text style={styles.row}>The terms of services are fair towards the user but they could be improved.</Text>
                        </Subheading>
                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            C -
                            <Text style={styles.row}> The terms of service are okay but some issues need your consideration.</Text>
                        </Subheading>
                            <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            D -
                        <Text style={styles.row}>The terms of service are very uneven or some important issues need the user's attention.</Text>
                        </Subheading>
                            <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            E -
                        <Text style={styles.row}>The terms of service raise very serious concerns.</Text>
                            </Subheading>
                        <Subheading style={styles.paddingStyle}
                                    accessible={true}
                                    screenReaderEnable={true}>
                            No Grade -
                            <Text style={styles.row}>The terms have not been completely graded yet.</Text>
                        </Subheading>

                    </View>

                    <View style={styles.grades} accessible={true}
                          screenReaderEnable={true}>


                    <Subheading style={styles.paddingStyle}
                                accessible={true}
                                screenReaderEnable={true}>
                        Grade Calculation:
                    </Subheading>
                    <Text style={styles.row}>

                    <Text style={{fontStyle: "italic"}}>Terms of Service </Text>

                        <Text style={styles.row}>(ToS) and </Text>

                        <Text style={{fontStyle: "italic"}}>Privacy Policy  </Text>

                        <Text >(PP) documents are usually provided by the product’s company to explain the legal rights and responsibilities of the user and the product provider.</Text>

                        </Text>
                        <Text style={styles.row}>For each product, we check to see if there is a score for that ToS on Terms of Service: Didn’t Read website (ToS:DR). If the company’s policy documents are not available on ToS:DR, we use machine learning to find similar graded documents and calculate a new score for the product.</Text>

                            <Text style={styles.row}>Terms of Service Didn’t Read is a community project which aims to analyze and grade the ToS and PPs of major Internet sites and services. Each aspect of a ToS or PP is assessed as positive, negative, or neutral and contributes to the overall grade reported by the website.</Text>

                    </View>
                </View>
            </>
            </ScrollView>
        </PaperProvider>

    );
}

const styles = StyleSheet.create({
    paddingStyle:{
        padding: 4,
        margin: 4,
        fontWeight: "bold",
        fontSize: hp('1.7%')
    },
    row:{
        padding: 4,
        margin:4,
        fontWeight: "normal",
        fontSize: hp('1.7%')
    },
    information: {
        alignContent: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: SCREENSIZE.height * .025,
        paddingHorizontal: SCREENSIZE.width * .05
    },
    text:{
        padding: 1,
        margin: 1
    },
})

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#00589b',
        accent: '#f3cd1f',
    },
};


export default DeviceModal;
