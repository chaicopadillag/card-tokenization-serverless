import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';
import { saveCardAndGenerateToken } from '../../services';
import { HttpStatus, message } from '../../utils/constants';
import { createTokenHandler } from '../tokenizerCardHandler';

jest.mock('../../services', () => ({
  saveCardAndGenerateToken: jest.fn(),
}));

describe('createTokenHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería llamar a saveCardAndGenerateToken con la autorización y el cuerpo de la solicitud', async () => {
    // Configuración del evento de solicitud simulada
    const requestBody = {
      card_number: '4111 1111 1111 1111',
      cvv: '123',
      expiration_month: 12,
      expiration_year: 2024,
      email: 'code@gmail.com',
    };
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify(requestBody),
      headers: { authorization: 'Bearer pk_hpY6STrYK4geSSa6ZhR_JAmREVSRX0' },
    } as unknown as APIGatewayProxyEvent;

    // Configuración del comportamiento del mock saveCardAndGenerateToken
    const mockResponse: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ token: 'generated_token' }),
    };
    (saveCardAndGenerateToken as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Llamada a la función bajo prueba
    const result = await createTokenHandler(
      event,
      {} as Context,
      {} as Callback,
    );

    // Verificación de que saveCardAndGenerateToken fue llamada con los argumentos correctos
    expect(saveCardAndGenerateToken).toHaveBeenCalledWith(
      'Bearer pk_hpY6STrYK4geSSa6ZhR_JAmREVSRX0',
      requestBody,
    );

    // Verificación de que la respuesta es la esperada
    expect(result).toEqual(mockResponse);
  });

  it('debería manejar correctamente los errores', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({}),
      headers: { authorization: '' },
    } as unknown as APIGatewayProxyEvent;

    (saveCardAndGenerateToken as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const result = await createTokenHandler(
      event,
      {} as Context,
      {} as Callback,
    );

    expect(result).toEqual({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: message.internalServerError }),
    });
  });
});
