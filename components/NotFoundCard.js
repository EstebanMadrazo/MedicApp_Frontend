import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { COLORS, illustrations } from '../constants';

const NotFoundCard = ({...props}) => {

  return (
    <View style={[styles.container, props?.containerStyle]}>
      <Image
        source={props.image? props.image : illustrations.notFound}
        resizeMode='contain'
        style={[styles.illustration, props?.imageStyle]}
      />
      <Text style={[styles.title, props?.titleStyle, {
        color: COLORS.black
      }]}>{props.title? props.title : "Sin resultados"}</Text>
      <Text style={[styles.subtitle, {
        color: COLORS.black
      }]}>
        {props.text? props.text : "Lo sentimos, la palabra clave que ha introducido no se encuentra, por favor, compruebe de nuevo o busque con otra palabra clave."}
      </Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  illustration: {
    width: 340,
    height: 250,
    marginVertical: 32
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 16,
    textAlign:"center"
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center"
  }
})

export default NotFoundCard