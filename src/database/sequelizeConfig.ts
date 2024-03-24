import { Options, Sequelize } from 'sequelize';

const options: Options = {
  dialect: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: Number(process.env.POSTGRESQL_PORT),
  username: process.env.POSTGRESQL_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DB_NAME,
};

const sequelize = new Sequelize(options);

// Función para verificar la conexión a la base de datos
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

// Llamamos a la función para verificar la conexión a la base de datos
testDatabaseConnection();

export default sequelize;
