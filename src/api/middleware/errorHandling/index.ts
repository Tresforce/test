import { NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status-codes';
import logger from '../../../utils/logger';
import DetailedError from '../../../utils/DetailedError';

const winston = logger(module);

/**
 * Creates a 404 error when route is not found
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function notFoundError(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new DetailedError({
    name: 'NotFoundError',
    message: 'Not Found',
    statusCode: NOT_FOUND,
    contextObject: {
      path: req.url
    }
  });
  next(error);
}

/**
 * Logs Error and sends to client
 *
 * @export
 * @param {DetailedError} err the thrown error
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export function sendError(
  err: DetailedError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  winston.error(`${err.message} ${JSON.stringify(err.contextObject, null, 2)}`);
  winston.debug(err.stack);
  res.status(err.status);
  return res.json({
    error: {
      message: err.message,
      object: err.contextObject
    }
  });
}
