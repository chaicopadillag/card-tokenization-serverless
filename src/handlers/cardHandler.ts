import { APIGatewayProxyHandler } from 'aws-lambda';
import { getCardByToken } from '../services';
import { HttpStatus, message } from '../utils/constants';

/**
 * Handler para la solicitud GET de una tarjeta.
 * @param event El objeto de evento de la solicitud.
 * @returns Un objeto de respuesta HTTP que contiene la tarjeta solicitada o un mensaje de error interno.
 */
export const getCardHandler: APIGatewayProxyHandler = async (event) => {
  try {
    // Extrae la autorización del encabezado de la solicitud
    const authorization = event.headers['authorization'] || '';

    // Extrae el token del parámetro de la cadena de consulta de la solicitud
    const { token } = event.queryStringParameters;

    return getCardByToken(authorization, token);
  } catch (error) {
    // Manejo de errores: en caso de error, devuelve un mensaje de error interno
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: message.internalServerError }),
    };
  }
};
