import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import { ScrollView } from 'react-native-virtualized-view';
import { useRoute } from '@react-navigation/native';

const MyAppointmentVideoCall = ({ navigation }) => {
  const [age, setAge] = useState(0)
  const route = useRoute();
  const { appointmentInfo } = route.params || {};
  console.log(appointmentInfo)

  const getAge = () => {
    const birthdate = new Date(appointmentInfo.info.birthdate)
    birthdate.setMinutes(birthdate.getMinutes() - birthdate.getTimezoneOffset())
    const actualAge = new Date().getFullYear() - birthdate.getFullYear() 
    setAge(actualAge)
  }

  useEffect(()=>{
    getAge()
  })

  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode='contain'
              style={[styles.backIcon, {
                tintColor: COLORS.black
              }]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: COLORS.black
          }]}>My Appointment</Text>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity>
            <Image
              source={icons.moreCircle}
              resizeMode='contain'
              style={[styles.moreIcon, {
                tintColor: COLORS.black
              }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  /**
   * render content
   */

  const renderContent = () => {
    return (
      <View>
        <View style={{ backgroundColor: COLORS.tertiaryWhite }}>
          <View style={[styles.doctorCard, {
            backgroundColor: COLORS.white,
          }]}>
            <Image
              source={{
                uri:appointmentInfo.info.profile_picture
              }}
              resizeMode='cover'
              style={styles.doctorImage}
            />
            <View>
              <Text style={[styles.doctorName, {
                color: COLORS.greyscale900
              }]}>{appointmentInfo.info.given_name}</Text>
              <Text style={[styles.doctorName, {
                color: COLORS.greyscale900
              }]}>{appointmentInfo.info.family_name}</Text>
              <View style={[styles.separateLine, {
                backgroundColor: COLORS.grayscale200,
              }]} />
              <Text style={[styles.doctorSpeciality, {
                color: COLORS.greyScale800
              }]}>{}</Text>
              <Text style={[styles.doctorHospital, {
                color: COLORS.greyScale800
              }]}>{}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.subtitle, {
          color: COLORS.greyscale900
        }]}>Cita Programada</Text>
        <Text style={[styles.description, {
          color: COLORS.greyScale800,
        }]}>{new Date(appointmentInfo.appointment.date).toDateString()}</Text>
        <Text style={[styles.description, {
          color: COLORS.greyScale800,
        }]}>{appointmentInfo.appointment.date.split(" ")[1]}</Text>
        <Text style={[styles.subtitle, {
          color: COLORS.greyscale900
        }]}>Información del Paciente</Text>
        <View style={styles.viewContainer}>
          <View style={styles.viewLeft}>
            <Text style={[styles.description, {
              color: COLORS.greyScale800,
            }]}>Nombre Completo</Text>
          </View>
          <View>
            <Text style={[styles.description, {
              color: COLORS.greyScale800,
            }]}>:  {appointmentInfo.info.given_name} {appointmentInfo.info.family_name}</Text>
          </View>
        </View>
        <View style={styles.viewContainer}>
          <View style={styles.viewLeft}>
            <Text style={[styles.description, {
              color: COLORS.greyScale800,
            }]}>Sexo</Text>
          </View>
          <View>
            <Text style={[styles.description, {
              color: COLORS.greyScale800,
            }]}>:  {appointmentInfo.info.sex}</Text>
          </View>
        </View>
        <View style={styles.viewContainer}>
          <View style={styles.viewLeft}>
            <Text style={[styles.description, {
              color: COLORS.greyScale800,
            }]}>Edad</Text>
          </View>
          <View>
            <Text style={[styles.description, {
              color: COLORS.greyScale800,
            }]}>:  {age}</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, {
          color: COLORS.greyscale900
        }]}>Información Médica</Text>
        <Text style={[styles.description, {
          color: COLORS.greyScale800,
        }]}>{new Date(appointmentInfo.appointment.date).toDateString()}</Text>
        <Text style={[styles.description, {
          color: COLORS.greyScale800,
        }]}>{appointmentInfo.appointment.date.split(" ")[1]}</Text>
        <Text style={[styles.subtitle, {
          color: COLORS.greyscale900
        }]}>Tipo de Cita</Text>
        <View style={{ backgroundColor: COLORS.tertiaryWhite }}>
          <View style={[styles.pkgContainer, {
            backgroundColor: COLORS.white
          }]}>
            <View style={styles.pkgLeftContainer}>
              <View style={styles.pkgIconContainer}>
                <Image
                  source={icons.videoCamera}
                  resizeMode='contain'
                  style={styles.pkgIcon}
                />
              </View>
              <View>
                <Text style={[styles.pkgTitle, {
                  color: COLORS.greyscale900
                }]}>Videollamada</Text>
                <Text style={[styles.pkgDescription, {
                  color: COLORS.greyScale800
                }]}>videollamda con médico</Text>
              </View>
            </View>
            <View style={styles.pkgRightContainer}>
              <Text style={styles.pkgPrice}>${appointmentInfo.appointment.total}</Text>
              <Text style={[styles.pkgPriceTag, {
                color: COLORS.greyScale800
              }]}>({appointmentInfo.appointment.is_verified ? "pagado" :"pendiente"})</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </View>
      <View style={[styles.bottomContainer, {
        backgroundColor: COLORS.white,
      }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("VideoCall")}
          style={styles.btn}>
          <Image
            source={icons.videoCamera}
            resizeMode='contain'
            style={styles.btnIcon}
          />
          <Text style={styles.btnText}>Videollamada (Empieza a {appointmentInfo.appointment.date.split(" ")[1]})</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16
  },
  scrollView: {
    backgroundColor: COLORS.tertiaryWhite
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  heartIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
    marginRight: 16
  },
  viewRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  doctorCard: {
    height: 142,
    width: SIZES.width - 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12
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
  subtitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginVertical: 8
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.greyScale800,
    marginVertical: 6
  },
  viewContainer: {
    flexDirection: "row",
    marginVertical: 2,
  },
  viewLeft: {
    width: 120,
  },
  pkgContainer: {
    height: 100,
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  pkgLeftContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  pkgIconContainer: {
    height: 60,
    width: 60,
    borderRadius: 999,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginRight: 12
  },
  pkgIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary
  },
  pkgTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginVertical: 8
  },
  pkgDescription: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.greyScale800,
  },
  pkgRightContainer: {
    alignItems: "center",
    marginRight: 12
  },
  pkgPrice: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.primary,
    marginBottom: 4
  },
  pkgPriceTag: {
    fontSize: 10,
    fontFamily: "medium",
    color: COLORS.greyScale800
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
    height: 58,
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.white,
    marginRight: 16
  },
  btnText: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.white
  }
})

export default MyAppointmentVideoCall