import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';
import { COLORS, icons, images, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import NotificationCard from '../components/NotificationCard';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//import { notifications } from '../data';

const Notifications = ({ navigation }) => {
  const[userInfo, setUserInfo] = useState()
  const[notifications, setNotifications] = useState([]) 
  console.log(notifications)
  
  const getData = async () =>{
    try{
      let value = await AsyncStorage.getItem('userInfo')        
      setUserInfo(JSON.parse(value))
    }catch(e){
      console.log(e)
    }
  }

  const getAllNotifications = async() =>{
    try {
        const response = await axios(`${process.env.EXPO_PUBLIC_API_URL}/notifications/getAllNotifications`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            params:{
              uuid: userInfo?.uuid
            }
        })
        console.log("RESPONSE: ", response.data[0].data.appointment)
        setNotifications(response.data)
    } catch (error) {
        console.log("Error: ",error.response.data)
    }
  }

  useEffect(()=>{
    getData()
  },[])

  useEffect(()=>{
    if(userInfo){
      getAllNotifications()
    }
  },[userInfo])



  /**
   * Render header
   */
  /* const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.headerIconContainer, {
            borderColor: COLORS.grayscale200
          }]}>
          <Image
            source={icons.back}
            resizeMode='contain'
            style={[styles.arrowBackIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {
          color: COLORS.greyscale900
        }]}>Notifications</Text>
        <Text>{" "}</Text>
      </View>
    )
  } */

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.premedLogo}
            resizeMode='contain'
            style={styles.headerLogo}
          />
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>Notificaciones</Text>
        </View>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity>
            <Image
              source={icons.search}
              resizeMode='contain'
              style={[styles.searchIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={icons.moreCircle}
              resizeMode='contain'
              style={[styles.moreCircleIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={styles.headerNoti}>
            <View style={styles.headerNotiLeft}>
              <Text style={[styles.notiTitle, {
                color: COLORS.greyscale900
              }]}>Recent</Text>
              <View style={styles.headerNotiView}>
                <Text style={styles.headerNotiTitle}>4</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          </View> */}
          <View style={{marginBottom:50}}>
          <FlatList
            data={notifications}
            keyExtractor={item => item.data.id}
            renderItem={({ item }) => (
              <NotificationCard
                title={item.title}
                description={item.body}
                icon={
                  item.data.type_notification =="create_appointment"? 
                  icons.calendar3 : item.data.type_notification == "reschedule_appointment"?
                  icons.appointment : item.data.type_notification == "chat_message"? icons.chat : icons.cancelSquare}
                date={item.body}
              />
            )}
          />
          </View>
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
  /* headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  }, */
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between"
  },
  headerIconContainer: {
    height: 46,
    width: 46,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999
  },
  arrowBackIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  /* headerTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black
  }, */
  headerLogo: {
    height: 24,
    width: 24,
    //tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 12
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerNoti: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  headerNotiLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  notiTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black
  },
  headerNotiView: {
    height: 16,
    width: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4
  },
  headerNotiTitle: {
    fontSize: 10,
    fontFamily: "bold",
    color: COLORS.white
  },
  clearAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "medium"
  }
})

export default Notifications