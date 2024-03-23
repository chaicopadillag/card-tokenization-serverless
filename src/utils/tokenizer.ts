/**
 * Genera un token único de 16 caracteres utilizando letras mayúsculas, minúsculas y números.
 * @returns Un token único de 16 caracteres.
 */
export const generateUniqueToken = (): string => {
  // Caracteres válidos para el token
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // Longitud del token
  const tokenLength = 16;
  let token = ''; // Token inicialmente vacío

  // Genera el token añadiendo caracteres aleatorios
  for (let i = 0; i < tokenLength; i++) {
    // Genera un índice aleatorio dentro del rango de caracteres
    const randomIndex = Math.floor(Math.random() * characters.length);
    // Añade el carácter correspondiente al token
    token += characters.charAt(randomIndex);
  }

  return token; // Devuelve el token generado
};
