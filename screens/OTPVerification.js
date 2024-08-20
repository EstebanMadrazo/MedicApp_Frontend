import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { OtpInput } from "react-native-otp-entry";
import Button from "../components/Button";
import axios from 'axios';

const OTPVerification = ({ route, navigation }) => {
  const [time, setTime] = useState(50);
  const [code, setCode] = useState()
  const { account} = route.params

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleCode = async()=> {
    const data = {account: account, code:code}
    console.log(data)
    try{
       await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/recoverCode`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         data:data, 
       })
       navigation.navigate("CreateNewPassword", {data: data}) 
       }catch(e){
         Alert.alert('Error','El código no coincide.')
         console.log(e)
       } 
   };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Recuperar Contraseña"/>
        <ScrollView>
          <Text style={[styles.title, {
            color: COLORS.black
          }]}>Digita el c&oacute;digo que se envi&oacute; a tu correo</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setCode(text)}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={1000}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: COLORS.secondaryWhite,
                borderColor: COLORS.secondaryWhite,
                borderWidth: .4,
                borderRadius: 10,
                height: 58,
                width: 58,
              },
              pinCodeTextStyle: {
                color: COLORS.black,
              }
            }}
          />
          {/* <View style={styles.codeContainer}>
            <Text style={[styles.code, {
              color: COLORS.greyscale900
            }]}>Resend code in</Text>
            <Text style={styles.time}>{`  ${time}  `}</Text>
            <Text style={[styles.code, {
              color: COLORS.greyscale900
            }]}>s</Text>
          </View> */}
        </ScrollView>
        <Button
          title="Verificar"
          filled
          style={styles.button}
          onPress={handleCode}
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white
  },
  title: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 54
  },
  OTPStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.secondaryWhite,
    borderBottomColor: "gray",
    borderBottomWidth: .4,
    borderWidth: .4,
    borderColor: "gray"
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center"
  },
  code: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    textAlign: "center"
  },
  time: {
    fontFamily: "medium",
    fontSize: 18,
    color: COLORS.primary
  },
  button: {
    borderRadius: 32
  }
})

export default OTPVerification