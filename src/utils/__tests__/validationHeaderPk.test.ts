import { validatePk } from '../validationHeaderPk';

describe('validatePk', () => {
  it('debería retornar true para un token de autorización válido', () => {
    const validAuthorization =
      'Bearer pk_5Pf3TdmyK8exHXAnglgiPuxfqZLhR86WHqZdoAa8gA9Cv';

    expect(validatePk(validAuthorization)).toBe(true);
  });

  it('debería retornar false para un token de autorización inválido', () => {
    const invalidAuthorization = 'Bearer invalidToken';

    expect(validatePk(invalidAuthorization)).toBe(false);
  });

  it('debería retornar false para un token de autorización sin el formato correcto', () => {
    const invalidFormatAuthorization =
      'pk_5Pf3TdmyK8exHXAnglgiPuxfqZLhR86WHqZdoAa8gA9Cv';

    expect(validatePk(invalidFormatAuthorization)).toBe(false);
  });

  it('debería retornar false para un token de autorización vacío', () => {
    const emptyAuthorization = '';

    expect(validatePk(emptyAuthorization)).toBe(false);
  });

  it('debería retornar false para un token de autorización incompleto', () => {
    const emptyAuthorization = 'Bearer ';

    expect(validatePk(emptyAuthorization)).toBe(false);
  });
});
