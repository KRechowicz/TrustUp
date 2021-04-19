import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Alert, Text } from "react-native";

function HomeButton (props) {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Details')}>
        <Text style={styles.img}>TrustUp</Text>

        {/*<Image*/}
        {/*    source={require('../images/TrustUp.png')}*/}
        {/*    style={styles.img}*/}
        {/*      //uri: "/Users/russellmoore/Documents/GitHub/CoVA_CCI/Root Development/Wifi/TrustUp/src/assets/images/TrustUp.png" ,static: true}}*/}
        {/*    resizeMode={'cover'} // cover or contain its upto you view look*/}
        {/*    />*/}
      </TouchableOpacity>
    </View>
  );
};

export default HomeButton;

const styles = StyleSheet.create({
  img: {
    width: 141,
    height: 71,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 15,
    marginTop: 52,
    marginLeft: 116,
    fontSize:30,
    padding: 15,
  },
});


// import React, { Component } from "react";
// import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
//
// function HomeButton(props) {
//   return (
//     <TouchableOpacity style={[styles.container, props.style]}
//                       onPress={()=>{alert("Going Home")}}>
//       <Image source={require('../assets/images/TrustUp.png')}  style={styles.img}/>
//     </TouchableOpacity>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex:0.15
//   },
//
//   caption: {
//     color: "#fff",
//     fontSize: 17
//   },
//   img: {
//     width: 141,
//     height: 71,
//     borderWidth: 1,
//     borderColor: "#000000",
//     borderRadius: 15,
//     marginTop: 52,
//     marginLeft: 116
//   }
// });
//
// export default HomeButton;
