import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { COLORS, illustrations } from '../constants';

const NotAvailableDayCard = () => {
  return (
    <View style={styles.container}>
      <Image
        source={illustrations.notFound}
        resizeMode='contain'
        style={styles.illustration}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: COLORS.black }]}>Sin resultados</Text>
        <Text style={[styles.subtitle, { color: COLORS.black }]}>
          Lo sentimos, el médico no tiene horario de trabajo en esta fecha
          por favor, seleccione otra fecha
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  illustration: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    height:180,
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 16
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.grayscale700,
    textAlign: "center"
  }
});

export default NotAvailableDayCard;
