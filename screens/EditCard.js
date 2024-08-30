import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { commonStyles } from '../styles/CommonStyles';
import { COLORS, SIZES } from '../constants';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';
import Button from '../components/Button';
import Header from '../components/Header';
import Card from '../components/Card';
import { useRoute } from '@react-navigation/native';

const initialState = {
    inputValues: {
        creditCardHolderName: '',
        creditCardNumber: '',
        creditCardExpiryDate: '',
        cvv: ''
    },
    inputValidities: {
        creditCardHolderName: false,
        creditCardNumber: false,
        creditCardExpiryDate: false,
        cvv: false
    },
    formIsValid: false,
};

const EditCard = ({ navigation }) => {
    const route = useRoute();
    const { card } = route.params || {}
    console.log(card)
    const [error, setError] = useState(null);
    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    );

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error]);

    const renderPaymentForm = () => {
        return (
            <View style={{ marginVertical: 22 }}>
                <Card
                    containerStyle={styles.card}
                    number="•••• •••• •••• ••••"
                />
                <View style={{ marginTop: 12 }}>
                    <Text style={[commonStyles.inputHeader, {
                        color: COLORS.black
                    }]}>Titular</Text>
                    <Input
                        id="creditCardHolderName"
                        value={`${card?.given_name} ${card?.family_name}`}
                        errorText={formState.inputValidities['creditCardHolderName']}
                        placeholder="Titular"
                        placeholderTextColor={COLORS.black}
                        editable={false}
                    />
                </View>
                <View style={{ marginTop: 12 }}>
                    <Text style={[commonStyles.inputHeader, {
                        color: COLORS.black
                    }]}>Cuenta CLABE</Text>
                    <Input
                        id="creditCardNumber"
                        caretHidden={true}
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['creditCardNumber']}
                        
                        placeholderTextColor={COLORS.black}
                        value={formState['creditCardNumber']}
                    />
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <View style={{ width: (SIZES.width - 32) / 2 - 10 }}>
            <Text style={[commonStyles.inputHeader, {
              color: COLORS.black
            }]}>Expire Date</Text>
            <Input
              id="creditCardExpiryDate"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['creditCardExpiryDate']}
              placeholder="mm/yyyy"
              placeholderTextColor={COLORS.black}
            />
          </View>
          <View style={{ width: (SIZES.width - 32) / 2 - 10 }}>
            <Text style={[commonStyles.inputHeader, {
              color: COLORS.black
            }]}>CVV</Text>
            <Input
              id="cvv"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['cvv']}
              placeholder="..."
              placeholderTextColor={COLORS.black}
            />
          </View>
        </View> */}
            </View>
        )
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, margin: 16 }}>
                <Header title="Editar CLABE" />
                {renderPaymentForm()}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: SIZES.width - 32
                    }}>
                    <Button
                        filled
                        title="Editar CLABE"
                        onPress={() => navigation.goBack()}
                        style={styles.addBtn}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    card: {
        width: SIZES.width - 32,
        borderRadius: 16,
        marginVertical: 6
    },
    addBtn: {
        borderRadius: 32
    }
})

export default EditCard