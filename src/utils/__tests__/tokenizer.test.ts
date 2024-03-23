// Importa la función a probar
import { generateUniqueToken } from '../tokenizer';

describe('generateUniqueToken', () => {
  it('debería generar un token único de 16 caracteres', () => {
    const token = generateUniqueToken();

    expect(typeof token).toBe('string');

    expect(token.length).toBe(16);
  });
});
