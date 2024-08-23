import { format, validate } from 'validate.js';

export const validateString = (id,value)=>{
    const constraints = {
        presence: {
            allowEmpty: false,
            message: "El valor no puede estar en blanco."
        }
    };

    if(value !== ""){
        constraints.format = {
            pattern: ".+",
            flags: "i",
            message: "El valor no puede estar en blanco."
        }
    }

    const validationResult = validate({[id]: value},{[id]: constraints});
    return validationResult && validationResult[id]
}

export const validateEmail = (id,value)=>{
    const constraints ={
        presence : {
            allowEmpty: false,
            message: "Este campo es obligatorio"
        }
    };

    if(value !== ""){
        constraints.email = true
    };

    const validationResult = validate({[id]: value},{[id]: constraints});
    return validationResult && validationResult[id]
}

export const validatePassword = (id,value)=>{
    const constraints = {
        presence : {
            allowEmpty:false
        }
    };

    if(value !== ""){
        constraints.length = {
            minimum: 6,
            message: "debe tener al menos 6 caracteres"
        }
    };

    const validationResult = validate({ [id]: value}, {[id]: constraints});
    return validationResult && validationResult[id];
}

export const validateCreditCardNumber = (id, value) => {
    const constraints = {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /^(?:\d{4}-){3}\d{4}$|^\d{16}$/,
        message: "Invalid credit card number.",
      },
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id];
  };
  
export const validateCVV = (id, value) => {
    const constraints = {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /^[0-9]{3,4}$/,
        message: "Invalid CVV.",
      },
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id];
  };
  
export const validateExpiryDate = (id, value) => {
    const constraints = {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: (/[^0-9]/g, ''),
        message: "Invalid expiry date. Please use MM/YY format.",
      },
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id];
  };

  export const validatePhoneNumberLength = (id, value) => {
    const constraints = {
      presence: {
        allowEmpty: false,
        message:"No puede ser vacio "
      },
      length:{
        is:10,
        message:"Maximo de 10 digitos "
      },
      format:{
        pattern: /[0-9]{1,10}$/,
        message: "Unicamente numeros "
      }
    };
    console.log(id, value)
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult && validationResult[id];
  };