import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import Button from "../Button";
import RedButton from "../RedButton";
import { COLORS, SIZES, icons, images, FONTS } from '../../constants';
import Input from "../Input";

export default function RepQ({ ...props }) {
  console.log(props.form.fields)
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
          <>
            <Input
              onInputChanged={(id:any, text:any)=> onChange(text)}
              errorText={props.form.errors?.company?.message}
              autoCapitalize="none"
              id="repeatPassword"
              onBlur={onBlur}
              placeholder="Nombre de la Empresa Farmacéutica"
              value={value}
              placeholderTextColor={COLORS.black}
              icon={icons.home}
            />
          </>
        )}
        name="company"
      />
      {/* pregunta 2 */}
      <View style={styles.productsCard}>
        <View style={{ marginVertical: 15, width: "100%" }}>
          {props.form.fields.map((item:any, index: number) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              key={item.id}
            >
            <Controller
              control={props.form.control}
              rules={{
                required: "Campo obligatorio",
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  onInputChanged={(id:any, text:any)=> {onChange(text);
                  props.form.setValue(`products[${index}].name`, text)
                  }}
                  errorText={props.form.errors?.company?.message}
                  autoCapitalize="none"
                  id="productName"
                  placeholder="Nombre del producto"
                  value={value}
                  placeholderTextColor={COLORS.black}
                  icon={icons.box}
                />
              )}
              name={`products[${index}].name`}
              defaultValue=""
            />
              <Controller
                control={props.form.control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onInputChanged={(id:any, text:any)=> {onChange(text);
                    props.form.setValue(`products[${index}].description`, text);
                  }}
                  errorText={props.form.errors?.company?.message}
                  autoCapitalize="none"
                  id="Description"
                  placeholder="Añadir descripción"
                  value={value}
                  placeholderTextColor={COLORS.black}
                  icon={icons.content}
                />
                )}
                name={`products[${index}].description`}
                defaultValue=""
              />
              <Button
                filled
                title="Eliminar producto"
                onPress={() => props.form.remove(index)}
                style={styles.button}
                color={COLORS.red}
                //textColor={props.styles.bottomLeft}
              />
            </View>
          ))}
        </View>
        <Button
          filled
          title="Agregar producto"
          onPress={() => props.form.append({ name: "", description: "" })}
          style={styles.button}
          color={COLORS.greyscale600}
          //textColor={props.styles.bottomLeft}
        />
      </View>

      {/* pregunta 3 */}
      <Controller
        control={props.form.control}
        rules={{
          required: "Campo obligatorio",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={props.styles.text}>
              Área Geográfica de Responsabilidad
            </Text>
            {props.form.errors.area && (
              <Text style={props.styles.errorText}>
                {props.form.errors.area.message}
              </Text>
            )}
            <TextInput
              placeholder="Respuesta"
              placeholderTextColor={"gray"}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={props.styles.input}
            />
          </>
        )}
        name="area"
      />
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
  productsContent: {
    fontFamily: "pop",
    color: "#005AC1",
    fontSize: 14,
    textAlign: "center",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "85%",
    marginVertical: 12,
  },
  productsCard: {
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    marginVertical: 12,
    paddingHorizontal:20,
    borderColor:COLORS.greyscale500
  },
})