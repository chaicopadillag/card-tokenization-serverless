import { HttpStatus, message } from '../../utils/constants';
import { getCardByToken } from '../cardService';

const validAuthorization = 'Bearer pk_hpY6STrYK4geSSa6ZhR_JAmREVSRX0';
const token = 'ncyLmU_9v6iRHvd';
const card = {
  card_number: '4111 1111 1111 1111',
  cvv: '123',
  expiration_month: 12,
  expiration_year: 2024,
  email: 'dev@gmail.com',
};

jest.mock('../../database/redisConfig', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    get: jest.fn((token_) => {
      if (token_ === token) {
        return Promise.resolve(
          JSON.stringify({
            token,
            card,
          }),
        );
      } else {
        return Promise.resolve(null);
      }
    }),
  })),
}));

describe('getCardByToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver los datos de la tarjeta cuando se proporciona un token válido', async () => {
    const result = await getCardByToken(validAuthorization, token);

    expect(result.statusCode).toBe(HttpStatus.OK);
    delete card.cvv;
    expect(result.body).toEqual(JSON.stringify({ card }));
  });

  it('debería devolver un mensaje de no autorizado', async () => {
    const result = await getCardByToken('invalidAuthorization', 'invalidToken');

    expect(result.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(result.body).toEqual(
      JSON.stringify({ message: message.unAuthorized }),
    );
  });

  it('debería devolver un mensaje de tarjeta no encontrada cuando no se encuentra el token', async () => {
    const result = await getCardByToken(validAuthorization, 'DIo_Ay46KxMDJfE');

    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toEqual(
      JSON.stringify({ message: message.notFoundCard }),
    );
  });
});
