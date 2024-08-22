import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
//import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import AsyncStorage from "@react-native-async-storage/async-storage";
//import SocialButton from '../components/SocialButton';
//import OrSeparator from '../components/OrSeparator';
import { Buffer } from 'buffer'
import { useSession } from "../ctx";
import { Controller, useForm, SubmitHandler, FieldValues } from "react-hook-form";

const isTestMode = true;
const initialState = {
  inputValues: {
    email: isTestMode ? 'example@gmail.com' : '',
    password: isTestMode ? '**********' : '',
  },
  inputValidities: {
    email: false,
    password: false
  },
  formIsValid: false,
}

const Login = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [account, setAccount] = useState()
  const [password, setPassword] = useState()
  const [isDisabled, setIsDisabled] = useState(false)
  const { signIn } = useSession();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({ inputId, validationResult: result, inputValue })

      //console.log("RESULT: ", result)

      if (inputId === 'email') {
        setAccount(inputValue);
      } else if (inputId === 'password') {
        setPassword(inputValue);
      }

    },
    [dispatchFormState]
  );

  const handleLogin = () => {
    setIsDisabled(true)
    const data = {account: account, password:password}
    //send the request
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Buffer.from('test:pwd', 'utf8').toString('base64'),
      },
      body: JSON.stringify({ data:data }),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData.error) {
          Alert.alert('Error', responseData.error)
          console.log("ERROR:",responseData.error)
          setIsDisabled(false)
        } else {
          try {
            console.log("RESPONSE DATA: ", responseData)
            await AsyncStorage.setItem('tokens', JSON.stringify(responseData.refreshToken))
            //recuerda que cambie patientInfo por userInfo
            await AsyncStorage.setItem('userInfo', JSON.stringify(responseData))
          } catch (e) { console.log("CATCH: ",e) }
          signIn(responseData.token);
          console.log("Response Token: ",responseData.token)
          console.log(responseData)
          if (responseData?.userRole == 'Medic') {
            console.log("Is first login: ", responseData.firstLogin )
            if(responseData.firstLogin === 1){
              //setFirstLogin(true)
              //setUUID(responseData?.uuid)
              Alert.alert("Alerta", "Por favor cree su horario de citas para poder acceder a su cuenta")
              navigation.navigate("ScheduleRegister")
              setIsDisabled(false)
            }else{
              //router.push({ pathname: "/(appMedic)/(tabs)/Home"});
              navigation.navigate("Main")
            }
            
            //router.push({ pathname: "/(appMedic)/(tabs)/Home", params: { firstLogin: responseData.firstLogin } });
          } else { 
            //router.push({ pathname: "/(app)/(tabs)/Home", params: { uuid: responseData.uuid } }); 
            navigation.navigate("Main")
          }/* if(expoPushToken){
            //await handleExpoPushToken(responseData.uuid)
          } */
        }
      })
      .catch((error) => { console.log(error) }
      );
  };

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error]);

  useEffect(() =>{
    //checkAndRedirectToHome()
  },[])

  // Implementing apple authentication
  const appleAuthHandler = () => {
    console.log("Apple Authentication")
  };

  // Implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log("Facebook Authentication")
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log("Google Authentication")
  };

  return (
    <SafeAreaView style={[styles.area, {
      backgroundColor: COLORS.white
    }]}>
      <View style={[styles.container, {
        backgroundColor: COLORS.white
      }]}>
        {/* <Header /> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={styles.logo}
            />
          </View>
          <Text style={[styles.title, {
            color: COLORS.black
          }]}>Acceder a su cuenta</Text>
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
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
            value={password}
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
                }]}>Recordarme</Text>
              </View>
            </View>
          </View>
            <Button
              title="Login"
              filled={!isDisabled}
              onPress={() => handleLogin()}
              style={styles.button}
              disabled = {isDisabled}
              isLoading = {isDisabled}
            />
            <View style={styles.bottomContainer}>
              <Text style={[styles.bottomLeft, {
                color: COLORS.black
              }]}>¿ No tienes una cuenta ?</Text>
              <Button
                title="Regístrate"
                filled
                onPress={() => navigation.navigate("Signup")}
                color="#C70039"
                style={styles.buttonRegister}
              />
            </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPasswordEmail")}>
            <Text style={styles.forgotPasswordBtnText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          {/* <View>

            <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                onPress={appleAuthHandler}
                tintColor={COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={facebookAuthHandler}
              />
              <SocialButton
                icon={icons.google}
                onPress={googleAuthHandler}
              />
            </View>
          </View> */}
        </ScrollView>
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
    width: 200,
    height: 200,
    /* tintColor: COLORS.primary */
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'center',
    marginVertical: 18,
    /* position: "absolute",
    bottom: 12,
    right: 0,
    left: 0, */
  },
  bottomLeft: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.primary,
    marginBottom:5,
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30
  },
  buttonRegister: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
    borderColor: "#C70039"
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12
  }
})

export default Login