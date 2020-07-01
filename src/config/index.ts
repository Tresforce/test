import logger from '../utils/logger';
import application from './application';
import database from './database';
import { Config } from '../typings/config';

const winston = logger(module);

const config: Config = {
  ...application,
  ...database
};

winston.info('checking environment variables...');

Object.entries(config).forEach(environmentVariable => {
  const [key, value] = environmentVariable;
  if (value === undefined || value === '' || value === null) {
    const missingVariable = `Environment variable ${key} must be defined!`;
    winston.error(missingVariable);
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
});

export default config;
