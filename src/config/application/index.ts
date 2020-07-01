import {
  ExpressServerConfig,
  APIVersion,
  NodeEnvironment
} from '../../typings/config';

const { PORT, API_VERSION } = process.env;
let { NODE_ENV, SECRET } = process.env;

NODE_ENV =
  typeof process.env.NODE_ENV !== 'undefined'
    ? process.env.NODE_ENV
    : 'development';

const APP_PORT = typeof PORT !== 'undefined' ? parseInt(PORT, 10) : 3005;

SECRET = !['development', 'test'].includes(NODE_ENV)
  ? SECRET
  : '35839f9b-2709-44ee-9808-80868eca6e1c';

const application: ExpressServerConfig = {
  API_VERSION: API_VERSION as APIVersion,
  APP_PORT,
  NODE_ENV: NODE_ENV as NodeEnvironment,
  SECRET: SECRET as string /* cast secret as a string because we want to set this for production */
};

export default application;
