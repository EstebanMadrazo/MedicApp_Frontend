import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useState } from "react";
  
  const RedButton = ({ ...props }) => {
    const [pressed, setPressed] = useState<boolean>(false);
    return (
      <Pressable
        onPressIn={() => {
          props.action();
          setPressed(true);
        }}
        onPressOut={() => setPressed(false)}
        style={pressed ? styles.releasedButton : styles.pressedButton}
      >
        {props.loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={pressed ? styles.invertedButtonText : styles.buttonText}>{props.text}</Text>
        )}
      </Pressable>
    );
  };
  
  const styles = StyleSheet.create({
    pressedButton: {
      alignItems: "center",
      justifyContent: "center",
      width: "85%",
      height: 50,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: "#900603",
      borderColor: "white",
      marginVertical: 10,
    },
    releasedButton: {
      alignItems: "center",
      justifyContent: "center",
      width: "85%",
      height: 50,
      borderWidth: 1,
      borderRadius: 50,
      backgroundColor: "white",
      borderColor: "#900603",
      marginVertical: 10,
    },
    buttonText: {
      fontFamily: "pop-sb",
      fontSize: 14,
      color: "white",
    },
    invertedButtonText: {
      fontFamily: "pop-sb",
      fontSize: 14,
      color: "#900603",
    },
  });
  
  export default RedButton;
  