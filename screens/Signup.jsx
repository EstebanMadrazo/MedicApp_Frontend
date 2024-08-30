import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images, FONTS } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import { Dropdown } from "react-native-element-dropdown";
//import SocialButton from '../components/SocialButton';
//import OrSeparator from '../components/OrSeparator';
import DatePickerModal from '../components/DatePickerModal';
import { getFormatedDate } from "react-native-modern-datepicker";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import estados from '../data/estado.json'
import axios from "axios";
import PatientQ from '../components/questionnaires/PatientQ';
import MedicQ from '../components/questionnaires/MedicQ';
import RepQ from '../components/questionnaires/RepQ';
import { Link } from '@react-navigation/native';
import {
  Controller,
  useForm,
  SubmitErrorHandler,
  SubmitHandler,
  FieldValues,
  useFieldArray,
} from "react-hook-form";

/* const isTestMode = true;

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
} */



const Signup = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  const startDate = getFormatedDate(today, "YYYY/MM/DD")
  const [selectedDate, setSelectedDate] = useState(startDate)
  const [isFocus, setIsFocus] = useState(false);
  const [userType, setUserType] = useState();
  const [uuid, setUuid] = useState()
  const [products, setProducts] = useState([]);
  const [profilePicture, setProfilePicture] = useState();
  const [profTitle, setProfTitle] = useState();
  const [profID, setProfID] = useState();
  
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  
  const sex = [
    {value:'Femenino'},
    {value:'Masculino'},
  ]

  //Disabled Register Button
  const [isLoading, setIsLoading] = useState(false)

  const data = [
    { label: "Médico", value: "Medic" },
    { label: "Paciente", value: "Patient" },
    { label: "Representante Médico", value: "Representative" },
  ];


  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const passwordValue = watch("password");

  const handleSelectedRole = (role, onChange) => {
    onChange;

    if (role === "Patient") {
      setUserType(0);
    } else if (role === "Medic") {
      setUserType(1);
    } else if (role === "Representative") {
      setUserType(2);
    }
  };

  const handleRegister = async(data) => {
    setIsLoading(true)
    if (!isChecked) {
      Alert.alert(
        "Error",
        "Debes aceptar los términos y condiciones de uso para registrarte."
      );
      setIsLoading(false)
      return
    }

    let {
      state,
      sex,
      phoneNumber,
      firstName,
      lastName,
      role,
      email,
      password,
      birthDate,
      ...rest
    } = data;

    birthDate = data.birthDate.replace(/\//g, '-');
    //user base data
    const userData = {
      state,
      sex,
      phoneNumber,
      firstName,
      lastName,
      role,
      email,
      password,
      birthDate,
    };

    let uuid
    if(userType == 1 && (!profID || !profTitle || !profilePicture)){
      Alert.alert("Error","Debe de enviar todos los archivos que se solicitan")
      setIsLoading(false)
      return
    }
    try{
      const resp = await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
         data: userData, 
        })
        uuid = resp.data.uuid
        setUuid(uuid)
      }catch(e){
        Alert.alert("Error", "El telefono o el correo ya estan registrados")
        setIsLoading(false)
        return
      }

    console.log("userData", userData);
    //remove repeatPassword from data and create questionnaire object
    let questionnaireAnswers;
    const { repeatPassword, ...questionnaire } = rest;
    questionnaireAnswers = { ...questionnaire };
    // @ts-ignore 

    if (questionnaire.smoker) {
      //@ts-ignore
      const { products, ...questionnaire } = questionnaireAnswers;
      questionnaireAnswers = {...questionnaire}
       try{
        const resp = await axios(`${process.env.EXPO_PUBLIC_GATEWAY_API_URL}/user/register/patient`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
           data: {patientQ:questionnaireAnswers, profilePicture:'Avatars/Default/Default.png' ,uuid }, 
          })
          if (resp.data.message === 'Patient Created'){
            Alert.alert('Estatus', 'Creaste un nuevo usuario paciente')
            navigation.goBack()
          }
        }catch(e){
          console.log(e.response.data.message)
        }
        setIsLoading(false)  
        return
    } else if (questionnaire.company) {
      setValue("products", products);
      try{
        const resp = await axios(`${process.env.EXPO_PUBLIC_GATEWAY_API_URL}/user/register/representative`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          //@ts-ignore
           data: {productCatalog:questionnaire.products, laboratory:questionnaire.company, profilePicture:'Avatars/Default/Default.png', uuid}, 
          })
          navigation.goBack()
        }catch(e){
          //@ts-ignore4
          console.log(e.response.data.message)
          Alert.alert("Error", e.response.data.message)
        }  
        setIsLoading(false)
        return
    }
    await uploadFiles([profID, profTitle, profilePicture], uuid);
    console.log("Renderizado")
    Alert.alert(
      'Estatus', 
      'Creaste un nuevo usuario y mandaste tus documentos para ser admitido como medico exitosamente' +
       '\n espere la confirmacion en su correo',
    )
    await sendEmail(uuid)
    setIsLoading(false)
    navigation.goBack()
  };

  const sleep = async (seconds) => {
    return new Promise((resolve) => {setTimeout(resolve, seconds * 1000)})
  }

  const uploadFiles = async (files, uuid) => {
    setIsLoading(true)
    console.log(uuid)
     for (let i = 0; i < files.length; i++) {
      await sleep(2)
      try{
       const resp =  await axios(`${process.env.EXPO_PUBLIC_GATEWAY_API_URL}/user/uploadDocuments`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          params:{
            uuid:uuid
          },
           data: files[i]
          })
          console.log("RESP ", resp)
        }catch(e){
          console.log(e.response)
          setIsLoading(false)
        }
      //formData.append(`documents`, files[i] as any, files[i]?.name + files[i]?.type );
    }
  };

  const sendEmail = async (uuid) => {
    try {
      const response = await axios(`${process.env.EXPO_PUBLIC_GATEWAY_API_URL}/user/sendMedicDocuments`,{
          method: "POST",
          params:{
            uuid:uuid
          }
        })
        console.log("Response: ", response)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  //error handler
  const onError = (errors, e) => {
    return console.log(errors);
  };


  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error])

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
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title={'Regístrate en Premed'}/>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginBottom:50}}>
          {/* <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={styles.logo}
            />
          </View>
          <Text style={[styles.title, {
            color: COLORS.dark2
          }]}>Regístrate en Premed</Text> */}
          
          <Controller
              control={control}
              rules={{
                required:'Campo obligatorio',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Input
                    onInputChanged={(id,text) => onChange(text)}
                    errorText={errors.firstName?.message}
                    autoCapitalize="none"
                    id="fistName"
                    placeholder="Nombre(s)"
                    placeholderTextColor={COLORS.black}
                    icon={icons.addUser}
                    onBlur={onBlur}
                    value={value}
                    //secureTextEntry={true}
                  />
                </>
              )}
              name="firstName"
          />
          <Controller
              control={control}
              rules={{
                required:'Campo obligatorio',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Input
                    onInputChanged={(id,text) => onChange(text)}
                    errorText={errors.lastName?.message}
                    autoCapitalize="none"
                    id="familyName"
                    placeholder="Apellidos"
                    placeholderTextColor={COLORS.black}
                    icon={icons.addUser}
                    onBlur={onBlur}
                    value={value}
                    //secureTextEntry={true}
                  />
                </>
              )}
              name="lastName"
          />
          
          <Controller
                control={control}
                rules={{
                  required: 'Campo obligatorio',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View style={{
                      width: SIZES.width - 32
                    }}>
                      <TouchableOpacity
                        style={[styles.inputBtn, {
                          backgroundColor: COLORS.greyscale500,
                          borderColor: COLORS.greyscale500,
                        }]}
                        onPress={() => setIsVisible(true)}
                      >
                        <View style={{flexDirection: "row",}}>
                          <Ionicons name="calendar" size={24} color={'#BCBCBC'} />
                          <Text style={{ ...FONTS.body4, color: COLORS.black, marginLeft:15 }}>Fecha de Nacimiento:</Text>
                        </View>
                        <Text style={{ ...FONTS.body4, color: COLORS.black }}>{selectedDate}</Text>
                      </TouchableOpacity>
                    </View>

                    
                    {errors.birthDate && (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                          {errors.birthDate?.message}
                        </Text>
                      </View>
                    )}
                    <DatePickerModal 
                      open={isVisible}
                      limitDate={startDate}
                      onClose={() => { setIsVisible(false); } }
                      onChangeStartDate={(value) => { onChange(value), setSelectedDate(value), setIsVisible(false) } }
                      selectedDate={startDate} startDate={undefined}                    
                      />
                  </>
                )}
                name="birthDate"
              />
              <Controller
                control={control}
                rules={{
                required:'Campo obligatorio',
                maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                  <Dropdown
                    style={[
                      styles.inputBtn,
                    ]}
                    placeholderStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    selectedTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    data={sex}
                    itemContainerStyle={styles.inputContainer}
                    containerStyle={styles.inputContainer}
                    itemTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    maxHeight={300}
                    labelField="value"
                    valueField="value"
                    placeholder={!isFocus ? 'Sexo' : "Sexo sin seleccionar"}
                    activeColor={COLORS.grayscale400}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={onBlur}
                    onChange={(value) => {
                        onChange(value.value)
                        console.log(value)
                    }}
                    renderLeftIcon={() => (
                      <MaterialCommunityIcons style={{marginRight:15}} name="gender-male-female" size={24} color="#BCBCBC" />
                    )}
                  />
                  {
                    errors.sex && <Text style={styles.errorText}>{errors.sex.message}</Text>
                  }
                  </>     
                )}
                name="sex"
              />
              <Controller
                control={control}
                rules={{
                required:'Campo obligatorio',
                maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                  <Dropdown
                    style={[
                      styles.inputBtn,
                    ]}
                    placeholderStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    selectedTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    data={estados}
                    itemContainerStyle={styles.inputContainer}
                    containerStyle={styles.inputContainer}
                    itemTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    maxHeight={300}
                    labelField="name"
                    valueField="name"
                    placeholder={!isFocus ? 'Estado' : "Estado sin seleccionar"}
                    activeColor={COLORS.grayscale400}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={onBlur}
                    onChange={(value) => {
                        onChange(value.name)
                        console.log(value)
                    }}
                    renderLeftIcon={() => (
                      <Ionicons style={{marginRight:15}} name="location" size={24} color="#BCBCBC"/>
                    )}
                  />
                  {
                    errors.state && <Text style={styles.errorText}>{errors.state.message}</Text>
                  }
                  </>     
                )}
                name="state"
              />
              <Controller
                control={control}
                rules={{
                  required:'Campo obligatorio',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Solo se aceptan numeros'
                  },
                  maxLength:{
                    value: 10, 
                    message:'El numero debe contener 10 digitos'
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      onInputChanged={(id, text) => {
                        console.log(text)
                        const trimmedValue = text.slice(0, 10);
                        const numericValue = trimmedValue.replace(/[^0-9]/g, '');
                        onChange(numericValue)
                      }}
                      errorText={errors.lastName?.message}
                      autoCapitalize="none"
                      id="phoneNumber"
                      placeholder="Teléfono"
                      placeholderTextColor={COLORS.black}
                      icon={icons.telephone}
                      onBlur={onBlur}
                      textContentType="telephoneNumber"
                      inputMode="tel"
                      value={value}
                    />
                  </>
                )}
                name="phoneNumber"
              />
              <Controller
                control={control}
                rules={{
                  required:'Campo obligatorio',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      id="email"
                      onInputChanged={(id, text) =>onChange(text)}
                      errorText={errors.email?.message}
                      placeholder="Correo electrónico"
                      placeholderTextColor={COLORS.black}
                      icon={icons.email}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="email-address"
                    />
                  </>
                )}
                name="email"
              />
              <Controller
                control={control}
                rules={{
                  required: 'Campo obligatorio',
                  maxLength: 100,
                  minLength:{
                    value:6,
                    message: 'La contraseña debe tener al menos 6 digitos'
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      onInputChanged={(id, text)=> onChange(text)}
                      errorText={errors.password?.message}
                      autoCapitalize="none"
                      id="password"
                      onBlur={onBlur}
                      placeholder="Contraseña"
                      value={value}
                      placeholderTextColor={COLORS.black}
                      icon={icons.padlock}
                      secureTextEntry={true}
                    />
                  </>
                )}
                name="password"
              />
              <Controller
                control={control}
                rules={{
                  required: 'Campo obligatorio',
                  maxLength: 100,
                  minLength:{
                    value:6,
                    message: 'La contraseña debe tener al menos 6 digitos'
                  },
                  validate: (value) =>
                    value === passwordValue || "Las contraseñas no coinciden",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      onInputChanged={(id, text)=> onChange(text)}
                      errorText={errors.repeatPassword?.message}
                      autoCapitalize="none"
                      id="repeatPassword"
                      onBlur={onBlur}
                      placeholder="Repetir contraseña"
                      value={value}
                      placeholderTextColor={COLORS.black}
                      icon={icons.padlock}
                      secureTextEntry={true}
                    />
                  </>
                )}
                name="repeatPassword"
              />
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                  required:'Campo obligatorio',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                  <Dropdown
                    style={[
                      styles.inputBtn
                    ]}
                    placeholderStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    selectedTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    data={data}
                    itemContainerStyle={styles.inputContainer}
                    containerStyle={styles.inputContainer}
                    itemTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "¿Cual es tu Rol?" : "Rol sin seleccionar"}
                    activeColor={COLORS.grayscale400}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={onBlur}
                    onChange={(selectedItem) => {
                      handleSelectedRole(
                        selectedItem.value,
                        onChange(selectedItem.value)
                      );
                    }}
                    renderLeftIcon={() => (
                      <Ionicons
                        name="person-circle-outline"
                        color="#BCBCBC"
                        size={24}
                        style={{marginRight:15}}
                      />
                    )}
                  />
                  {errors.role && (
                    //@ts-ignore
                    <Text style={styles.errorText}>{errors.role.message}</Text>
                  )}
                  </>
                )}
                name="role"
              />
              {/* additional form for patient user */}
              {userType === 0 && (
                <PatientQ
                  form={{
                    handleSubmit,
                    control,
                    watch,
                    errors,
                  }}
                  styles={styles}
                ></PatientQ>
              )}
              {/* additional form for patient user */}
              {userType === 1 && (
                <MedicQ
                  form={{
                    handleSubmit,
                    control,
                    watch,
                    errors,
                    setValue,
                    fields,
                    append,
                    remove,
                  }}
                  docs={{
                    setProfID,
                    setProfTitle,
                    setProfilePicture,
                  }}
                  styles={styles}
                />
              )}
              {/* additional form for patient user */}
              {userType === 2 && (
                <RepQ
                  form={{
                    handleSubmit,
                    control,
                    watch,
                    errors,
                    setValue,
                    fields,
                    append,
                    remove,
                  }}
                  styles={styles}
                />
              )}  
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.bottomLeft, {
                  color: COLORS.black
                }]}>
                  Al continuar, acepta nuestros 
                  <Link to={{screen: 'TaC'}} style={{color:COLORS.primary}}>
                     Términos y condiciones de uso
                  </Link>
                </Text>
              </View>
            </View>
          </View>
          <Button
            title="Registrarse"
            filled
            onPress={handleSubmit(handleRegister)}
            style={styles.button}
            disabled={!isChecked}
            color={!isChecked? COLORS.greyscale300 : COLORS.primary}
            isLoading={isLoading}
          />
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
          </View>
        </ScrollView>
        {/* <View style={styles.bottomContainer}>
          <Text style={[styles.bottomLeft, {
            color: COLORS.black
          }]}>Already have an account ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.bottomRight}>{" "}Sign In</Text>
          </TouchableOpacity>
        </View> */}
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
    backgroundColor: COLORS.white,
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
  /* title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center"
  }, */
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "bold",
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
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.black
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
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 52,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    backgroundColor: COLORS.greyscale500,
  },
})

export default Signup