import User from '../database/entities/User';

export type DatabaseModel = User;

export interface EntityObject {
  [key: string]: any;
}
