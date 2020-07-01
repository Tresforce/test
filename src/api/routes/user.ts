import { Router } from 'express';
import { CREATED, NO_CONTENT } from 'http-status-codes';
import UserController from '../../controllers/User';
import logger from '../../utils/logger';
import userMiddleware from '../middleware/user';

const route = Router();
const winston = logger(module);

export default (app: Router): Router => {
  app.use('/users', route);

  route.post(
    '/sign-up',
    userMiddleware.validateCreate,
    async (req, res, next) => {
      const userDTO = req.body;
      try {
        const user = await UserController.create(userDTO);
        winston.debug(user);
        res.status(CREATED).send(user);
      } catch (error) {
        next(error);
      }
    }
  );

  route.post('/log-in', async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await UserController.logIn(email, password);
      winston.debug(user);
      return res.send(user);
    } catch (error) {
      return next(error);
    }
  });

  route.get('/schema', (req, res) => {
    const schema = UserController.getSchema();
    winston.debug(schema);
    res.send(schema);
  });

  route.patch('/update', (req, res, next) => {
    try {
      console.log('IMPLEMENT ME');
      res.status(NO_CONTENT).send('needs implementation');
    } catch (error) {
      return next(error);
    }
  });
  return app;
};
