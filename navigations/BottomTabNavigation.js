import { View, Platform, Image, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS, icons } from '../constants';
import { Appointment, History, Home, Notifications, Profile } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserData from '../components/UserData';
import HomeMedic from '../screens/HomeMedic';
import * as NotificationsExpo from 'expo-notifications';

const Tab = createBottomTabNavigator();



const BottomTabNavigation = () => {
    const [userInfo, setUserInfo] = useState();
    const { data, loading, error } = useUserData();

    NotificationsExpo.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
        handleSuccess: () => {
          // dismiss notification immediately after it is presented
          NotificationsExpo.getPresentedNotificationsAsync();
        },
      });

    const getUserInfo = async () => {
        const data = JSON.parse(await AsyncStorage.getItem('userInfo'))
        setUserInfo(data)
    }

    useEffect(() => {
        const fetchData = async () => {
            await getUserInfo()
        }
        fetchData()
    }, [])
    console.log('Data ', data)
    console.log('USER INFO ', userInfo)
    return (
        <>
            {loading && loading == true ? (
                <ActivityIndicator size={35} color={COLORS.primary} /> 
            ) : (
                <Tab.Navigator screenOptions={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    unmountOnBlur: true,
                    tabBarStyle: {
                        position: 'absolute',
                        justifyContent: "center",
                        bottom: 0,
                        right: 0,
                        left: 0,
                        elevation: 0,
                        height: Platform.OS === 'ios' ? 90 : 60,
                        backgroundColor: COLORS.white,
                        borderTopColor: "transparent",
                    },
                }}>
                    <Tab.Screen
                        name="Home"
                        component={userInfo?.userRole === 'Medic' ? HomeMedic : Home}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center" }}>
                                        <Image
                                            source={focused ? icons.home2 : icons.home2Outline}
                                            resizeMode='contain'
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: focused ? COLORS.primary : COLORS.gray3,
                                            }}
                                        />
                                        <Text style={{
                                            ...FONTS.body4,
                                            color: focused ? COLORS.primary : COLORS.gray3,
                                        }}>Inicio</Text>
                                    </View>
                                )
                            },
                        }}
                    />
                    <Tab.Screen
                        name="Appointment"
                        component={Appointment}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center" }}>
                                        <Image
                                            source={focused ? icons.calendar5 : icons.calendar}
                                            resizeMode='contain'
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: focused ? COLORS.primary : COLORS.gray3,
                                            }}
                                        />
                                        <Text style={{
                                            ...FONTS.body4,
                                            color: focused ? COLORS.primary : COLORS.gray3,
                                        }}>Citas</Text>
                                    </View>
                                )
                            },
                        }}
                    />
                    <Tab.Screen
                        name="Notifications"
                        component={Notifications}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center" }}>
                                        <Image
                                            source={focused ? icons.notificationFull : icons.notification}
                                            resizeMode='contain'
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: focused ? COLORS.primary : COLORS.gray3,
                                            }}
                                        />
                                        <Text style={{
                                            ...FONTS.body4,
                                            color: focused ? COLORS.primary : COLORS.gray3,
                                        }}>Notificaciones</Text>
                                    </View>
                                )
                            },
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={Profile}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <View style={{ alignItems: "center" }}>
                                        <Image
                                            source={focused ? icons.user : icons.userOutline}
                                            resizeMode='contain'
                                            style={{
                                                height: 24,
                                                width: 24,
                                                tintColor: focused ? COLORS.primary : COLORS.gray3,
                                            }}
                                        />
                                        <Text style={{
                                            ...FONTS.body4,
                                            color: focused ? COLORS.primary : COLORS.gray3,
                                        }}>Perfil</Text>
                                    </View>
                                )
                            },
                        }}
                    />
                </Tab.Navigator>
            )}
        </>
    )
}

export default BottomTabNavigation