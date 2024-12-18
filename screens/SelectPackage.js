import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES, icons } from "../constants";
//import { Ionicons } from "@expo/vector-icons";
//import RNPickerSelect from 'react-native-picker-select';
import PackageItem from '../components/PackageItem';
import Header from '../components/Header';
import Button from '../components/Button';
import { useSession } from "../ctx";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SelectPackage = ({ route, navigation }) => {
    const {medicInfo, appointmentDate} = route.params
    const [isVideocall, setIsVideoCall] = useState()
    const {session} = useSession();
    const [info, setInfo] = useState()
    const [token, setToken] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const getData = async () => {
        try {
          let value = await AsyncStorage.getItem('userInfo')
          setInfo(JSON.parse(value))
          let token = await AsyncStorage.getItem('tokens')
          token = token?.substring(1, token?.length-1)
          setToken(token)
        } catch (e) {
          console.log(e)
        }
      }

    const createAppointment = async()=> {
        setIsLoading(true)
        const appointmentData = {
          appointmentDate: appointmentDate,
          healthProfUUID: medicInfo.hp_uuid,
          isPrioritary:1,
          total:medicInfo.price,
          isVideocall:isVideocall
        };
        //console.log("appointmentData: ", appointmentData)
        try{
          const resp = await axios(`${process.env.EXPO_PUBLIC_API_URL}/appointments/createAppointment`,{
              method:'POST',
              headers:{
                  'Content-Type':"application/json",
                  'Authorization': `bearer ${session}`,
                  'refresher' : token
              },
              data:appointmentData
          })
          const successfulRoom = await handleRoom(resp.data.appointment)
          if(!successfulRoom){
            return
          }
          /* const uuid = resp.data.appointment
          const total=doc.price
          const  medic= `${doc.given_name} ${doc.family_name}` */
          navigation.replace(
            "PaymentMethods", 
            {appointmentInfo: {
                    uuid:resp.data.appointment,
                    medic: medicInfo, 
                    date: appointmentDate, 
                    isVideocall:isVideocall
                }}
          )
          //return {uuid: uuid, amount: total, hp: medic}
      }catch(e){
          console.log("Error",e.response.data)
          setIsLoading(false)
      }  
    }

    //crea y envia la informacion de una nueva room a la base de datos en base a la informacion de la cita
    const handleRoom = async(uuid) => {
        try{
          //appointment.appointment.is_prioritary = 0 es cita sin paciente, is_prioritary = 1 es cita con paciente
          const response = await axios(`${process.env.EXPO_PUBLIC_API_URL}/chat/storeRoom`, {
           method: "POST",
           headers:{
            'Content-Type':"application/json",
            'Authorization': `bearer ${session}`,
            'refresher' : token
          },
           data:{
            session_id: uuid,
            patient_uuid: info.uuid,
            hp_uuid: medicInfo.hp_uuid,
            created_at: new Date (new Date(appointmentDate.replace(" ", "T")).getTime()),
            expires_at: new Date (new Date(appointmentDate.replace(" ", "T")).getTime()+ 30 * 60 * 1000),
            is_expired: false
           }
         })
         return true
        }catch(e){
          console.log("Entro en Error")
          console.log(e.response)
          setIsLoading(false)
          return false
        }
    }

    useEffect(() => {
        getData()
    },[])

    const renderContent = () => {
        const [selectedItem, setSelectedItem] = useState(null);

        const handleCheckboxPress = (itemTitle) => {
            if (selectedItem === itemTitle) {
                // If the clicked item is already selected, deselect it
                setSelectedItem(null);
            } else {
                // Otherwise, select the clicked item
                setSelectedItem(itemTitle);
                if(itemTitle === 'Video call'){
                    setIsVideoCall(true)
                }else{
                    setIsVideoCall(false)
                }
            }
        };

        return (
            <View>
                {/* <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Select Duration</Text>
                <View style={{
                    backgroundColor: COLORS.white,
                    paddingVertical: 12
                }}>
                    <View style={[styles.inputContainer, {
                        backgroundColor: COLORS.tertiaryWhite,
                    }]}>
                        <Ionicons name="time" size={24} color={COLORS.primary} />
                        <View style={{ marginHorizontal: 12 }}>
                            <RNPickerSelect
                                placeholder={{ label: '30 minutes', value: '30 minutes' }}
                                onValueChange={(value) => console.log(value)}
                                style={{
                                    inputIOS: {
                                        fontSize: 16,
                                        color: COLORS.grayscale700,
                                        fontFamily: "regular"
                                    },
                                    inputAndroid: {
                                        fontSize: 16,
                                        color: COLORS.grayscale700,
                                        fontFamily: "regular"
                                    }
                                }}
                                items={[
                                    { label: '30 minutes', value: '30 minutes' },
                                    { label: '45 minutes', value: '45 minutes' },
                                    { label: '1 hour', value: '1 hour' },
                                    { label: '2 hours', value: '2 hours' },
                                ]}
                            />
                        </View>
                    </View>
                </View> */}
                <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Selecciona el tipo de cita</Text>
                <View style={{
                    backgroundColor: COLORS.tertiaryWhite,
                    paddingTop: 12,
                }}>
                    {/* <PackageItem
                        checked={selectedItem === 'Messaging'} // Check if it's the selected item
                        onPress={() => handleCheckboxPress('Messaging')} // Pass the item title
                        title="Messaging"
                        subtitle="Chat with Doctor"
                        price="20"
                        duration="30 mins"
                        icon={icons.chatBubble2}
                    />
                    <PackageItem
                        checked={selectedItem === 'Voice call'}
                        onPress={() => handleCheckboxPress('Voice call')}
                        title="Voice call"
                        subtitle="Voice call with Doctor"
                        price="40"
                        duration="30 mins"
                        icon={icons.telephone}
                    /> */}
                    <PackageItem
                        checked={selectedItem === 'Video call'}
                        onPress={() => handleCheckboxPress('Video call')}
                        title="Video llamada"
                        subtitle="Cita por Video Llamada"
                        price={medicInfo.price}
                        duration={medicInfo.duration.split(" ")[0] +"\n(Hrs:Min)"}
                        icon={icons.videoCamera}
                    />
                    <PackageItem
                        checked={selectedItem === 'In Person'}
                        onPress={() => handleCheckboxPress('In Person')}
                        title="En persona"
                        subtitle="Cita presencial"
                        price={medicInfo.price}
                        duration={medicInfo.duration.split(" ")[0] +"\n(Hrs:Min)"}
                        icon={icons.user}
                    />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Tipo de cita" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
            <View style={[styles.bottomContainer, {
                backgroundColor: COLORS.white
            }]}>
                <Button
                    title="Agendar"
                    filled
                    style={styles.btn}
                    onPress={createAppointment}
                    color={isVideocall === undefined? COLORS.disabled : COLORS.primary}
                    disabled={isVideocall === undefined? true : false}
                    isLoading={isLoading}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 12
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
        alignItems: "center"
    },
    headerIcon: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        backgroundColor: COLORS.gray
    },
    arrowLeft: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    moreIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    separateLine: {
        marginVertical: 8,
        borderBottomWidth: .3,
        borderBottomColor: COLORS.grayscale200,
        width: "100%"
    },
    separateLine2: {
        borderBottomWidth: .3,
        borderBottomColor: COLORS.grayscale200,
        width: "100%",
        marginBottom: 6
    },
    h4: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.black,
        marginVertical: 6
    },
    subtitle: {
        textTransform: "uppercase",
        color: "gray",
        fontSize: 16,
        fontFamily: "regular",
        marginVertical: 12
    },
    subName: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.black,
        marginVertical: 6
    },
    btnContainer: {
        position: "absolute",
        bottom: 22,
        height: 72,
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        alignItems: "center"
    },
    btn: {
        width: SIZES.width - 32
    },
    btnText: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.white
    },
    inputTitle: {
        fontSize: 18,
        fontFamily: "medium",
        color: COLORS.black,
        marginVertical: 12
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        height: 52,
        backgroundColor: COLORS.tertiaryWhite,

    },
    icon: {
        marginRight: 10,
    },
    dropdownContainer: {
        flex: 1,
    },
    dropdown: {
        backgroundColor: 'white',
    },
    dropdownItem: {
        justifyContent: 'flex-start',
    },
    dropDown: {
        backgroundColor: 'white',
        zIndex: 1000,
    },
    picker: {
        flex: 1,
        height: 40,
    },
    title: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.black,
        marginVertical: 12
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 99,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    }
})
export default SelectPackage