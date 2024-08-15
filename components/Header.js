import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SIZES, COLORS, icons, images } from '../constants';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.white
    }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}>
        <Image
          source={icons.back}
          resizeMode='contain'
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Image
        source={images.premedLogo}
        resizeMode='contain'
        style={styles.logo}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: COLORS.black
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: "#2F55A4"

  },
  logo: {
    width: 50,
    height: 50,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
})

export default Header