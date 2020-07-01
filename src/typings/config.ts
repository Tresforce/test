/** Server config includes: NODE_ENV, API_VERSION, APP_PORT, SECRET */
export interface ExpressServerConfig {
  /** Node environment: development, test, production */
  NODE_ENV: NodeEnvironment;
  /** The version of the api: dev, test, v1 */
  API_VERSION: APIVersion;
  /** The port the server is running on */
  APP_PORT: number;
  /** The secret used to generate the JWT token */
  SECRET: string;
}

export type NodeEnvironment = 'development' | 'test' | 'production';
export type APIVersion = 'dev' | 'test' | 'v1';

/** Database config includes: TYPEORM_HOST, TYPEORM_USERNAME, TYPEORM_PASSWORD, TYPEORM_DATABASE, TYPEORM_PORT */
export interface DatabaseConfig {
  /** The url of the database */
  TYPEORM_HOST: string;
  /** Database user */
  TYPEORM_USERNAME: string;
  /** Database user password */
  TYPEORM_PASSWORD: string;
  /** Database name */
  TYPEORM_DATABASE: string;
  /** Database port */
  TYPEORM_PORT: number;
}

export interface Config extends DatabaseConfig, ExpressServerConfig {}
