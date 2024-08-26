import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerView from '../components/DatePickerView';
import { hoursData } from '../data';
import Button from '../components/Button';
import axios from 'axios';
import { useSession } from "../ctx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotAvailableDayCard from '../components/NotAvailableDayCard';

const SelectRescheduleAppointmentDate = ({ route, navigation }) => {
    const {appointment} = route.params
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    const startDate = getFormatedDate(today,"YYYY/MM/DD");
    const appointmentDate = getFormatedDate(appointment.appointment.date,"YYYY/MM/DD")
    const [selectedDate, setSelectedDate] = useState(appointmentDate);
    const {session} = useSession();
    const [info, setInfo] = useState()
    const [token, setToken] = useState()
    const [medicInfo, setMedicInfo] = useState()
    const [availableHours, setAvailableHours] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };

    // Function to handle hour selection
    const handleHourSelect = (hour) => {
        setSelectedHour(hour);
    };

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

    const resMedicAvailability = async() => {
        try{
          const responseInfo = await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/medicAvailability`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization":'bearer ' + session,
              "Refresher":'bearer ' + token,
            },
            params:{
              date:selectedDate.replace(/\//g, '-'),
              uuid:appointment.appointment.health_professional_uuid
            }
          })
          const day = getDayOfWeek(selectedDate)
          setMedicInfo(responseInfo.data)
          setAvailableHours(responseInfo.data.schedule_preferences?.schedule[day])
          console.log("Responce: ", responseInfo.data.schedule_preferences?.schedule)
        }catch(e){
          console.log(e.response.data)
        }
    }

    const getDayOfWeek = (dateString) => {
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const date = new Date(dateString.replace(/\//g, '-'));
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    };

    const RescheduleAppointment = async() => {
        setIsLoading(true)
        const hp_uuid = appointment.appointment.health_professional_uuid
        const appointmentUUID =  appointment.appointment.uuid
        const appointmentData = {
            appointmentDate: selectedDate.replace(/\//g, '-') + ' ' + selectedHour,
            hp_uuid,
            appointmentUUID,
            isVideocall:appointment.appointment.is_videocall
            };
            try{
            const resp = await axios(`${process.env.EXPO_PUBLIC_API_URL}/appointments/rescheduleAppointment`,{
                method:'POST',
                headers:{
                    'Content-Type':"application/json",
                    'Authorization': `bearer ${session}`,
                    'refresher' : token
                },
                data:appointmentData
            })
            console.log( 'response', resp.data)
            setModalVisible(true)
        }catch(e){
            console.log(e.response.data)
            setIsLoading(false)
        }  
    }

    useEffect(() => {
    getData()
    }, [])

    useEffect(() => {
    if(selectedDate){
        resMedicAvailability()
    }
    }, [selectedDate])

    // Render each hour as a selectable button
    const renderHourItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={[
                    styles.hourButton,item.isAvailable===false? styles.blockedHourButton:
                    selectedHour === item.hour && styles.selectedHourButton]}
                onPress={() => handleHourSelect(item.hour)}
                disabled={!item.isAvailable}
                >
                <Text style={[styles.hourText,item.isAvailable===false?
                styles.blockedHourText :
                selectedHour === item.hour && styles.selectedHourText]}>{item.hour}</Text>
            </TouchableOpacity>
        );
    };

    // Render modal
    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalSubContainer, {
                            backgroundColor: COLORS.white,
                        }]}>
                            <View style={styles.backgroundIllustration}>
                                <Image
                                    source={illustrations.background}
                                    resizeMode='contain'
                                    style={styles.modalIllustration}
                                />
                                <Image
                                    source={icons.calendar5}
                                    resizeMode='contain'
                                    style={styles.editPencilIcon}
                                />
                            </View>
                            <Text style={styles.modalTitle}>Reagendado con Éxito</Text>
                            <Text style={[styles.modalSubtitle, {
                                color: COLORS.black,
                            }]}>
                                Cita Reagendada con éxito. Recibirá una notificación y el médico seleccionado se pondrá en contacto con usted..
                            </Text>
                            <Button
                                title="Continuar"
                                filled
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Main', params: { screen: 'Appointment' } }],
                                      });
                                }}
                                style={styles.successBtn}
                            />
                            {/* <Button
                                title="View Appointment"
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.navigate("MyAppointmentMessaging")
                                }}
                                textColor={COLORS.primary}
                                style={{
                                    width: "100%",
                                    marginTop: 12,
                                    borderRadius: 32,
                                    backgroundColor: COLORS.tansparentPrimary,
                                    borderColor: COLORS.tansparentPrimary
                                }}
                            /> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Reagendar Cita" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Seleccione su Nueva Fecha</Text>
                    <View style={styles.datePickerContainer}>
                        <DatePickerView
                            open={openStartDatePicker}
                            startDate={startDate}
                            selectedDate={selectedDate}
                            onClose={() => setOpenStartDatePicker(false)}
                            onChangeStartDate={(date) => setSelectedDate(date)}
                        />
                    </View>
                    <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Selecione la Hora</Text>
                    {availableHours !== undefined ? (
                        <FlatList
                            data={availableHours}
                            renderItem={renderHourItem}
                            numColumns={3}
                            keyExtractor={(item) => item?.hour}
                            showsVerticalScrollIndicator={false}
                            style={{ marginVertical: 12 }}
                        />
                    ) 
                    : 
                    (
                        <View>
                            <NotAvailableDayCard/>
                        </View>
                    )}
                </ScrollView>
            </View>
            <View style={[styles.bottomContainer, {
                backgroundColor: COLORS.white
            }]}>
                <Button
                    title="Reagendar Cita"
                    filled
                    style={styles.btn}
                    isLoading={isLoading}
                    disabled={isLoading}
                    onPress={RescheduleAppointment}
                />
            </View>
            {renderModal()}
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
        backgroundColor: COLORS.white,
        padding: 16
    },
    title: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.black,
        marginTop: 12
    },
    datePickerContainer: {
        marginVertical: 12
    },
    hourButton: {
        borderRadius: 8,
        borderWidth: 1,
        marginHorizontal: 5,
        borderColor: COLORS.redRose,
        borderWidth: 1.4,
        width: (SIZES.width - 32) / 3 - 9,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
        backgroundColor: COLORS.white
    },
    selectedHourButton: {
        backgroundColor: COLORS.redRose,
    },
    blockedHourButton: {
        backgroundColor: COLORS.greyscale300,
        borderColor: COLORS.greyscale300
    },
    selectedHourText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white
    },
    blockedHourText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.grayscale700
    },
    hourText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.redRose
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
    },
    btn: {
        width: SIZES.width - 32,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.primary,
        textAlign: "center",
        marginVertical: 12
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: "regular",
        color: COLORS.black,
        textAlign: "center",
        marginVertical: 12
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    modalSubContainer: {
        height: 520,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22
    },
    successBtn: {
        width: "100%",
        marginTop: 12,
        borderRadius: 32
    },
    receiptBtn: {
        width: "100%",
        marginTop: 12,
        borderRadius: 32,
        backgroundColor: COLORS.tansparentPrimary,
        borderColor: COLORS.tansparentPrimary
    },
    editPencilIcon: {
        width: 54,
        height: 54,
        tintColor: COLORS.white,
        zIndex: 99999,
        position: "absolute",
        top: 50,
        left: 52,
    },
    backgroundIllustration: {
        height: 150,
        width: 150,
        marginVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        zIndex: -999
    }
})

export default SelectRescheduleAppointmentDate