import { validateCard } from '../validationCard';

describe('validateCard', () => {
  it('debería retornar una lista vacía de errores para una tarjeta válida', () => {
    const validCard = {
      card_number: '4111 1111 1111 1111',
      cvv: '123',
      expiration_month: 12,
      expiration_year: 2024,
      email: 'dev@gmail.com',
    };
    expect(validateCard(validCard)).toEqual([]);
  });

  it('debería retornar una lista de errores para una tarjeta inválida', () => {
    const invalidCard = {
      card_number: '4111 1111 1111 1112', // Número de tarjeta inválido
      cvv: '12', // CVV inválido
      expiration_month: 13, // Mes de expiración inválido
      expiration_year: 2021, // Año de expiración inválido
      email: 'invalid-email', // Correo electrónico inválido
    };
    const valid = validateCard(invalidCard);
    expect(JSON.stringify(valid)).toEqual(
      `[{"field":"card_number","value":"4111 1111 1111 1112","message":"El número de la tarjeta proporcionada no es válido"},{"field":"cvv","value":"12","message":"El CVV de la tarjeta proporcionada no es válido"},{"field":"expiration_month","value":13,"message":"El mes de expiración de la tarjeta proporcionada no es válido"},{"field":"expiration_year","value":2021,"message":"El año de expiración de la tarjeta proporcionada no es válido"},{"field":"email","value":"invalid-email","message":"El correo electrónico proporcionado no es válido"}]`,
    );
  });
});
