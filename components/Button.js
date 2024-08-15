import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary
    const outlinedBgColor = COLORS.white
    const bgColor = props.filled ? filledBgColor : outlinedBgColor
    const textColor = props.filled
        ? props.textColor? props.textColor : COLORS.white || 
        props.textColor : props.textColor || COLORS.primary
    const isLoading = props.isLoading || false
    const disabled = props.disabled? props.disabled : false
    const fontSize = props.fontSize? props.fontSize : 18
    const fontFamily = props.fontFamily? props.fontFamily : "semiBold"

    return (
        <TouchableOpacity
            style={{
                ...styles.btn,
                ...{ backgroundColor: bgColor },
                ...props.style,
            }}
            onPress={props.onPress}
            disabled = {disabled}
        >
            {isLoading && isLoading == true ? (
                <ActivityIndicator size={35} color={props.filled? COLORS.white: COLORS.primary} />
            ) : (
                <Text style={{ fontSize: fontSize, fontFamily: fontFamily, ...{ color: textColor } }}>
                    {props.title}
                </Text>
            )}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 52
    },
})

export default Button