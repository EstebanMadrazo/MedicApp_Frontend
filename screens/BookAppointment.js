import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES } from '../constants';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerView from '../components/DatePickerView';
//import { hoursData } from '../data';
import Button from '../components/Button';
import axios from 'axios';
import { useSession } from "../ctx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotAvailableDayCard from '../components/NotAvailableDayCard';

const BookAppointment = ({ route, navigation }) => {
    const {hp_uuid} = route.params
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    const startDate = getFormatedDate(today,"YYYY/MM/DD");
    const [selectedDate, setSelectedDate] = useState(startDate);
    const [medicInfo, setMedicInfo] = useState()
    const {session} = useSession();
    const [info, setInfo] = useState()
    const [token, setToken] = useState()
    const [availableHours, setAvailableHours] = useState()
    const [isLoading, setIsLoading] = useState(false)

    console.log(availableHours)

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
              uuid:hp_uuid
            }
          })
          const day = getDayOfWeek(selectedDate)
          setMedicInfo(responseInfo.data)
          console.log(hp_uuid)
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

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Agendar cita" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Seleccione su fecha</Text>
                    <View style={styles.datePickerContainer}>
                        <DatePickerView
                            open={openStartDatePicker}
                            startDate={startDate}
                            selectedDate={selectedDate}
                            onClose={() => setOpenStartDatePicker(false)}
                            onChangeStartDate={(date) => {setSelectedDate(date), setSelectedHour(null)}}
                        />
                    </View>
                    <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Seleccione la hora</Text>
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
                    title="Siguiente"
                    filled
                    style={styles.btn}
                    onPress={() => {
                            navigation.replace(
                                "SelectPackage", 
                                {
                                    medicInfo:medicInfo, 
                                    appointmentDate: selectedDate.replace(/\//g, '-') + ' ' + selectedHour
                                })
                            setIsLoading(true)
                        }
                    }
                    disabled={selectedHour === null? true: false}
                    color={selectedHour === null? COLORS.disabled: COLORS.primary}
                    isLoading={isLoading}
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
    }
})

export default BookAppointment