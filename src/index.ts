/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
require('dotenv').config();

/* We need to load environment variables first */
import express from 'express';
import config from './config';
import logger from './utils/logger';

const winston = logger(module);

const { APP_PORT, API_VERSION, NODE_ENV } = config;

async function startServer(): Promise<void> {
  const app = express();
  winston.info(`Node env is ${NODE_ENV}`);
  try {
    await require('./loaders').default({ expressApp: app });
  } catch (error) {
    winston.error(`Error loading application: ${error}`);
    process.exit(1);
  }

  app.listen(APP_PORT, () => {
    winston.info(`
      ############################################################################
      🛡️  Server listening on port: http://localhost:${APP_PORT}/${API_VERSION} 🛡
      ############################################################################
    `);
  });
}

startServer().catch(error => {
  winston.error(error);
});
