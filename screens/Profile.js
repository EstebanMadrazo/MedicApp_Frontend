import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { MaterialIcons } from '@expo/vector-icons';
import { launchImagePicker } from '../utils/ImagePickerHelper';
import SettingsItem from '../components/SettingsItem';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import { useSession } from "../ctx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useUserData from '../components/UserData';
import { CommonActions } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const refRBSheet = useRef();
  const { session, signOut } = useSession(null);
  const [tokens, setTokens] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { data, loading, error } = useUserData();
  console.log(data)
  /*useEffect(() => {
    const fetchTokens = async () => {
      const data = await getTokens()
      setTokens(data)
    }
    fetchTokens()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      await getUserInfo()
    }
    fetchUserData()
  }, [tokens, session])

  const getTokens = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('userInfo'))
    console.log('DATA', data)
    console.log('Refresh token', tokens.refreshToken)
    console.log('TOKENS: ', tokens)
    return data
  }

  const getUserInfo = async () => {
    try {
      const user = await axios({
        url: `${process.env.EXPO_PUBLIC_API_URL}/user/userInfo`,
        method: "POST",
        headers: {
          "Authorization": `bearer ${session}`,
          "Refresher": `bearer ${data.refreshToken}`
        }
      })
      console.log('USER: ', user.data)
      setUserInfo(user.data)
    } catch (err) {
      console.err(err.response.data)
    }
  }*/

  /** 
   * Render header
   */
  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={styles.logo}
          />
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>Perfil</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.headerIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
  /**
   * Render User Profile
   */
  const renderProfile = () => {
    const [image, setImage] = useState(images.user1)

    const pickImage = async () => {
      try {
        const tempUri = await launchImagePicker()

        if (!tempUri) return

        // set the image
        setImage({ uri: tempUri })
      } catch (error) { }
    };
    return (
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{
              uri: `${data?.profile_picture}`
            }}
            resizeMode='cover'
            style={styles.avatar}
          />
          <TouchableOpacity
            onPress={pickImage}
            style={styles.picContainer}>
            <MaterialIcons name="edit" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, { color: COLORS.greyscale900 }]}>{data?.given_name} {data?.family_name}</Text>
        <Text style={[styles.subtitle, { color: COLORS.greyscale900 }]}>{data?.email}</Text>
      </View>
    )
  }
  /**
   * Render Settings
   */
  const renderSettings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
      setIsDarkMode((prev) => !prev);
    };

    return (
      <View style={styles.settingsContainer}>
        {data?.role === 'Medic' ?
          (<SettingsItem
            icon={icons.location2Outline}
            name="Direccion"
            onPress={() => navigation.navigate("Address")}
          />)
          :
          (<></>)
        }
        <SettingsItem
          icon={icons.userOutline}
          name="Editar Perfil"
          onPress={() => navigation.navigate({
            name: "EditProfile",
            params: {
              userInfo: data
            }
          })}
        />
        {/*<SettingsItem
          icon={icons.bell2}
          name="Notificationes"
          onPress={() => navigation.navigate("SettingsNotifications")}
        />*/}
        {data?.role === 'Medic' ?
          (
            <SettingsItem
              icon={icons.wallet2Outline}
              name="Pagos"
              onPress={() => navigation.navigate("SettingsPayment")}
            />
          )
          : data?.role === 'Patient' ?

            (
              <SettingsItem
                icon={icons.content}
                name="Historial Medico"
                onPress={() => navigation.navigate("SettingsPayment")}
              />
            )
            :
            (
              <SettingsItem
                icon={icons.box}
                name="Productos"
                onPress={() => navigation.navigate("SettingsPayment")}
              />
            )
        }
        <SettingsItem
          icon={icons.shieldOutline}
          name="Seguridad"
          onPress={() => navigation.navigate("SettingsSecurity")}
        />
        {/*<TouchableOpacity
          onPress={() => navigation.navigate("SettingsLanguage")}
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.more}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900
            }]}>Language & Region</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.rightLanguage, {
              color: COLORS.greyscale900
            }]}>English (US)</Text>
            <Image
              source={icons.arrowRight}
              resizeMode='contain'
              style={[styles.settingsArrowRight, {
                tintColor: COLORS.greyscale900
              }]}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: COLORS.greyscale900
            }]}>Dark Mode</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>*/}
        <SettingsItem
          icon={icons.lockedComputerOutline}
          name="Politicas de Privacidad"
          onPress={() => navigation.navigate("SettingsPrivacyPolicy")}
        />
        {/*<SettingsItem
          icon={icons.infoCircle}
          name="Help Center"
          onPress={() => navigation.navigate("HelpCenter")}
        />
        <SettingsItem
          icon={icons.people4}
          name="Invite Friends"
          onPress={() => navigation.navigate("InviteFriends")}
        />*/}
        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={styles.logoutContainer}>
          <View style={styles.logoutLeftContainer}>
            <Image
              source={icons.logout}
              resizeMode='contain'
              style={[styles.logoutIcon, {
                tintColor: "red"
              }]}
            />
            <Text style={[styles.logoutName, {
              color: "red"
            }]}>Cerrar Sesión</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderProfile()}
          {renderSettings()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={SIZES.height * .8}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: COLORS.grayscale200,
            height: 4
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 260,
            backgroundColor: COLORS.white
          }
        }}
      >
        <Text style={styles.bottomTitle}>Cerrar Sesion</Text>
        <View style={[styles.separateLine, {
          backgroundColor: COLORS.grayscale200,
        }]} />
        <Text style={[styles.bottomSubtitle, {
          color: COLORS.black
        }]}>Estas seguro de cerrar sesión?</Text>
        <View style={styles.bottomContainer}>
          <Button
            title="Cancelar"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: COLORS.tansparentPrimary
            }}
            textColor={COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Sí, Cerrar Sesión"
            filled
            style={styles.logoutButton}
            onPress={async () => (
              await signOut(),
              refRBSheet.current.close(),
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              ))}
          />
        </View>
      </RBSheet>
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
    padding: 16,
    marginBottom: 32
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  profileContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: .4,
    paddingVertical: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: 0,
    bottom: 12
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginTop: 12
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "medium",
    marginTop: 4
  },
  settingsContainer: {
    marginVertical: 12
  },
  settingsItemContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  settingsName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginRight: 8
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: .8 }, { scaleY: .8 }], // Adjust the size of the switch
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  logoutLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  logoutName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12
  }
})

export default Profile