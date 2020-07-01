import { getManager } from 'typeorm';
import User from '../../database/entities/User';
import DbController from '../../database/controllers';
import logger from '../../utils/logger';
import { EntityObject } from '../../typings/databaseController';
import AuthService from '../../services/auth';
import { AuthenticatedUser } from '../../typings/auth';

const winston = logger(module);

async function create(user: User): Promise<User> {
  winston.info(`creating new user ${user.firstName} ${user.lastName}`);
  return AuthService.signUp(user);
}

async function findById(id: string): Promise<User> {
  winston.info(`Finding user with id: ${id}`);
  return DbController.findById('User', id);
}

async function logIn(
  email: string,
  password: string
): Promise<AuthenticatedUser> {
  winston.info(`User ${email} is attempting to log in`);
  return AuthService.logIn(email, password);
}

async function find(query: Partial<User>): Promise<User> {
  winston.info(`finding user using query: ${JSON.stringify(query)}`);
  return DbController.find(User.name, query);
}

async function updateById(id: string, update: Partial<User>): Promise<void> {
  winston.info(`updating user with id: ${id}`);
  return getManager().transaction(async transactionEntity => {
    await DbController.updateById(transactionEntity, User.name, update);
  });
}

function getSchema(): EntityObject {
  return DbController.getSchema(User.name);
}

export default {
  create,
  findById,
  logIn,
  find,
  updateById,
  getSchema
};
