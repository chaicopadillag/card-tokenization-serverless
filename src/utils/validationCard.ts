import { CardI } from 'interfaces';
import { ErrorsFields } from './interfaces';

/**
 * Valida el número de tarjeta utilizando el algoritmo de Luhn.
 * @param cardNumber El número de tarjeta a validar.
 * @returns true si el número de tarjeta es válido, false en caso contrario.
 */
const validateCardNumber = (cardNumber: string): boolean => {
  // Eliminar los espacios en blanco y guiones del número de tarjeta
  const trimmedCardNumber = cardNumber.replaceAll(/\s/g, '');

  let sum = 0;
  let double = false;
  // Iteramos sobre cada dígito del número de tarjeta, comenzando desde el último
  for (let i = trimmedCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(trimmedCardNumber[i], 10);
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    double = !double;
  }
  // La tarjeta es válido si la suma total es divisible por 10
  return sum % 10 === 0;
};

/**
 * Valida un correo electrónico utilizando expresiones regulares.
 * @param email El correo electrónico a validar.
 * @returns true si el correo electrónico es válido, false en caso contrario.
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida el CVV (Código de Verificación de la Tarjeta) de la tarjeta.
 * @param cvv El CVV a validar.
 * @returns true si el CVV es válido, false en caso contrario.
 */
const validateCVV = (cvv: string): boolean => {
  const cvvRegex = /^[0-9]{3,4}$/;
  return cvvRegex.test(cvv);
};

/**
 * Valida el mes de expiración de la tarjeta.
 * @param expirationMonth El mes de expiración a validar.
 * @returns true si el mes de expiración es válido, false en caso contrario.
 */
const validateExpirationMonth = (expirationMonth: number): boolean => {
  return expirationMonth >= 1 && expirationMonth <= 12;
};

/**
 * Valida el año de expiración de la tarjeta.
 * @param expirationYear El año de expiración a validar.
 * @returns true si el año de expiración es válido, false en caso contrario.
 */
const validateExpirationYear = (expirationYear: number): boolean => {
  const currentYear = new Date().getFullYear();
  return expirationYear >= currentYear && expirationYear <= currentYear + 5;
};

/**
 * Valida todos los campos de la tarjeta y devuelve una lista de errores si existen.
 * @param card Los datos de la tarjeta a validar.
 * @returns Una lista de errores, si existen.
 */
export const validateCard = ({
  card_number,
  cvv,
  expiration_month,
  expiration_year,
  email,
}: CardI): ErrorsFields[] => {
  const errors: ErrorsFields[] = [];

  if (!validateCardNumber(card_number)) {
    errors.push({
      field: 'card_number',
      value: card_number,
      message: 'El número de la tarjeta proporcionada no es válido',
    });
  }

  if (!validateCVV(cvv)) {
    errors.push({
      field: 'cvv',
      value: cvv,
      message: 'El CVV de la tarjeta proporcionada no es válido',
    });
  }

  if (!validateExpirationMonth(expiration_month)) {
    errors.push({
      field: 'expiration_month',
      value: expiration_month,
      message: 'El mes de expiración de la tarjeta proporcionada no es válido',
    });
  }

  if (!validateExpirationYear(expiration_year)) {
    errors.push({
      field: 'expiration_year',
      value: expiration_year,
      message: 'El año de expiración de la tarjeta proporcionada no es válido',
    });
  }

  if (!validateEmail(email)) {
    errors.push({
      field: 'email',
      value: email,
      message: 'El correo electrónico proporcionado no es válido',
    });
  }

  return errors;
};
