import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { getCardByToken } from '../../services';
import { HttpStatus, message } from '../../utils/constants';
import { getCardHandler } from '../cardHandler';

jest.mock('../../services', () => ({
  getCardByToken: jest.fn(),
}));

describe('getCardHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver la tarjeta solicitada', async () => {
    // Configuración del evento de solicitud simulada
    const event: APIGatewayProxyEvent = {
      headers: { authorization: 'Bearer pk_hpY6STrYK4geSSa6ZhR_JAmREVSRX0' },
      queryStringParameters: { token: 'ncyLmU_9v6iRHvd' },
    } as unknown as APIGatewayProxyEvent;

    // Configuración del comportamiento del mock getCardByToken
    (getCardByToken as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      body: JSON.stringify({
        card: {
          card_number: '4111 1111 1111 1111',
          cvv: '123',
          expiration_month: 12,
          expiration_year: 2024,
          email: 'code@gmail.com',
        },
      }),
    });

    const result: any = await getCardHandler(
      event,
      {} as Context,
      {} as Callback,
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });

  it('debería manejar correctamente los errores', async () => {
    const event: APIGatewayProxyEvent = {
      headers: { authorization: '' },
      queryStringParameters: { token: 'invalidToken' },
    } as unknown as APIGatewayProxyEvent;

    (getCardByToken as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const result: any = await getCardHandler(
      event,
      {} as Context,
      {} as Callback,
    );

    expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.body).toEqual(
      JSON.stringify({ message: message.internalServerError }),
    );
  });
});
