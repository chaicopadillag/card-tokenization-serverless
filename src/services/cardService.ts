/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIGatewayProxyResult } from 'aws-lambda';
import createRedisClient from '../database/redisConfig';
import { validatePk } from '../utils';
import { HttpStatus, message } from '../utils/constants';
/**
 * Obtiene los datos de una tarjeta utilizando su token.
 * @param authorization El encabezado de autorización de la solicitud.
 * @param token El token de la tarjeta.
 * @returns Un objeto de respuesta HTTP que contiene los datos de la tarjeta o un mensaje de error.
 */

export const getCardByToken = async (
  authorization: string,
  token: string,
): Promise<APIGatewayProxyResult> => {
  try {
    // Valida la clave de autorización
    if (!validatePk(authorization)) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED, // Código de estado HTTP 401 (No autorizado)
        body: JSON.stringify({
          message: message.unAuthorized,
        }),
      };
    }

    // Se conecta la cliente de Redis
    const redisClient = await createRedisClient();
    // Obtiene los datos de la tarjeta desde Redis utilizando el token
    const cardString = await redisClient.get(token);

    // Si no se encontraron datos de tarjeta para el token proporcionado, devuelve un mensaje de tarjeta no encontrada
    if (!cardString) {
      return {
        statusCode: HttpStatus.NOT_FOUND, // Código de estado HTTP 404 (No encontrado)
        body: JSON.stringify({
          message: message.notFoundCard,
        }),
      };
    }

    // Parsea los datos de la tarjeta como JSON
    const {
      card: { cvv: _, ...card_ },
    } = JSON.parse(cardString);

    // Devuelve los datos de la tarjeta sin el CVV en un objeto de respuesta HTTP con estado OK
    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify({ card: card_ }),
    };
  } catch (error) {
    // Manejo de errores: en caso de error, registra el error y devuelve un mensaje de error interno
    console.log('Errror en::', error);

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: message.internalServerError }),
    };
  }
};
