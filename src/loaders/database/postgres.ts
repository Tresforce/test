import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import config from '../../config';
import User from '../../database/entities/User';
import { PostgresConnectionOptions } from '../../typings/postgres';
import logger from '../../utils/logger';

const winston = logger(module);

const {
  TYPEORM_HOST,
  TYPEORM_PORT,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  NODE_ENV
} = config;

const pgConnectionOptions = {
  type: 'postgres',
  host: TYPEORM_HOST,
  port: TYPEORM_PORT,
  password: TYPEORM_PASSWORD,
  username: TYPEORM_USERNAME,
  logging: ['error', 'info'],
  synchronize: false,
  entities: [User]
};

export default class Database {
  public connectionOptions: PostgresConnectionOptions;

  private retries = 3;

  constructor(connectionOptions = pgConnectionOptions) {
    this.connectionOptions = connectionOptions;
  }

  public async getDbConnection(database: string): Promise<Connection> {
    this.connectionOptions.database = database;
    if (NODE_ENV === 'development') {
      this.connectionOptions.synchronize = true;
    }
    const connection = createConnection(
      this.connectionOptions as ConnectionOptions
    );
    return connection;
  }

  public async establishConnection(
    database: string
  ): Promise<Connection | void> {
    // FIXME get this working properly with queue
    let connection: Connection;
    try {
      // eslint-disable-next-line no-await-in-loop
      connection = await this.getDbConnection(database);
      return connection;
    } catch (error) {
      if (this.retries >= 0) {
        this.retries -= 1;
        winston.warn(
          `${error.message} retrying database connection: ${this.retries} left`
        );
        setTimeout(this.establishConnection, 3000);
      } else {
        winston.error(error);
        process.exit(1);
      }
    }
  }
}
