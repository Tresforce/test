import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from 'http-status-codes';
import logger from '../../../utils/logger';
import config from '../../../config';
import { NON_AUTH_ROUTES } from '../../../utils/constants/api';

const winston = logger(module);

function authorization(req: Request, res: Response, next: NextFunction): void {
  if (NON_AUTH_ROUTES.includes(req.path)) {
    return next();
  }
  if (typeof req.headers.authorization === 'undefined') {
    winston.error('No authorization token found.');
    res.status(UNAUTHORIZED).send('Unauthorized.');
    return;
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  const user = jwt.verify(token, config.SECRET);
  req.user = user;
  next();
}

export default authorization;
