/**
 * Detailed Error class
 * @category Errors
 */
export default class DetailedError extends Error {
  /**
   * Name of the Error
   *
   * @type {string}
   * @memberof DetailedError
   */
  public name: string;

  /**
   * The http status code of the error
   *
   * @type {number}
   * @memberof DetailedError
   */
  public status: number;

  /**
   * Date of the error
   *
   * @type {Date}
   * @memberof DetailedError
   */
  public date: Date;

  /**
   * The object which caused the error
   *
   * @type {{ [key: string]: string }}
   * @memberof DetailedError
   */
  public contextObject: { [key: string]: string };

  /**
   *Creates an instance of DetailedError.
   * @param {{
   *     name: string;
   *     message: string;
   *     statusCode: number;
   *     contextObject: { [key: string]: string };
   *   }} {
   *     name,
   *     message,
   *     statusCode,
   *     contextObject
   *   }
   * @memberof DetailedError
   */
  constructor({
    name,
    message,
    statusCode,
    contextObject
  }: {
    name: string;
    message: string;
    statusCode: number;
    contextObject: { [key: string]: string };
  }) {
    super(message);
    if (typeof Error.captureStackTrace !== 'undefined') {
      Error.captureStackTrace(this, DetailedError);
    }

    this.name = name;
    this.status = statusCode;
    this.date = new Date();
    this.contextObject = contextObject;
  }
}
