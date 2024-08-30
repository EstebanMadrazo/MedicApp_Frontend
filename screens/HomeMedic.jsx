import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { banners, categories, recommendedDoctors } from '../data';
import SubHeaderItem from '../components/SubHeaderItem';
import Category from '../components/Category';
import HorizontalDoctorCard from '../components/HorizontalDoctorCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from "../ctx";
import axios from 'axios';
import NotFoundCard from '../components/NotFoundCard';
import DatePickerView from '../components/DatePickerView';
import Header from '../components/Header';
import NotAvailableDayCard from '../components/NotAvailableDayCard';
import Button from '../components/Button';
import { getFormatedDate } from "react-native-modern-datepicker";
import useUserData from '../components/UserData';
import * as Notifications from 'expo-notifications';

const HomeMedic = ({ navigation }) => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    const startDate = getFormatedDate(today, "YYYY/MM/DD");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [specialties, setSpecialities] = useState([])
    const [MedicCategories, setCategories] = useState()
    const [info, setInfo] = useState()
    const [token, setToken] = useState();
    const { session } = useSession();
    const [user, setUser] = useState();
    const { data, loading, error } = useUserData()
    const [medics, setMedics] = useState([])
    const [seeAll, setSeeAll] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState(["Cercanos"]);
    const [isLoading, setIsLoading] = useState(true)
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedDate, setSelectedDate] = useState(startDate);
    const [appointments, setAppointments] = useState([])
    const [doctorInfo, setDoctorInfo] = useState()

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
        handleSuccess: () => {
          // dismiss notification immediately after it is presented
          Notifications.getPresentedNotificationsAsync();
        },
      });

    useEffect(() => {
        fetchData = async () => {
            if (!data?.uuid || !data?.role) { return }
            try {
                const upcomingAppoint = []
                const auxDate = new Date(selectedDate.replaceAll('/', '-')).toISOString().split('T')[0]
                //console.log(auxDate)
                //auxDate.setMinutes(auxDate.getMinutes() + auxDate.getTimezoneOffset())
                const response = await axios({
                    url: `${process.env.EXPO_PUBLIC_API_URL}/appointments/appointmentInfo`,
                    method: "GET",
                    params: {
                        uuid: data?.hp_uuid,
                        role: data?.role
                    }
                })
                for (let i = 0; i < response.data.appointmentsInfo.length; i++) {
                    //Convierte 2024-04-07 11:00:00 en 2024-04-07T17:00:00.000Z, es decir, de local a utc 
                    const appointmentDate = response.data.appointmentsInfo[i].appointment.date.split(' ')[0]
                    //console.log(appointmentDate)
                    //Convierte de utc a local y despues compara si la fecha actual es menor a la fecha de la cita
                    if ((auxDate === appointmentDate) && response.data.appointmentsInfo[i].appointment.is_cancelled == 0) {
                        if (response.data.appointmentsInfo[i].appointment.is_verified == 1) {
                            upcomingAppoint.push(response.data.appointmentsInfo[i])
                        }
                    }
                }
                setAppointments(upcomingAppoint)
                setDoctorInfo(response.data.userInfo)
                setIsLoading(false)
            } catch (error) {
                console.log(error.response.data)
            }
        }

        fetchData()
    }, [loading, selectedDate])

    /**
    * Render header
    */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.viewLeft}>
                    <Image
                        source={images.premedLogo}
                        resizeMode='contain'
                        style={styles.userIcon}
                    />
                    <View style={styles.viewNameContainer}>
                        <Text style={styles.greeeting}>Hola de nuevo 👋</Text>
                        <Text style={[styles.title, {
                            color: COLORS.greyscale900
                        }]}>{data?.given_name} {data?.family_name}</Text>
                    </View>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Notifications")}>
                        <Image
                            source={icons.notificationBell2}
                            resizeMode='contain'
                            style={[styles.bellIcon, { tintColor: COLORS.greyscale900 }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
    * Render categories
    */
    const renderCategories = () => {
        console.log('isLoading', isLoading)
        if (isLoading) {
            return (
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size={100} color={COLORS.primary} />
                </View>
            )
        }

        //console.log(appointments[0].appointment)
        //console.log('Render Categories', appointments) 
        return (
            <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
                <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                    {/*<Header title="Reagendar Cita" />*/}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* <Text style={[styles.title, { color: COLORS.greyscale900 }]}>Calendario de Citas</Text> */}
                        <View style={styles.datePickerContainer}>
                            <DatePickerView
                                open={openStartDatePicker}
                                //startDate={startDate}
                                selectedDate={selectedDate}
                                onClose={() => setOpenStartDatePicker(false)}
                                onChangeStartDate={(date) => setSelectedDate(date)}
                            />
                        </View>
                        <SubHeaderItem title="Citas" />
                        {appointments?.length > 0 ? (
                            <FlatList
                                data={appointments}
                                numColumns={3}
                                keyExtractor={(item) => item?.hour}
                                showsVerticalScrollIndicator={false}
                                style={{ marginVertical: 12 }}
                                renderItem={({ item }) => (
                                    <HorizontalDoctorCard
                                        name={item.info?.given_name + " " + item.info?.family_name}
                                        image={item.info?.profile_picture}
                                        main_st={doctorInfo.main_st}
                                        neighborhood={doctorInfo.neighborhood}
                                        office_state={doctorInfo.office_state}
                                        consultationFee={doctorInfo.price}
                                        rating={item.info?.score}
                                        //schedule_appointments={item.schedule_appointments}
                                        isAvailable={true}
                                        onPress={() => navigation.navigate("DoctorDetails", { medicInfo: JSON.stringify(item) })}
                                    />
                                )}

                            />
                        )
                            :
                            (
                                <View>
                                    <NotAvailableDayCard />
                                </View>
                            )}
                    </ScrollView>
                </View>
                <View style={[styles.bottomContainer, {
                    backgroundColor: COLORS.white
                }]}>
                </View>
                {/*renderModal()*/}
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/*renderSearchBar()*/}
                    {/* {renderBanner()} */}
                    {renderCategories()}
                    {/*renderTopDoctors()*/}
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
        backgroundColor: COLORS.white,
        padding: 16
    },
    headerContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        justifyContent: "space-between",
        alignItems: "center"
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 32
    },
    viewLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    greeeting: {
        fontSize: 12,
        fontFamily: "regular",
        color: "gray",
        marginBottom: 4
    },
    title: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.greyscale900
    },
    viewNameContainer: {
        marginLeft: 12
    },
    viewRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    bellIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 8
    },
    bookmarkIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginVertical: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "regular",
        marginHorizontal: 8
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary
    },
    bannerTopContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    bannerDicount: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.white,
        marginBottom: 4
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.white
    },
    bannerDiscountNum: {
        fontSize: 46,
        fontFamily: "bold",
        color: COLORS.white
    },
    bannerBottomContainer: {
        marginTop: 8
    },
    bannerBottomTitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.white
    },
    bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.white,
        marginTop: 4
    },
    userAvatar: {
        width: 64,
        height: 64,
        borderRadius: 999
    },
    firstName: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.dark2,
        marginTop: 6
    },
    bannerItemContainer: {
        width: "100%",
        paddingBottom: 10,
        backgroundColor: COLORS.primary,
        height: 170,
        borderRadius: 32,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },


})

export default HomeMedic