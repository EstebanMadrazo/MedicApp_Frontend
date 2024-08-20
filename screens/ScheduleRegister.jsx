import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images, FONTS } from '../constants';
import Header from '../components/Header';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const days = [
  {name:'Lunes',
  work:false},
  {name:'Martes',
  work:false},
  {name:'Miércoles',
  work:false},
  {name:'Jueves',
  work:false},
  {name:'Viernes',
  work:false},
  {name:'Sábado',
  work:false},
  {name:'Domingo',
  work:false},
]
const hrasMat=[
  {hra:'05'},
  {hra:'06'},
  {hra:'07'},
  {hra:'08'},
  {hra:'09'},
  {hra:'10'},
  {hra:'11'},
  {hra:'12'},
]
const hrasVesp=[
  {hra:'13'},
  {hra:'14'},
  {hra:'15'},
  {hra:'16'},
  {hra:'17'},
  {hra:'18'},
  {hra:'19'},
  {hra:'20'},
  {hra:'21'},
  {hra:'22'},
  {hra:'23'},
  {hra:'00'},
]
const duracionHra = [
  {hra:'00'},
  {hra:'01'},
  {hra:'02'},
  {hra:'03'},
]
const duracionMin = [
  {min:'00'},
  {min:'15'},
  {min:'30'},
  {min:'45'},
]
const limit = [
  {hra:'00'},
  {hra:'01'},
  {hra:'02'},
  {hra:'03'},
  {hra:'04'},
  {hra:'05'},
  {hra:'06'},
  {hra:'07'},
  {hra:'08'},
  {hra:'09'},
  {hra:'10'},
  {hra:'11'},
  {hra:'12'},
  {hra:'13'},
  {hra:'14'},
  {hra:'15'},
  {hra:'16'},
  {hra:'17'},
  {hra:'18'},
  {hra:'19'},
  {hra:'20'},
  {hra:'21'},
  {hra:'22'},
  {hra:'23'},
  {hra:'24'},
  {hra:'48'},
  {hra:'72'},
]



const ScheduleRegister = ({ navigation }) => {
  const [workDays, setWorkDays] = useState([])
    //console.log("Workdays: ", workDays)
    const [add, setAdd] = useState(false)
    const [isCheckedMat, setIsCheckedMat] = useState(false);
    const [isCheckedVesp, setIsCheckedVesp] = useState(false);
    const [isCheckedVideocall, setIsCheckedVideocall] = useState(false);
    const [isCheckedRep, setIsCheckedRep] = useState(false);
    const [price, setPrice] = useState('')  
    const [errorMat, setErrorMat] =  useState(false)
    const [errorVesp, setErrorVesp] =  useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [errorDuration, setErrorDuration] = useState('')
    const [Errors, setErrors]= useState({
        days:false,
        check:false,
        price:false,
        duration:false,
        limit:false
    })
    
    const [schedule,setSchedule] = useState({
        him:'',
        mim:'00',
        hfm:'',
        mfm:'00',
        hiv:'',
        miv:'00',
        hfv:'',
        mfv:'00',
        dh:'00',
        dm:'00',
        tlh:'00',
        tlm:'00'
    })

    useEffect(()=>{
        //setWorkDays([])
    },[])
          
    const addOrRemoveDays = (day) => {

        for(let item of  days){
            if(day == item.name){
                item.work = !item.work
            }
        }
        const index = workDays.indexOf(day);

        if (index !== -1) {
        const temp = [...workDays];
        temp.splice(index, 1);
        setWorkDays(temp);
        } else {
        const temp = [...workDays];
        temp.push(day);
        setWorkDays(temp);
        }            
    }

    const handleErrors = async () => {

        if(workDays.length == 0){
            setErrors(prevSchedule => ({
                ...prevSchedule,
                days: true
            }))
            return
        }else{
            setErrors(prevSchedule => ({
                ...prevSchedule,
                days: false
            }))
        }

        if(!isCheckedMat && !isCheckedVesp){
            setErrors(prevSchedule => ({
                ...prevSchedule,
                check: true
            }))
            return
        }else{
            setErrors(prevSchedule => ({
                ...prevSchedule,
                check: false
            }))
        }

        if(schedule.dh == '00' && schedule.dm == '00'){
            setErrors(prevSchedule => ({
                ...prevSchedule,
                duration: true
            }))
            return
        }
        else{
            setErrors(prevSchedule => ({
                ...prevSchedule,
                duration: false
            }))
        }

        if(schedule.tlh == '00' && schedule.tlm == '00'){
            setErrors(prevSchedule => ({
                ...prevSchedule,
                limit: true
            }))
            return
        }
        else{
            setErrors(prevSchedule => ({
                ...prevSchedule,
                limit: false
            }))
        }

        if(price == ''){
            setErrors(prevSchedule => ({
                ...prevSchedule,
                price: true
            }))
            return
        }else{
            setErrors(prevSchedule => ({
                ...prevSchedule,
                price: false
            }))
        }

       await handleSubmit()
    }

    const handleSubmit = async() => {
        setIsDisabled(true)
        const afternoon = []
        const morning = []
        
        if(isCheckedVesp){
            if(schedule.hiv !== '' && schedule.hfv !== ''){
                afternoon.push(`${schedule.hiv}:${schedule.miv}`, `${schedule.hfv}:${schedule.mfv}`)
                setErrorVesp(false)
            }else{
                console.log('check vesp')
                setErrorVesp(true)
                return
            }
        }
        if(isCheckedMat){
            if(schedule.him !== '' && schedule.hfm !== ''){
                morning.push(`${schedule.him}:${schedule.mim}`, `${schedule.hfm}:${schedule.mfm}`)
                setErrorMat(false)
            }else{
                console.log('check mat')
                setErrorMat(true)
                return
            }
        }

        const formattedPrice = parseFloat(price).toFixed(2);
  
        let Schedule
        if (morning.length === 0) {
            // Si la mañana está vacía, guardar solo la tarde
            Schedule = {
              shift: { afternoon },
              workDays,
              limitTime: `${schedule.tlh}:${schedule.tlm} hm`,
              duration: `${schedule.dh}:${schedule.dm} hm`,
              price: formattedPrice,
              is_videocall_allowed: isCheckedVideocall,
              is_rep_allowed: isCheckedRep,
            };
          } else if (afternoon.length === 0) {
            // Si la tarde está vacía, guardar solo la mañana
            Schedule = {
              shift: { morning },
              workDays,
              limitTime: `${schedule.tlh}:${schedule.tlm} hm`,
              duration: `${schedule.dh}:${schedule.dm} hm`,
              price: formattedPrice,
              is_videocall_allowed: isCheckedVideocall,
              is_rep_allowed: isCheckedRep,
            };
          } else {
            // Ambos turnos tienen horarios, guardar ambos
            Schedule = {
              shift: { morning, afternoon },
              workDays,
              limitTime: `${schedule.tlh}:${schedule.tlm} hm`,
              duration: `${schedule.dh}:${schedule.dm} hm`,
              price: formattedPrice,
              is_videocall_allowed: isCheckedVideocall,
              is_rep_allowed: isCheckedRep,
            };
          }
        const userInfo= JSON.parse(await AsyncStorage.getItem('userInfo')) 
        const uuid = userInfo.uuid
        try{
            const responseInfo = await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/createSchedule`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
               data:{
                uuid:uuid,               
                schedule:Schedule
                },
            })
            props.first("0")
            router.push("/(appMedic)/(tabs)/Home")
            console.log(responseInfo.data)
            setErrorDuration('')
            Alert.alert('Estatus','A creado su horario de citas')
            router.push({ pathname: "/(appMedic)/(tabs)/Home"})
          }catch(e){
            console.log(e.response.data)
            setErrorDuration(e.response.data.message)
            setIsDisabled(false)
            return
          }
    }

  
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title={'Registro de Horario\nMédico'}/>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginBottom:10, marginTop:10}}>
            <View style={[styles.section,{gap:10}]}>
                {Errors.days && <Text style={styles.errorText}>Selecciona al menos un d&iacute;a</Text>}
                <Text style={styles.title} >D&iacute;as laborales</Text>
                <View style={styles.wrapperDay}>
                    {days.map((day, index) => (
                        <TouchableOpacity key={index} style={day.work ? styles.activeBtn : styles.inputBtn } onPress={() => {setAdd(!add), addOrRemoveDays(day.name)}}>
                            <Text style={day.work ? styles.activeText : styles.bottomLeft}>{day.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={[styles.section,{gap:10, marginTop:10,}]}>
              <View style={{marginTop:15, marginBottom:15}}>
              {Errors.check && <Text style={styles.errorText}>Selecciona al menos un turno</Text>}
              <View style={styles.wrapperCheckbox}>
                  <Checkbox
                  color={isCheckedMat ? COLORS.blue : ""}
                  style={styles.checkbox}
                  value={isCheckedMat}
                  onValueChange={setIsCheckedMat}
                  />
                  <Text style={styles.subtitle} >Matutino</Text>
              </View>
              {
                isCheckedMat && 
                <>
                {errorMat && <Text style={styles.errorText}>Llena ambos campos</Text>}
                  <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.subtitle}>De:</Text>
                        <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                              <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                placeholderStyle={{fontFamily:"medium", color: COLORS.black, fontSize:16}}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={hrasMat}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                //search
                                maxHeight={300}
                                labelField="hra"
                                valueField="hra"
                                placeholder={""}
                                value={schedule.him}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        him: value.hra
                                    }))

                                }}
                              />
                                <Text style={styles.subtitle}>hora</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                                <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={{fontFamily:"medium", color: COLORS.black, fontSize:16}}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={duracionMin}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                //search
                                maxHeight={300}
                                labelField="min"
                                valueField="min"
                                placeholder={""}
                                //searchPlaceholder="Buscar..."
                                value={schedule.mim}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        mim: value.min
                                    }))

                                }}
                                />
                                <Text style={styles.subtitle}>min</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center', marginTop:15}}>
                        <Text style={styles.subtitle}>Hasta: </Text>
                        <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                              <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={hrasMat}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                maxHeight={300}
                                labelField="hra"
                                valueField="hra"
                                placeholder={""}
                                value={schedule.hfm}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        hfm: value.hra
                                    }))
                                }}
                              />
                              <Text style={styles.subtitle}>hora</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                                <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={duracionMin}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                maxHeight={300}
                                labelField="min"
                                valueField="min"
                                placeholder={""}
                                value={schedule.mfm}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        mfm: value.min
                                    }))

                                }}
                                />
                                <Text style={styles.subtitle}>min</Text>
                            </View>
                        </View>
                    </View>
                </>
            }
              </View>
            </View>
            <View style={[styles.section,{gap:10, marginTop:10}]}>
              <View style={{marginBottom:15, marginTop:15}}>
                        <View style={styles.wrapperCheckbox}>
                            <Checkbox
                            color={isCheckedVesp ? COLORS.blue : ""}
                            style={styles.checkbox}
                            value={isCheckedVesp}
                            onValueChange={setIsCheckedVesp}
                            />
                            <Text style={styles.subtitle} >Vespertino</Text>
                        </View>
                        {
                            isCheckedVesp && 
                            <>
                            {errorVesp && <Text style={styles.errorText}>Llena ambos campos</Text>}     
                            <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={styles.subtitle}>De:</Text>
                                    <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                                        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                                            <Dropdown
                                            style={styles.dropdown}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            containerStyle={styles.dropDownContainer}
                                            itemTextStyle={styles.bottomLeft}
                                            activeColor={COLORS.greyscale300}
                                            data={hrasVesp}
                                            autoScroll={false}
                                            showsVerticalScrollIndicator={false}
                                            maxHeight={300}
                                            labelField="hra"
                                            valueField="hra"
                                            placeholder={""}
                                            value={schedule.hiv}
                                            onChange={(value) => {
                                                setSchedule(prevSchedule => ({
                                                    ...prevSchedule,
                                                    hiv: value.hra
                                                }))

                                            }}
                                            />
                                            <Text style={styles.subtitle}>hora</Text>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                                          <Dropdown
                                            style={styles.dropdown}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            containerStyle={styles.dropDownContainer}
                                            itemTextStyle={styles.bottomLeft}
                                            activeColor={COLORS.greyscale300}
                                            data={duracionMin}
                                            autoScroll={false}
                                            showsVerticalScrollIndicator={false}
                                            maxHeight={300}
                                            labelField="min"
                                            valueField="min"
                                            placeholder={""}
                                            value={schedule.miv}
                                            onChange={(value) => {
                                                setSchedule(prevSchedule => ({
                                                    ...prevSchedule,
                                                    miv: value.min
                                                }))

                                            }}
                                            />
                                            <Text style={styles.subtitle}>min</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                                    <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center', marginTop:15}}>
                                      <Text style={styles.subtitle}>Hasta: </Text>
                                        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                                          <Dropdown
                                            style={styles.dropdown}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            containerStyle={styles.dropDownContainer}
                                            itemTextStyle={styles.bottomLeft}
                                            activeColor={COLORS.greyscale300}
                                            data={hrasVesp}
                                            autoScroll={false}
                                            showsVerticalScrollIndicator={false}
                                            maxHeight={300}
                                            labelField="hra"
                                            valueField="hra"
                                            placeholder={""}
                                            value={schedule.hfv}
                                            onChange={(value) => {
                                                setSchedule(prevSchedule => ({
                                                    ...prevSchedule,
                                                    hfv: value.hra
                                                }))

                                            }}
                                            />
                                          <Text style={styles.subtitle}>hora</Text>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                                          <Dropdown
                                            style={styles.dropdown}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            containerStyle={styles.dropDownContainer}
                                            itemTextStyle={styles.bottomLeft}
                                            activeColor={COLORS.greyscale300}
                                            data={duracionMin}
                                            autoScroll={false}
                                            showsVerticalScrollIndicator={false}
                                            maxHeight={300}
                                            labelField="min"
                                            valueField="min"
                                            placeholder={""}
                                            value={schedule.mfv}
                                            onChange={(value) => {
                                                setSchedule(prevSchedule => ({
                                                    ...prevSchedule,
                                                    mfv: value.min
                                                }))

                                            }}
                                          />
                                          <Text style={styles.subtitle}>min</Text>
                                        </View>
                                    </View>
                                </View>                  
                            </>
                        }
              </View>
          </View>
                    <View style={[styles.section,{gap:10, marginTop:10}]}>
                      <View style={{marginTop:15, marginBottom:15}}>
                        {errorDuration !== '' && <Text style={styles.errorText}>{errorDuration}</Text>}
                        <Text style={styles.title} >Durac&iacute;on aproximada por cita :</Text>
                        {Errors.duration && <Text style={styles.errorText}>Modifica al menos un campo</Text>}
                        <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                              <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={duracionHra}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                maxHeight={300}
                                labelField="hra"
                                valueField="hra"
                                placeholder={""}
                                value={schedule.dh}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        dh: value.hra
                                    }))
                                    
                                }}
                              />
                                <Text style={styles.subtitle}>hora</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                                <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={duracionMin}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                maxHeight={300}
                                labelField="min"
                                valueField="min"
                                placeholder={""}
                                value={schedule.dm}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        dm: value.min
                                    }))
                                    
                                }}
                                />
                                <Text style={styles.subtitle}>min</Text>
                            </View>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.section,{gap:10, marginTop:10}]}>
                      <View style={{marginBottom:15, marginTop:15}}>
                        <Text style={styles.title} >Tiempo límite</Text>
                        <Text style={[styles.bottomLeft, {textAlign:"center"}]}>(Tiempo límite que tiene el paciente para reagendar antes de la cita)</Text>
                        {Errors.limit && <Text style={[styles.textStyle, {color:'red'}]}>Modifica al menos un campo</Text>}
                        <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                              <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={limit}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                maxHeight={300}
                                labelField="hra"
                                valueField="hra"
                                placeholder={""}
                                value={schedule.tlh}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        tlh: value.hra
                                    }))
                                    
                                }}
                              />
                              <Text style={styles.subtitle}>hora</Text>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                              <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropDownContainer}
                                itemTextStyle={styles.bottomLeft}
                                activeColor={COLORS.greyscale300}
                                data={duracionMin}
                                autoScroll={false}
                                showsVerticalScrollIndicator={false}
                                maxHeight={300}
                                labelField="min"
                                valueField="min"
                                placeholder={""}
                                value={schedule.tlm}
                                onChange={(value) => {
                                    setSchedule(prevSchedule => ({
                                        ...prevSchedule,
                                        tlm: value.min
                                    }))
                                    
                                }}
                              />
                              <Text style={styles.subtitle}>min</Text>
                            </View>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.section,{marginTop:10}]}>
                      <View style={{marginBottom:15, marginTop:15}}>
                        {Errors.price && <Text style={styles.errorText}>Ingresa el precio por consulta</Text>}
                        <View style={{gap:10,flexDirection:'row', alignItems:'center'}}>
                            <Text style={styles.subtitle} >Precio por consulta: </Text>
                            <Text style={styles.subtitle}>$</Text>
                                <Input
                                  onInputChanged={(id,text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setPrice(numericValue)
                                  }}
                                  autoCapitalize="none"
                                  id="fistName"
                                  placeholder="Precio"
                                  placeholderTextColor={COLORS.black}
                                  value={price}
                                  keyboardType="numeric"
                                  styles={{width:100}}
                                  color={COLORS.greyscale300}
                                />
                          <Text style={styles.subtitle}>MX</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.wrapperCheckbox,styles.section, {marginTop:10}]}>
                      <View style={{marginTop:15, marginBottom:15, flexDirection:'row'}}>
                        <Checkbox
                          color={isCheckedVideocall ? COLORS.blue : ""}
                          style={styles.checkbox}
                          value={isCheckedVideocall}
                          onValueChange={setIsCheckedVideocall}
                          />
                        <Text style={styles.subtitle} >Cita virtual</Text>
                      </View>
                    </View>
                    <View style={[styles.wrapperCheckbox, styles.section, {marginTop:10, marginBottom:10}]}>
                      <View style={{marginTop:15, marginBottom:15, flexDirection:'row'}}>
                        <Checkbox
                          color={isCheckedRep ? COLORS.blue : ""}
                          style={styles.checkbox}
                          value={isCheckedRep}
                          onValueChange={setIsCheckedRep}
                        />
                        <Text style={styles.subtitle} >Citas abiertas a representantes</Text>
                      </View>
                  </View>
            <Button title='Guardar Horario' onPress={handleErrors} disabled={isDisabled} isLoading={isDisabled} filled style={styles.button}/>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  section:{
    backgroundColor:COLORS.grayscale100,
    borderRadius:6
  },
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
  },
  dropDownContainer: {
    borderRadius:5, 
    height:120,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.greyscale500,
    backgroundColor: COLORS.greyscale500,
  },
  checkbox: {
    marginRight: 10,
    height: 25,
    width: 25,
    borderRadius: 4,
    borderColor: COLORS.greyscale300,
    borderWidth: 2,
    backgroundColor: COLORS.greyscale600
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
    fontFamily: "medium",
    color: COLORS.black
  },
  activeText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 12,
    backgroundColor:COLORS.darkBlue,
    borderColor:COLORS.darkBlue
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.greyscale500,
    height: 52,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.greyscale300,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8
  },
  activeBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 52,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.redRose,
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
  dropdown: {
    height: 40,
    paddingHorizontal: 8,
    width: 60,
    backgroundColor:COLORS.greyscale300,
    borderRadius:4
  },
  wrapperDay:{
    flexDirection:'row',
    gap:10,
    flexWrap:'wrap',
    justifyContent:"center",
    marginBottom:15
  },
  wrapperCheckbox:{
    flexDirection:'row',
    alignItems:'center',
  },
  subtitle: {
    fontFamily:'bold',
    fontSize: 18,
    //marginLeft:10
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily:"medium"
  },
})

export default ScheduleRegister