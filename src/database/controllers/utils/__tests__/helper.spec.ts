/**
 * Unit Tests for Custom DetailedError Class
 * @group unit
 */

import DbHelper from '../helper';
import makerUsers from '../../../../tests/factories/userFactory';
import User from '../../../entities/User';

const INVALID_INPUT = {
  id: 'asldkjfaslkdlkjasf',
  email: 'james@human',
  dateCreated: new Date(),
  invalidField: 'alsdlkfsl'
};

let VALID_INPUT: User;
describe('helper', () => {
  beforeEach(() => {
    [VALID_INPUT] = makerUsers(1);
  });
  test('should remove fields that are not allowed for creates and updates', () => {
    const sanitized = DbHelper.sanitizeInput(INVALID_INPUT);
    expect(sanitized.email).toBe(INVALID_INPUT.email);
    expect(sanitized.id).toBeUndefined();
    expect(sanitized.lastUpdated).toBeUndefined();
  });
  test('should remove fields that are not allowed for creates and updates for valid input', () => {
    const sanitized = DbHelper.sanitizeInput(VALID_INPUT);
    expect(sanitized.email).toBe(VALID_INPUT.email);
    expect(sanitized.id).toBeUndefined();
    expect(sanitized.lastUpdated).toBeUndefined();
  });
});
