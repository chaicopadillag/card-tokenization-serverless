import { CardI } from 'interfaces';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelizeConfig';

const Card = sequelize.define<Model<CardI>>('card', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  card_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [16, 16],
        msg: 'El número de tarjeta debe tener exactamente 16 dígitos',
      },
    },
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 4],
        msg: 'El CVV debe tener entre 3 y 4 dígitos',
      },
    },
  },
  expiration_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12,
    },
  },
  expiration_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: new Date().getFullYear(),
      max: new Date().getFullYear() + 5,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      min: 5,
      max: 100,
    },
  },
});

export default Card;
