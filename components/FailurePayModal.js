import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import Button from "./Button";

const FailurePayModal = ({ modalVisible, setModalVisible}) => {
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <TouchableWithoutFeedback
                onPress={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalSubContainer, {
                        backgroundColor: COLORS.white,
                    }]}>
                        <View style={styles.backgroundIllustration}>
                            <Image
                                source={illustrations.background}
                                resizeMode='contain'
                                style={styles.modalIllustration}
                            />
                            <Image
                                source={icons.calendar5}
                                resizeMode='contain'
                                style={styles.editPencilIcon}
                            />
                        </View>
                        <Text style={styles.modalTitle}>Pago no procesado!</Text>
                        <Text style={[styles.modalSubtitle, {
                            color: COLORS.black,
                        }]}>
                            No se pudo procesar su pago con éxito, inténtelo nuevamente
                        </Text>
                        <Button
                            title="Cerrar"
                            filled
                            onPress={() => {
                                setModalVisible(false)
                            }}
                            style={styles.successBtn}
                            color={COLORS.red}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}


const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white
    },
    title: {
        fontSize: 18,
        fontFamily: "medium",
        color: COLORS.greyscale900,
        textAlign: "center",
        marginVertical: 64
    },
    codeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
        justifyContent: "center"
    },
    code: {
        fontSize: 18,
        fontFamily: "medium",
        color: COLORS.greyscale900,
        textAlign: "center"
    },
    time: {
        fontFamily: "medium",
        fontSize: 18,
        color: COLORS.redRose
    },
    button: {
        borderRadius: 32,
        marginVertical: 72
    },
    center: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 144
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.red,
        textAlign: "center",
        marginVertical: 12
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: "regular",
        color: COLORS.black,
        textAlign: "center",
        marginVertical: 12
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    modalSubContainer: {
        height: 520,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22,
        tintColor:COLORS.red
    },
    successBtn: {
        width: "100%",
        marginTop: 12,
        borderRadius: 32,
        borderColor: COLORS.redRose
    },
    receiptBtn: {
        width: "100%",
        marginTop: 12,
        borderRadius: 32,
        backgroundColor: COLORS.tansparentPrimary,
        borderColor: COLORS.tansparentPrimary
    },
    editPencilIcon: {
        width: 54,
        height: 54,
        tintColor: COLORS.white,
        zIndex: 99999,
        position: "absolute",
        top: 50,
        left: 52,
    },
    backgroundIllustration: {
        height: 150,
        width: 150,
        marginVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        zIndex: -999
    },
})

export default FailurePayModal