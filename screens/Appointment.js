import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { CancelledBooking, CompletedBooking, UpcomingBooking } from '../tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const renderPatientScene = SceneMap({
  first: UpcomingBooking,
  second: CompletedBooking,
  third: CancelledBooking
});

const renderMedicScene = SceneMap({
  first: UpcomingBooking,
  second: CompletedBooking,
});

const Appointment = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [userRole, setUserRole] = useState()
  const [index, setIndex] = React.useState(0);
  const [routesPatient] = React.useState([
    { key: 'first', title: 'Próximas' },
    { key: 'second', title: 'Completadas' },
    { key: 'third', title: 'No Pagadas' }
  ]);

  const [routesMedic] = React.useState([
    { key: 'first', title: 'Próximas' },
    { key: 'second', title: 'Completadas' },
  ]);

  const getData = async () => {
    try {
      let value = await AsyncStorage.getItem('userInfo')
      let userInfo = (JSON.parse(value))
      setUserRole(userInfo.userRole)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: COLORS.white,
      }}
      renderLabel={({ route, focused }) => (
        <Text style={[{
          color: focused ? COLORS.primary : "gray",
          fontSize: 16,
          fontFamily: "semiBold"
        }]}>
          {route.title}
        </Text>
      )}
    />
  )

  /**
  * render header
  */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Image
              source={images.premedLogo}
              resizeMode='contain'
              style={styles.logoIcon}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: COLORS.greyscale900
          }]}>
            Mis Citas
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.moreIcon, {
              tintColor: COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {renderHeader()}
        <TabView
          navigationState={{ index, routes: userRole == "Medic"? routesMedic : routesPatient }}
          renderScene={userRole == "Medic"? renderMedicScene :  renderPatientScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
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
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 16
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logoIcon: {
    height: 24,
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.black,
    marginLeft: 16
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
})

export default Appointment