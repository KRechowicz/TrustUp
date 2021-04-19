
import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, View, Image, Text } from "react-native";
import WifiScanButton from "../components/WifiScanButton";
import HomeButton from "../components/HomeButton.js";
import SearchBar from "../components/SearchBar";
import ModalButton from "../components/ModalButton";
import HomeScreen from "../components/navigation"

function Home(props) {
  return (
    <View style={styles.container}>
      {/*<Image*/}
      {/*  source={require("../assets/images/TrustUp.png")}*/}
      {/*  resizeMode="contain"*/}
      {/*  style={styles.image}*/}
      {/*></Image>*/}

        <HomeButton/>

      <Text style={styles.scanForMyDevices}></Text>
      <Text style={styles.companyGrade}>Company - Grade</Text>
      <View style={styles.cupertinoButtonInfo2Row}>
        <WifiScanButton
          style={styles.cupertinoButtonInfo2}
        ></WifiScanButton>
        <SearchBar
          style={styles.cupertinoSearchBarWithMic1}
        ></SearchBar>
      </View>
      <ModalButton
        style={styles.cupertinoButtonWhiteTextColor}
      ></ModalButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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

export default Home;
