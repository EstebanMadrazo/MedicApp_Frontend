import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useState } from "react";
  
  const InvertedButton = ({ ...props }) => {
    const [pressed, setPressed] = useState<boolean>(false);
    return (
      <Pressable
        onPressIn={() => {
          props.action();
          setPressed(true);
        }}
        onPressOut={() => setPressed(false)}
        style={pressed ? styles.invButtonInverted : styles.buttonInverted}
      >
        {props.loading ? (
          <ActivityIndicator size="small" color="#7cad3e" />
        ) : (
          <Text
            style={
              pressed ? styles.invButtonTextInverted : styles.buttonTextInverted
            }
          >
            {props.text}
          </Text>
        )}
      </Pressable>
    );
  };
  
  const styles = StyleSheet.create({
    buttonInverted: {
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: "white",
      borderColor: "#005AC1",
      marginVertical: 15,
      width:"100%"
    },
    invButtonInverted: {
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: "#005AC1",
      borderColor: "white",
      marginVertical: 15,
      width:"100%"
    },
    buttonTextInverted: {
      fontFamily: "pop-sb",
      fontSize: 14,
      color: "#005AC1",
    },
    invButtonTextInverted: {
      fontFamily: "pop-sb",
      fontSize: 14,
      color: "white",
    },
  });
  
  export default InvertedButton;
  