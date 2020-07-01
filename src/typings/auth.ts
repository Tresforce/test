import User from '../database/entities/User';

export interface AuthenticatedUser {
  user: User;
  token: string;
}
