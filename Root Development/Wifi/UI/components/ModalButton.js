import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function ModalButton(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}
                      onPress={()=>{alert("Apple - D\n\n" +
                        "The terms of service are very uneven or there are some important issues that need your attention.")}}>
      <Text style={styles.appleC}>Apple - D</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5
  },
  appleC: {
    color: "rgba(0,0,0,1)",
    fontSize: 20
  },
});

export default ModalButton;
