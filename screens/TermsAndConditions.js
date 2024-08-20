import { Text, View, StyleSheet, ScrollView } from "react-native";
import { COLORS, SIZES, icons, images, FONTS } from '../constants';
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const items = {
  "1. Servicio Ofrecido":
    "Nuestra aplicación proporciona servicios de agendas médicas prepagadas, permitiéndote programar consultas médicas previamente pagadas.",
  "2. Uso Aceptable":
    "Debes utilizar la aplicación de manera ética y conforme a las leyes vigentes en la República Mexicana. No está permitido el uso de la aplicación con fines fraudulentos o ilegales.",
  "3. Registro":
    "Para acceder a nuestros servicios, es necesario registrarse en la aplicación. Debes proporcionar información precisa y actualizada durante el proceso de registro.",
  "4. Pagos":
    "Los pagos realizados a través de la aplicación son prepagos por servicios médicos. Te comprometes a abonar el monto correspondiente antes de acceder a la consulta médica.",
  "5. Cancelaciones y reembolsos":
    "Las cancelaciones y reembolsos están sujetos a nuestras políticas específicas, las cuales podrás consultar en la sección correspondiente de la aplicación.",
  "6. Responsabilidades":
    "Nos esforzamos por brindar un servicio de calidad, pero no podemos garantizar la disponibilidad de todos los profesionales médicos en todo momento.",
  "7. Privacidad":
    "Respetamos tu privacidad. La información personal proporcionada será tratada de acuerdo con nuestra política de privacidad, la cual puedes revisar en la sección correspondiente de la aplicación.",
  "8. Modificaciones en los Términos":
    "Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las actualizaciones serán notificadas a través de la aplicación.",
  "9. Terminación del Servicio":
    "Nos reservamos el derecho de suspender o terminar tu acceso a la aplicación si violas estos términos y condiciones.",
  "10. Ley Aplicable":
    "Estos términos y condiciones se rigen por las leyes de la República Mexicana.",
};

const itemsArray = Object.entries(items).map(([clave, valor]) => ({
  clave,
  valor,
}));

const TermsAndConditions = ({navigation}) =>{
    return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <Header title={'Premed Meeting'}/>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>
            Términos y Condiciones
          </Text>
          <Text style={styles.paragraph}>
            Bienvenido/a a nuestra aplicación de agendas médicas prepagadas.
            Antes de utilizar nuestros servicios, te pedimos que leas
            detenidamente los siguientes términos y condiciones. Al acceder y
            utilizar nuestra aplicación, aceptas cumplir con estos términos y
            condiciones.
          </Text>
          {itemsArray.map((item, index) => (
            <View key={index}>
              <Text style={styles.bulletPoint}>{item.clave}:</Text>
              <Text style={styles.bulletItem}>{item.valor}</Text>
            </View>
          ))}
          <Text style={styles.paragraph}>
            Al utilizar nuestra aplicación, aceptas estar sujeto/a a estos
            términos y condiciones. Si tienes alguna pregunta o inquietud, por
            favor contáctanos a través de los canales proporcionados en la
            aplicación. ¡Gracias por confiar en nosotros para tus necesidades de
            agendas médicas prepagadas!
          </Text>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  title: {
    fontFamily: "bold",
    color: "#005AC1",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
  },
  bulletPoint: { fontFamily: "bold", fontSize: 20 },
  bulletItem: {
    fontFamily: "regular",
    fontSize: 12,
    marginHorizontal:15,
  },
  paragraph: {
    fontFamily: "regular",
    fontSize: 14,
    marginVertical: 15,
    textAlign:"auto"
  },
});

export default TermsAndConditions;
