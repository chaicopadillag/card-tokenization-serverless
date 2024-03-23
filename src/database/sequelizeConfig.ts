import { Options, Sequelize } from 'sequelize';

const options: Options = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
