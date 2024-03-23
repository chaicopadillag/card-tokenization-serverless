/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpStatus, message } from '../../utils/constants';
import { saveCardAndGenerateToken } from '../tokenizerService';

const validAuthorization = 'Bearer pk_hpY6STrYK4geSSa6ZhR_JAmREVSRX0';

const token = 'ncyLmU_9v6iRHvd';
const card = {
  card_number: '4111 1111 1111 1111',
  cvv: '123',
  expiration_month: 12,
  expiration_year: 2024,
  email: 'dev@gmail.com',
};

// Mock de la función create de Sequelize
jest.mock('../../models/card', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

jest.mock('../../database/redisConfig', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    set: jest.fn(),
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

describe('saveCardAndGenerateToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería guardar la tarjeta y generar un token único', async () => {
    const result = await saveCardAndGenerateToken(validAuthorization, card);

    expect(result.statusCode).toBe(HttpStatus.CREATED);
    expect(JSON.parse(result.body)).toHaveProperty('token');
  });

  it('debería devolver un mensaje de no autorizado', async () => {
    const result = await saveCardAndGenerateToken('KjKDYLc5ikA6YRI', card);

    expect(result.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('debería manejar correctamente los datos de tarjeta no válidos', async () => {
    const result = await saveCardAndGenerateToken(validAuthorization, {
      card_number: '26562323',
      cvv: '0',
      email: 'invalid_email',
      expiration_month: 13,
      expiration_year: 2023,
    });

    expect(result.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(result.body)).toEqual([
      {
        field: 'card_number',
        value: '26562323',
        message: 'El número de la tarjeta proporcionada no es válido',
      },
      {
        field: 'cvv',
        value: '0',
        message: 'El CVV de la tarjeta proporcionada no es válido',
      },
      {
        field: 'expiration_month',
        value: 13,
        message:
          'El mes de expiración de la tarjeta proporcionada no es válido',
      },
      {
        field: 'expiration_year',
        value: 2023,
        message:
          'El año de expiración de la tarjeta proporcionada no es válido',
      },
      {
        field: 'email',
        value: 'invalid_email',
        message: 'El correo electrónico proporcionado no es válido',
      },
    ]);
  });

  it('debería manejar correctamente un error al guardar la tarjeta en la base de datos', async () => {
    // Mock de la función create de Sequelize
    (
      require('../../models/card').default.create as jest.Mock
    ).mockRejectedValueOnce(new Error('Error DB Mock'));

    const result = await saveCardAndGenerateToken(validAuthorization, {
      card_number: '4111 1111 1111 1111',
      cvv: '123',
      email: 'example@example.com',
      expiration_month: 12,
      expiration_year: 2024,
    });

    expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(result.body)).toEqual({
      message: message.internalServerError,
    });
  });
});
