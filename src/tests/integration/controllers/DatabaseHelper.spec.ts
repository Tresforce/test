/**
 * Integration Tests for DbHelper class
 * @group integration
 */
import { Connection, QueryRunner } from 'typeorm';
import DbHelper from '../../../database/controllers/utils/helper';
import { pgConnection } from '../../setup';
import makeUsers from '../../factories/userFactory';
import User from '../../../database/entities/User';

describe('db helper class', () => {
  let VALID_INPUT: User;
  let connection: Connection;
  let queryRunner: QueryRunner;

  // TODO update user factory to make invalid user
  const INVALID_INPUT = {
    id: 'asldkjfaslkdlkjasf',
    email: 'james@human',
    dateCreated: new Date(),
    invalidField: 'alsdlkfsl'
  };

  beforeAll(async () => {
    connection = await pgConnection();
    queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
  });

  beforeEach(async () => {
    [VALID_INPUT] = makeUsers(1);
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.commitTransaction();
  });

  afterAll(async () => {
    await queryRunner.connection.close();
    await connection.close();
  });
  test('should return false if does not include all of the required fields', () => {
    expect(DbHelper.isValidInputForInsert('User', INVALID_INPUT)).toBe(false);
  });

  test('should return true it has all of the required fields', () => {
    // TODO update better factory off of schema
    expect(DbHelper.isValidInputForInsert('User', VALID_INPUT)).toBe(true);
  });

  test('should return false if it has extra fields not in schema', () => {
    expect(DbHelper.isValidInputForInsert('User', INVALID_INPUT)).toBe(false);
  });
});
