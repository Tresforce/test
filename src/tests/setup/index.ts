/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express from 'express';
import { Connection } from 'typeorm';
import Database from '../../loaders/database/postgres';
import expressLoader from '../../loaders/server';

export async function pgConnection(): Promise<Connection> {
  const connection = await new Database().getDbConnection('testDb');
  return connection;
}

const app = express();
expressLoader({ app });

export const server = app;
