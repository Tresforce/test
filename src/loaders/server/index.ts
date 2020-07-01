import bodyParser from 'body-parser';
import cors from 'cors';
import { Application } from 'express';
import routes from '../../api';
import middleware from '../../api/middleware';
import config from '../../config';

const { API_VERSION } = config;
const apiPrefix = `/${API_VERSION}/`;

export default ({ app }: { app: Application }): void => {
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());
  /**
   * Health Check endpoints
   */
  app.get(`${apiPrefix}status`, (req, res) => {
    res.status(200).end();
  });
  app.head(`${apiPrefix}status`, (req, res) => {
    res.status(200).end();
  });
  app.use(apiPrefix, middleware.authorization);
  // Log All requests
  app.use(apiPrefix, middleware.logRequest);
  // Load API routes
  app.use(apiPrefix, routes());
  // catch 404 and forward to error handler
  app.use(middleware.notFoundError);
  app.use(middleware.sendError);
};
