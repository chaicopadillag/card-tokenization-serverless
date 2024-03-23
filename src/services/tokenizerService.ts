import { APIGatewayProxyResult } from 'aws-lambda';
import { CardI } from 'interfaces';
import createRedisClient from '../database/redisConfig';
import Card from '../models/card';
import { generateUniqueToken, validateCard, validatePk } from '../utils';
import { HttpStatus, message } from '../utils/constants';

/**
 * Guarda los datos de una tarjeta en la base de datos y genera un token único asociado.
 * @param authorization El encabezado de autorización de la solicitud.
 * @param reqBody Los datos de la tarjeta a guardar.
 * @returns Un objeto de respuesta HTTP que contiene el token generado o mensajes de error.
 */
export const saveCardAndGenerateToken = async (
  authorization: string,
  reqBody: CardI,
): Promise<APIGatewayProxyResult> => {
  try {
    // Aplicamos desestructure a los campos de la solicitud de tarjeta del body
    const { card_number, cvv, email, expiration_month, expiration_year } =
      reqBody;

    // Crea un nuevo objeto de tarjeta con los campos limpios y formateados
    const newCard: CardI = {
      card_number: card_number.trim().replaceAll(/\s/g, ''),
      cvv: cvv.trim(),
      email: email.trim(),
      expiration_month: Number(expiration_month),
      expiration_year: Number(expiration_year),
    };

    // Valida la clave de autorización
    if (!validatePk(authorization)) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        body: JSON.stringify({
          message: message.unAuthorized,
        }),
      };
    }

    // Valida los datos de la tarjeta
    const errorFields = validateCard(newCard);
    if (errorFields.length > 0) {
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        body: JSON.stringify(errorFields),
      };
    }
    // Crea un registro de tarjeta en la base de datos
    await Card.create(newCard);

    // Nos conectamos al cliente de Redis
    const redisClient = await createRedisClient();

    // Genera un token único
    const token = await generateUniqueToken();

    // Crea un objeto JSON con el token y los datos de la tarjeta
    const card = JSON.stringify({ token, card: { ...newCard } });

    // Guarda los datos de la tarjeta en Redis con una expiración de 900 segundos (15 minutos)
    await redisClient.set(token, card, { EX: 900 });

    // Devuelve un objeto de respuesta HTTP con estado OK y el token generado
    return {
      statusCode: HttpStatus.CREATED, // Código de estado HTTP 201 (Creado)
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    // Manejo de errores: en caso de error, registra el error y devuelve un mensaje de error interno
    console.log('Errror en::', error.stack);
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: message.internalServerError }),
    };
  }
};
