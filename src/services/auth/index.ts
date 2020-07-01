import argon2 from 'argon2';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST } from 'http-status-codes';
import User from '../../database/entities/User';
import DbController from '../../database/controllers';
import UserController from '../../controllers/User';
import DetailedError from '../../utils/DetailedError';
import { AuthenticatedUser } from '../../typings/auth';
import config from '../../config';

const signature = config.SECRET;
const tokenExpiration = '6h';

export default class AuthService {
  static async signUp({
    email,
    password,
    firstName,
    lastName,
    phoneNumber
  }: User): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    return getManager().transaction(async transactionEntity => {
      const user = await DbController.insertOne(transactionEntity, User.name, {
        password: hashedPassword,
        email,
        firstName,
        lastName,
        phoneNumber
      });
      delete user.password;
      return user;
    });
  }

  static async logIn(
    email: string,
    password: string
  ): Promise<AuthenticatedUser> {
    try {
      const user = await UserController.find({ email });
      const correctPassword = await argon2.verify(user.password, password);
      if (correctPassword) {
        delete user.password;
        return { user, token: this.generateJWT(user) };
      }
      throw new DetailedError({
        name: 'User Not Found',
        statusCode: BAD_REQUEST,
        message: `User ${email} does not exist or invalid password`,
        contextObject: {}
      });
    } catch {
      throw new DetailedError({
        name: 'User Not Found',
        statusCode: BAD_REQUEST,
        message: `User ${email} does not exist or invalid password`,
        contextObject: {}
      });
    }
  }

  private static generateJWT(user: User): string {
    return jwt.sign({ data: user }, signature, { expiresIn: tokenExpiration });
  }
}
