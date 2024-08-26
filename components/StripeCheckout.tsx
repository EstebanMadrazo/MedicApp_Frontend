import { PaymentIntent, useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
//import { router } from "expo-router";
import axios from "axios";
import Button from "./Button";
import { SIZES } from "../constants";


export default function CheckoutScreen({amount,hp,appointment_uuid, setSuccessPay, setFailurePay }: {amount:string,hp:string,appointment_uuid:string, setSuccessPay: any, setFailurePay: any}) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    
    const fetchPaymentSheetParams = async () => {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payments/stripe-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            amount: amount,
            hp:hp,
            appointment_uuid: appointment_uuid,
        })
      });
      const resp = await response.json();
      console.log(resp)
      const { paymentIntent, ephemeralKey, customer } = resp
  
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    };
  
    const initializePaymentSheet = async () => {
      const {
        paymentIntent
      } = await fetchPaymentSheetParams();

      console.log('INIT PAYSHEET: ',paymentIntent)
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Patient',
        }
      });
      if (!error) {
        setLoading(true);
      }
    };
  
    const openPaymentSheet = async () => {
        const init = await initializePaymentSheet();
        //console.log("INIT: ", init)
        const { error } = await presentPaymentSheet();
        console.log("ERROR: ", error)
        if (error) {
          setFailurePay(true)
          setLoading(false)
          //await deleteAppointment(appointment_uuid)
          //console.log("ERROR: ", error)
        } else {
          setSuccessPay(true)
          //router.replace('/(app)/(tabs)/Schedule')
        }
  
    };

    const deleteAppointment = async (uuid: string) => {
      try{
        const responseInfo = await axios(`${process.env.EXPO_PUBLIC_API_URL}/appointments/deleteAppointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          params:{
            uuid:uuid
          },
        })
      }catch(e:any){
        console.log('error',e.response.data)
      }
    }

    useEffect(() => {
      //initializePaymentSheet();
    }, []);
  
    return (
        <>
          <Button
            title="Pagar Cita"
            onPress={()=> openPaymentSheet()}
            filled
            style={styles.continueBtn}
            disabled={loading}
            isLoading={loading}
          />
        </>
    );
}

const styles =  StyleSheet.create({
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
    
    
})
  