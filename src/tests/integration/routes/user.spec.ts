/**
 * Integration Tests for user routes
 * @group integration
 */

import { Connection } from 'typeorm';
import { pgConnection } from '../../setup';

describe('user route', () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await pgConnection();
  });
  afterAll(async () => {
    await connection.close();
  });

  test.todo('should create user');
  test.todo('should update user');
  test.todo('should disable user');
  test.todo('should delete user');
});
