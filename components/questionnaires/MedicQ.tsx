import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import InvertedButton from "../InvertedButton";
import { Ionicons } from "@expo/vector-icons";
import FormData from "form-data";
import { StyleSheet } from "react-native";
import { COLORS, SIZES, icons, images, FONTS } from '../../constants';
import Button from "../Button";

export default function MedicQ({ ...props }) {
  const [uri, setUri] = useState<string>(String);
  const [IDName, setIDName] = useState<string>(String);
  const [titleName, setTitleName] = useState<string>(String);

  const selectFile = async (
    type: string,
    fileParameter: string,
    setState = (formData: FormData): void => {},
    action = (parameter: any): void => {},
    index: number = 1
  ) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: `${type}`,
      multiple: false,
    });

    console.log("Result ", result)

    const fd = new FormData();
    const assets = result.assets;
    if (!assets) return;

    const maxFileSize = 5 * 1024 * 1024; // 6.6 MB

    for (const asset of assets as any) {
      if (asset.size > maxFileSize) {
        // Mostrar un mensaje de error al usuario
        console.log(`El archivo ${asset.name} excede el tamaño máximo de 5 MB permitido.`);
        Alert.alert(
          "Error",
          `El archivo ${asset.name} excede el tamaño máximo permitido.`
        );
        return;
      }else{

      }
    }

    const file = assets[0];
    const fileObj = {
      name: 'file', //0
      uri: file.uri, //1
      type: file.mimeType, //2
      size: file.size, //3
    };
    
    console.log("FILE OBJECT ", fileObj)
    fd.append(fileParameter, fileObj as any, fileObj.name);
    setState(fd);

    //additional action
    switch (index) {
      case 0:
        action(file.name); // action(0)
        break;
      case 1:
        action(file.uri); // action(1)
        break;
      case 2:
        action(file.mimeType); // action(2)
        break;
      case 3:
        action(file.size); // action(3)
        break;
      default:
        break;
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        marginVertical: 15,
      }}
    >
      <View style={styles.uploadCard}>
              <Text style={props.styles.socialTitle}>Imagen de perfil</Text>
              {uri && <Image source={{ uri }} style={styles.image} />}
              <Button
                filled
                title="Seleccionar imagen"
                onPress={() => selectFile(
                  "image/*",
                  "profilePicture",
                  props.docs.setProfilePicture,
                  setUri,
                  1
                )}
                style={styles.button}
                color={COLORS.greyscale600}
                //textColor={props.styles.bottomLeft}
              />
      </View>

      <View style={styles.uploadCard}>
        <Text style={props.styles.socialTitle}>
          Cédula Profesional de Medicina
        </Text>
        {IDName && (
          <>
            <Ionicons
              name="document-outline"
              color={COLORS.greyscale600}
              size={100}
            />
            <Text style={props.styles.bottomLeft}>{IDName}</Text>
            
          </>
        )}
        <Button
          filled
          title="Seleccionar PDF"
          onPress={() => selectFile(
            "application/pdf",
            "professionalID",
            props.docs.setProfID,
            setIDName,
            0
          )}
          style={styles.button}
          color={COLORS.greyscale600}
        />
      </View>
      <View style={styles.uploadCard}>
        <Text style={props.styles.socialTitle}>
          Identificaci&oacute;n oficial (INE)
        </Text>
        {titleName && (
          <>
            <Ionicons
              name="document-outline"
              color={COLORS.greyscale600}
              size={100}
            />
            <Text style={props.styles.bottomLeft}>{titleName}</Text>
          </>
        )}
        <Button
          filled
          title="Seleccionar PDF"
          onPress={() =>
            selectFile(
              "application/pdf",
              "professionalTitle",
              props.docs.setProfTitle,
              setTitleName,
              0
            )}
          style={styles.button}
          color={COLORS.greyscale600}
        />
      </View>

     {/*  <View style={props.styles.productsCard}>
        <View style={{ marginVertical: 15, width: "100%" }}>
          {props.form.fields.map((item: any, index: number) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              key={item.id}
            >
              <Text style={props.styles.text}>Consultorio</Text>
              <Controller
                control={props.form.control}
                rules={{
                  required: "Campo obligatorio",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={props.styles.input}
                    placeholder="Nombre del consultorio/hospital"
                    placeholderTextColor="gray"
                    onChangeText={(text) => {
                      onChange(text);
                      props.form.setValue(`products[${index}].name`, text);
                    }}
                    value={value}
                  />
                )}
                name={`products[${index}].name`}
                defaultValue=""
              />
              <Text style={props.styles.text}>Direcci&oacute;n</Text>
              <Controller
                control={props.form.control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Añadir dirección"
                    placeholderTextColor="gray"
                    style={props.styles.input}
                    onChangeText={(text) => {
                      onChange(text);
                      props.form.setValue(`products[${index}].description`, text);
                    }}
                    value={value}
                  />
                )}
                name={`products[${index}].description`}
                defaultValue=""
              />
              <RedButton text="Eliminar consultorio" action={() => props.form.remove(index)} />
            </View>
          ))}
        </View>
        <Button
          text="Agregar consultorio"
          action={() => props.form.append({ name: "", description: "" })}
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 122,
    height: 116,
    borderRadius: 100,
  },
  uploadCard: {
    marginVertical: 12,
    width: "90%",
    height: "auto",
    alignItems: "center",
    paddingHorizontal:20,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    backgroundColor: COLORS.greyscale500,
  },
  button: {
    marginVertical: 6,
    width: "100%",
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
  },
})