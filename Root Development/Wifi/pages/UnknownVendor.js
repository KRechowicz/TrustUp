import React, { Component } from 'react';
import { Text, StyleSheet, View, Dimensions, TextInput } from 'react-native';

const SCREENSIZE = Dimensions.get('screen');

export default class App extends Component {
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