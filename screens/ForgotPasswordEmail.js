import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images, illustrations } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import axios from "axios";

const isTestMode = true;

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
    },
    inputValidities: {
        email: false
    },
    formIsValid: false,
}

const ForgotPasswordEmail = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [error, setError] = useState(null);
    const [isChecked, setChecked] = useState(false);
    const [account, setAccount] = useState()

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
            setAccount(inputValue)
        },
        [dispatchFormState]
    )

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error)
        }
    }, [error])

    const handleReset = async() => {
        const data = {account: account}
        console.log(data)
        if(formState.inputValidities['email'] !== undefined){
            return
        }
      try{
          await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/recoverPassword`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            data: data, 
          })
            //setOption(1)
            navigation.navigate("OTPVerification", {account: account})
          }catch(e){
            setError('El usuario no se encuentra en la base de datos.')
            setTimeout(() => {
              setError('')
            }, 4000);
          } 
    
      };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Recuperar Contraseña" />
                <ScrollView  showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={illustrations.password}
                            resizeMode='contain'
                            style={styles.password}
                        />
                    </View>
                    <Text style={[styles.title, {
                        color: COLORS.black
                    }]}>Ingresa tu Email</Text>
                    <Input
                        id="email"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholder="Email"
                        placeholderTextColor={COLORS.black}
                        icon={icons.email}
                        keyboardType="email-address"
                        value={account}
                    />
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={isChecked ? COLORS.primary : "gray"}
                                onValueChange={setChecked}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.privacy, {
                                    color: COLORS.black
                                }]}>Recuerdame</Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        title="Recuperar Contraseña"
                        filled
                        onPress={handleReset}
                        style={styles.button}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.forgotPasswordBtnText}>¿Recuerdas tu contraseña?</Text>
                    </TouchableOpacity>
                    <View>
                    </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <Text style={[styles.bottomLeft, {
                        color: COLORS.black
                    }]}>¿No tienes una cuenta?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Signup")}>
                        <Text style={styles.bottomRight}>{"  "}Regístrate</Text>
                    </TouchableOpacity>
                </View>
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
    logo: {
        width: 150,
        height: 150,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 32
    },
    title: {
        fontSize: 28,
        fontFamily: "bold",
        color: COLORS.black,
        textAlign: "center"
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontFamily: "semiBold",
        color: COLORS.black,
        textAlign: "center",
        marginBottom: 22
    },
    checkBoxContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    checkbox: {
        marginRight: 8,
        height: 16,
        width: 16,
        borderRadius: 4,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    privacy: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.black,
    },
    socialTitle: {
        fontSize: 19.25,
        fontFamily: "medium",
        color: COLORS.black,
        textAlign: "center",
        marginVertical: 26
    },
    socialBtnContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 18,
        position:"absolute",
        bottom: 12,
        right: 0,
        left: 0,
    },
    bottomLeft: {
        fontSize: 16,
        fontFamily: "regular",
        color: "black"
    },
    bottomRight: {
        fontSize: 18,
        fontFamily: "medium",
        color: COLORS.primary
    },
    button: {
        marginVertical: 6,
        width: SIZES.width - 32,
        borderRadius: 30
    },
    forgotPasswordBtnText: {
        fontSize: 18,
        fontFamily: "semiBold",
        color: COLORS.primary,
        textAlign: "center",
        marginTop: 12
    }
})

export default ForgotPasswordEmail