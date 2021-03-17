import * as React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { FAB } from 'react-native-paper';

const MyComponent = () => (
    <View>
        <View style={styles.box1}>
            <Text style={styles.textStyle}>Box 1</Text>
        </View>
        <View style={styles.box2}>
            <Text style={styles.textStyle}>Box 2</Text>
        </View>
        <View style={styles.box3}>
            <Text style={styles.textStyle}>Box 3</Text>
        </View>
        <Image
            style={styles.logo}
            source={require('../Images/TrustUPLogo.png')}
        />

    </View>

);

const styles = StyleSheet.create({
    container: {
        paddingTop: 200,
        flex: 1,
        flexDirection: 'row',
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

export default MyComponent;