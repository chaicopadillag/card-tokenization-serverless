import { APIGatewayProxyHandler } from 'aws-lambda';
import { saveCardAndGenerateToken } from '../services';
import { HttpStatus, message } from '../utils/constants';

/**
 * Handler para la solicitud de creación de token.
 * @param event El objeto de evento de la solicitud.
 * @returns Un objeto de respuesta HTTP que contiene el token generado o un mensaje de error interno.
 */

export const createTokenHandler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parsea el cuerpo de la solicitud como JSON
    const requestBody = JSON.parse(event.body);

    // Extrae la autorización del encabezado de la solicitud
    const authorization = event.headers['authorization'] || '';

    // Llama a la función para guardar la tarjeta y generar el token
    return saveCardAndGenerateToken(authorization, requestBody);
  } catch (error) {
    // Manejo de errores: en caso de error, devuelve un mensaje de error interno
    console.log(error);
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: message.internalServerError }),
    };
  }
};
