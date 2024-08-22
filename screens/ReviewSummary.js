import { View, Text, StyleSheet, Image, TouchableOpacity, Linking} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSession } from '../ctx';
import PayModal from '../components/PayModal';
import { StripeProvider } from '@stripe/stripe-react-native';
import CheckoutScreen from '../components/StripeCheckout';

const ReviewSummary = ({ route, navigation }) => {
  const {appointmentInfo, paymentMethod} = route.params
  const medic = appointmentInfo.medic
  const [info, setInfo] = useState()
  const [token, setToken] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const {session} = useSession();
  const [user, setUser] = useState();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const date = new Date (appointmentInfo.date.replace(" ", "T"))
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  const dayName = days[date.getDay()]
  const monthName = months[date.getMonth()]
  const day = appointmentInfo.date.split(' ')[0].split('-')[2]
  const year = appointmentInfo.date.split(' ')[0].split('-')[0]
  const time = appointmentInfo.date.split(" ")[1]
  const amount = medic.price
  const [modalVisible, setModalVisible] = useState(false);
  const  medicName = `${medic.given_name} ${medic.family_name}`

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

  const resUser = async() => {
    try{
      const responseInfo = await axios(`${process.env.EXPO_PUBLIC_API_URL}/user/userInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'bearer ' + session,
          "Refresher":'bearer ' + token,
        },
      })
      setUser(responseInfo.data[0])
      //console.log("response DATA: ",responseInfo.data[0])
    }catch(e){
      console.log("ERROR: ",e)
    }
  }

  const handlePay = async () => {
    if(paymentMethod == 'Paypal'){
      payToPayPal()
    }
  }

  const payToPayPal = async() => {
      try{
          const resp = await axios(`${process.env.EXPO_PUBLIC_API_URL}/payments/create-order`,{
              method:'POST',
              headers:{
                  'Content-Type':"application/json",
              },
              data:{amount:amount, hp:medicName, appointment_uuid:appointmentInfo.uuid}
          })
        console.log(resp.data)
        Linking.openURL(resp.data.href)
        navigation.replace('Main')
      }catch(e){
        console.log(e)
      }   
    } 

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if(token && session){
      resUser()
    }
  }, [token, session])

  return (
    <SafeAreaView style={[styles.area, {
      backgroundColor: COLORS.tertiaryWhite
    }]}>
      <PayModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      <View style={[styles.container, {
        backgroundColor: COLORS.tertiaryWhite
      }]}>
        <Header title="Resumen de Cita" />
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{
            backgroundColor: COLORS.tertiaryWhite,
            marginTop: 22
          }}>
            <View style={[styles.doctorCard, {
              backgroundColor: COLORS.white,
            }]}>
              <Image
                source={{
                  uri:`${medic.profile_picture}`,
                  Cache:'none'
                }}
                resizeMode='cover'
                style={styles.doctorImage}
              />
              <View>
                <Text style={[styles.doctorName, {
                  color: COLORS.greyscale900
                }]}>{medic.given_name} {medic.family_name}</Text>
                <View style={[styles.separateLine, {
                  backgroundColor: COLORS.grayscale200,
                }]} />
                <View style={{flexDirection:"row"}}>
                    {medic.specialities.specialities.map((item) =>(
                        <Text key={item.name} style={[styles.doctorSpeciality, {
                            color: COLORS.greyScale800
                        }]}>{item.name} </Text>
                    ))}
                </View>
                <Text style={[styles.doctorHospital, {
                  color: COLORS.greyScale800
              }]}>{medic.main_st}, {medic.street_intersections}, {medic.neighborhood}, {medic.office_state}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.summaryContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Tipo de Cita</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>{appointmentInfo.isVideocall? 'Video llamada' : 'Cita presencial'}</Text>
            </View>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Dirección</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>{medic.main_st}, {medic.street_intersections}, {medic.neighborhood}, {medic.office_state}</Text>
            </View>

            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Nombre del Paciente</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>{user?.given_name} {user?.family_name}</Text>
            </View>
            {/* <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Phone</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>+1 111 467 378 399</Text>
            </View> */}
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Fecha Agendada</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>{dayName} {day} de {monthName} del {year}</Text>
            </View>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Hora de Cita</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>A las {time} Hrs</Text>
            </View>
          </View>

          <View style={[styles.summaryContainer, {
            backgroundColor: COLORS.white,
          }]}>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Precio de Cita</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>${amount}</Text>
            </View>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Duración de Cita</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>{medic.duration.split(" ")[0]} (Hrs:Min)</Text>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor: COLORS.grayscale200
            }]} />
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: COLORS.grayscale700
              }]}>Total</Text>
              <Text style={[styles.viewRight, { color: COLORS.greyscale900 }]}>${amount}</Text>
            </View>
          </View>

          <View style={[styles.cardContainer, {
            backgroundColor: COLORS.white
          }]}>
            <View style={styles.cardLeft}>
              <Image
                source={paymentMethod == "Paypal"? icons.paypal : icons.creditCard}
                resizeMode='contain'
                style={styles.creditCard}
              />
              <Text style={[styles.creditCardNum, {
                color: COLORS.greyscale900
              }]}>
                {paymentMethod == "Paypal"? "PayPal" : "Tarjeta de Crédito"}
              </Text>
            </View>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("AddNewCard")}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity> */}
          </View>

        </ScrollView>
        {paymentMethod !== 'Paypal'? (
            <StripeProvider publishableKey={process.env.STRIPE_KEY}>
                <CheckoutScreen amount={amount} hp={medicName} appointment_uuid={appointmentInfo.uuid} />
            </StripeProvider>
          )
          :
          (
            <Button
              title="Pagar Cita"
              onPress={handlePay}
              filled
              style={styles.continueBtn}
            />
          )
        }
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
  btnContainer: {
    width: SIZES.width - 32,
    height: 300,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
    backgroundColor: "#FAFAFA"
  },
  premiumIcon: {
    width: 60,
    height: 60,
    tintColor: COLORS.primary
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12
  },
  price: {
    fontSize: 32,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  priceMonth: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.grayscale700,
  },
  premiumItemContainer: {
    marginTop: 16
  },
  premiumItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
  },
  premiumText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyScale800,
    marginLeft: 24
  },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2,
    marginBottom: 12,
    marginTop: 12,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.greyscale900
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200
  },
  creditCard: {
    width: 44,
    height: 34
  },
  creditCardNum: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  changeBtnText: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.primary
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 72,
    width: SIZES.width - 32,
    height: 80,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  continueBtn: {
    borderRadius: 32,
    position: "absolute",
    bottom: 16,
    width: SIZES.width - 32,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    right: 16,
    left: 16,
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
    width: 42,
    height: 42,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 54,
    left: 58,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999
  },
  doctorCard: {
    height: 142,
    width: SIZES.width - 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    height: 110,
    width: 110,
    borderRadius: 16,
    marginHorizontal: 16
  },
  doctorName: {
    fontSize: 18,
    color: COLORS.greyscale900,
    fontFamily: "bold"
  },
  separateLine: {
    height: 1,
    width: SIZES.width - 32,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12
  },
  doctorSpeciality: {
    fontSize: 12,
    color: COLORS.greyScale800,
    fontFamily: "medium",
    marginBottom: 8
  },
  doctorHospital: {
    fontSize: 12,
    color: COLORS.greyScale800,
    fontFamily: "medium"
  },
})

export default ReviewSummary