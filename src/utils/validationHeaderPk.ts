/**
 * Valida el token de autorización para verificar si comienza con 'pk'.
 * @param authorization El token de autorización a validar.
 * @returns true si el token de autorización es válido, false en caso contrario.
 */
export const validatePk = (authorization: string): boolean => {
  const parts = authorization.split(' ');

  // Verificar si el token tiene dos partes y la primera parte es 'Bearer'
  if (parts.length !== 2 && parts[0] !== 'Bearer') {
    return false;
  }

  // Obtener la segunda parte del token
  const pk = parts[1];

  // Si no hay token retornamos false
  if (!pk) {
    return false;
  }
  // Verificar si la segunda parte comienza con 'pk_'
  return pk.startsWith('pk_');
};
