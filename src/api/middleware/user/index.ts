import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import DbHelper from '../../../database/controllers/utils/helper';
import User from '../../../database/entities/User';
import DetailedError from '../../../utils/DetailedError';

function validateCreate(req: Request, res: Response, next: NextFunction): void {
  const userDTO = req.body;
  if (DbHelper.isValidInputForInsert(User.name, userDTO)) {
    return next();
  }
  throw new DetailedError({
    name: 'Bad Request Error',
    statusCode: BAD_REQUEST,
    message: 'Bad Request missing required fields',
    contextObject: userDTO
  });
}

export default {
  validateCreate
};
