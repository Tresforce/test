import DetailedError from '..';
/**
 * Unit Tests for Custom DetailedError Class
 * @group unit
 */
describe('error class', () => {
  test('should inherit params from Error Class', () => {
    const error = new Error('message should show up');
    const errResult = new DetailedError({
      name: 'test error',
      message: error.message,
      statusCode: 400,
      contextObject: {}
    });
    expect(errResult.message).toBe(error.message);
    expect(errResult.stack).toBeDefined();
  });

  test('should have name, status and date properties', () => {
    const errResult = new DetailedError({
      name: 'StandardError',
      message: 'new error please',
      statusCode: 400,
      contextObject: {}
    });
    expect(errResult.name).toBe('StandardError');
    expect(errResult.status).toBe(400);
    expect(new Date(errResult.date)).toBeDefined();
  });
});
