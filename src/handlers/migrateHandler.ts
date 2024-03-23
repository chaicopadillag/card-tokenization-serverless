import { APIGatewayProxyHandler } from 'aws-lambda';
import sequelize from 'database/sequelizeConfig';
import Card from 'models/card';
import { HttpStatus } from 'utils/constants';

export const migrateTables: APIGatewayProxyHandler = async () => {
  try {
    // Nos conectamos en la DB
    await sequelize.authenticate();

    // Sincronizamos el model con la DB
    await Card.sync({ force: false });

    // Retornar un mensaje indicando el resultado
    return {
      statusCode: HttpStatus.OK,
      body: JSON.stringify({
        message: 'La migración se ha realizado correctamente',
      }),
    };
  } catch (error) {
    // Capturamos error
    console.log(error);
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        message: 'Error al crear/verificar las tablas',
      }),
    };
  }
};
