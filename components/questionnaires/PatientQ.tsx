import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Controller,
  useForm,
  SubmitErrorHandler,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { COLORS, SIZES, icons, images, FONTS } from '../../constants';

export default function PatientQ({ ...props }) {
  const [ethnicsFocus, setEthnicsFocus] = useState<boolean>(false);
  const [focus, setFocus] = useState<number | null>(null);

  const genderData: { label: string; value: string }[] = [
    { label: "Masculino", value: "male" },
    { label: "Femenino", value: "female" },
    { label: "Otro", value: "other" },
  ];
  const ethnicsData: { label: string; value: string }[] = [
    { label: "Caucásica", value: "caucasian" },
    { label: "Afro-americana", value: "afroamerican" },
    { label: "Hispana", value: "hispanic" },
    { label: "Asiatica", value: "asian" },
    { label: "Otro", value: "other" },
  ];

  const yesNoData: { label: string; value: string }[] = [
    { label: "Sí", value: "Sí" },
    { label: "No", value: "No" },
  ];

  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        justifyContent: "center",

        marginVertical: 15,
      }}
    >
      {/* pregunta 1 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, marginTop:20}}>
            {props.form.errors.smoker && (
              <Text style={props.styles.errorText}>
                {props.form.errors.smoker.message}
              </Text>
            )}
          <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Fuma el paciente (fumador en la actualidad) o ha fumado alguna
              vez (exfumador)?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
          </View>
          </View>
        )}
        name="smoker"
      />
      {/* pregunta 2 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.diabetes && (
              <Text style={props.styles.errorText}>
                {props.form.errors.diabetes.message}
              </Text>
            )}
          <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Padece el paciente diabetes (tipo 1 o 2)?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
          </View>
          </View>
        )}
        name="diabetes"
      />

      {/* pregunta 3 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
        <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.eac && (
              <Text style={props.styles.errorText}>
                {props.form.errors.eac.message}
              </Text>
            )}
          <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>¿Padece el paciente EAC?</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
          </View>
        </View>
        )}
        name="eac"
      />

      {/* pregunta 4 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.embolia && (
              <Text style={props.styles.errorText}>
                {props.form.errors.embolia.message}
              </Text>
            )}
          <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Ha sufrido el paciente un IM, una embolia o AIT en algún momento
              de su vida?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
          </View>
        </View>
        )}
        name="embolia"
      />

      {/* pregunta 5 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.erc && (
              <Text style={props.styles.errorText}>
                {props.form.errors.erc.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Le han diagnosticado al paciente ERC o insuficiencia renal en
              general?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="erc"
      />

      {/* pregunta 6 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.epoc && (
              <Text style={props.styles.errorText}>
                {props.form.errors.epoc.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Le han diagnosticado al paciente EPOC?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="epoc"
      />

      {/* pregunta 7 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.lipids && (
              <Text style={props.styles.errorText}>
                {props.form.errors.lipids.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Sufre el paciente de niveles de lípidos (lipoproteínas)
              anormalmente elevados?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="lipids"
      />

      {/* pregunta 8 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.hbp && (
              <Text style={props.styles.errorText}>
                {props.form.errors.hbp.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>¿Es el paciente hipertenso?</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="hbp"
      />

      {/* pregunta 9 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.weight && (
              <Text style={props.styles.errorText}>
                {props.form.errors.weight.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Sufre el paciente sobrepeso o presenta un peso por debajo de lo
              normal?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="weight"
      />

      {/* pregunta 10 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.pain && (
              <Text style={props.styles.errorText}>
                {props.form.errors.pain.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Informa el paciente de que sufre dolor al realizar cualquier tipo
              de ejercicio físico, incluso caminar? ¿Remite el dolor cuando el
              paciente se toma un descanso? ¿Dónde (en qué parte del cuerpo) se
              localiza el dolor?{" "}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="pain"
      />

      {/* pregunta 11 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.limb && (
              <Text style={props.styles.errorText}>
                {props.form.errors.limb.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Informa el paciente de una sensación de frío en una o varias
              piernas, o en los pies, a pesar de notar una sensación de calidez
              (en otras partes del cuerpo) o de sentirse cómodo de cualquier
              otra forma a la temperatura ambiente actual?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="limb"
      />

      {/* pregunta 12 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.skin && (
              <Text style={props.styles.errorText}>
                {props.form.errors.skin.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Informa el paciente de que su piel presenta un color y una
              textura anormales, y de que tiene las uñas de los pies deformes?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="skin"
      />

      {/* pregunta 13 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.scar && (
              <Text style={props.styles.errorText}>
                {props.form.errors.scar.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Presenta el paciente cualquier tipo de herida u otro daño en el
              tejido de sus piernas/pies que cicatrice muy lentamente o no
              parezca cicatrizar en absoluto?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="scar"
      />

      {/* pregunta 14 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.disfunction && (
              <Text style={props.styles.errorText}>
                {props.form.errors.disfunction.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Padece el paciente disfunción eréctil?{" "}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="disfunction"
      />

      {/* pregunta 15 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{marginBottom:20, width:"100%"}}>
            {props.form.errors.eap && (
              <Text style={props.styles.errorText}>
                {props.form.errors.eap.message}
              </Text>
            )}
            <View style={[props.styles.inputContainer, {alignItems:"center"}]}>
            <Text style={props.styles.bottomLeft}>
              ¿Sabe el paciente si alguno de sus familiares ha padecido o padece
              actualmente EAP?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="Sí"
                status={value === 'Sí' ? 'checked' : 'unchecked'}
                onPress={() => onChange('Sí')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>Sí</Text>
              <RadioButton
                value="No"
                status={value === 'No' ? 'checked' : 'unchecked'}
                onPress={() => onChange('No')}
                color="#005AC1"
              />
              <Text style={props.styles.bottomLeft}>No</Text>
            </View>
            </View>
          </View>
        )}
        name="eap"
      />
      {/* ethnics and gender */}
      <Controller
        control={props.form.control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Dropdown
              style={[
                props.styles.inputBtn,{marginBottom:20}
              ]}
              placeholderStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
              selectedTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
              data={ethnicsData}
              itemContainerStyle={props.styles.inputContainer}
              containerStyle={props.styles.inputContainer}
              itemTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!ethnicsFocus ? "Seleccione su Etnia" : "Etnia sin Seleccionar"}
              //searchPlaceholder="Buscar..."
              value={value}
              onFocus={() => setEthnicsFocus(true)}
              onBlur={onBlur}
              onChange={(selectedItem) => {
                onChange(selectedItem.value);
              }}
              renderLeftIcon={() => (
                <Ionicons
                  name="person-circle-outline"
                  color="#BCBCBC"
                  size={24}
                  style={{marginRight:15}}
                />
              )}
            />
          </>
        )}
        name="ethnics"
      />
      <Controller
        control={props.form.control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Dropdown
              style={[
                props.styles.inputBtn,
              ]}
              placeholderStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
              selectedTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
              data={genderData}
              itemContainerStyle={props.styles.inputContainer}
              containerStyle={props.styles.inputContainer}
              itemTextStyle={{fontFamily:"regular", color: COLORS.black, fontSize:14}}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!focus ? "Seleccione su género" : "Género sin seleccionar"}
              //searchPlaceholder="Buscar..."
              value={value}
              onFocus={() => setFocus(14)}
              onBlur={onBlur}
              onChange={(selectedItem) => {
                onChange(selectedItem.value);
              }}
              renderLeftIcon={() => (
                <Ionicons
                  name="person-circle-outline"
                  color="#BCBCBC"
                  size={24}
                  style={{marginRight:15}}
                />
              )}
            />
            
          </>
        )}
        name="gender"
      />
    </View>
  );
}

