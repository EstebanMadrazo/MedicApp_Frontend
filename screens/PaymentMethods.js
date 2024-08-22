import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import PaymentMethodItem from '../components/PaymentMethodItem';
import Button from '../components/Button';

// Payment Methods Connected
const PaymentMethods = ({ route, navigation }) => {
  const {appointmentInfo} = route.params
  const [selectedItem, setSelectedItem] = useState(null);
  //console.log(selectedItem)
  // Handle checkbox
  const handleCheckboxPress = (itemTitle) => {
    if (selectedItem === itemTitle) {
      // If the clicked item is already selected, deselect it
      setSelectedItem(null);
    } else {
      // Otherwise, select the clicked item
      setSelectedItem(itemTitle);
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="Métodos de Pago"/>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, {
            color: COLORS.greyscale900
          }]}>
            Selecciona el método de pago que deseas usar para pagar la cita.
          </Text>
          <PaymentMethodItem
            checked={selectedItem === 'Paypal'}
            onPress={() => handleCheckboxPress('Paypal')}
            title="Paypal"
            icon={icons.paypal}
          />
          <PaymentMethodItem
            checked={selectedItem === 'CreditCard'}
            onPress={() => handleCheckboxPress('CreditCard')}
            //title="•••• •••• •••• •••• 4679"
            title="Tarjeta de Crédito"
            icon={icons.creditCard}
          />
          {/* <Button
            title="Add New Card"
            onPress={() => { navigation.navigate("AddNewCard") }}
            style={{
              width: SIZES.width - 32,
              borderRadius: 32,
              backgroundColor: COLORS.tansparentPrimary,
              borderColor: COLORS.tansparentPrimary
            }}
            textColor={COLORS.primary}
          /> */}
        </ScrollView>
        <Button
          title="Continuar"
          filled
          style={styles.continueBtn}
          onPress={() => { 
            navigation.navigate(
              "ReviewSummary", 
              {appointmentInfo: appointmentInfo, paymentMethod: selectedItem}
            )  
          }}
          color={selectedItem === null? COLORS.disabled : COLORS.primary}
          disabled={selectedItem === null? true : false}
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
  title: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    marginVertical: 32
  },
  continueBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: SIZES.width - 32,
    borderRadius: 32,
  }
})

export default PaymentMethods