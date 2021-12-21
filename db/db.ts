import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { DATABASE_URL } from '../env';
dotenv.config();

const db = new Sequelize(
  DATABASE_URL || 'postgres://localhost:5432/messenger',
  {
    logging: false,
  }
);

export default db;
