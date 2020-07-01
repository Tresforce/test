import { DatabaseConfig } from '../../typings/config';

const {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} = process.env;

const database: DatabaseConfig = {
  TYPEORM_HOST: TYPEORM_HOST as string,
  TYPEORM_PORT:
    typeof TYPEORM_PORT !== 'undefined' ? parseInt(TYPEORM_PORT, 10) : 5433,
  TYPEORM_USERNAME: TYPEORM_USERNAME as string,
  TYPEORM_PASSWORD: TYPEORM_PASSWORD as string,
  TYPEORM_DATABASE: TYPEORM_DATABASE as string
};

export default database;
