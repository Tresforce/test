import { getRepository } from 'typeorm';
import DetailedError from '../../../utils/DetailedError';

export async function find<T>(model: string, query: Partial<T>): Promise<T> {
  return getRepository<T>(model).findOneOrFail({ where: query });
}

/**
 * Find all the documents for an entity
 *
 * @export
 * @param {Entities} model
 * @returns {Promise<any[]>}
 */
export async function findAll<T>(model: string): Promise<T[]> {
  return getRepository<T>(model).find({});
}

/**
 * Finds Entity by Id
 *
 * @export
 * @param {string} model Entity being searched for
 * @param {string} id Id of the Entity you are searching for
 * @returns {Promise<any>}
 */
export async function findById<T>(model: string, id: string): Promise<T> {
  try {
    return getRepository<T>(model).findOneOrFail(id);
  } catch (error) {
    throw new DetailedError({
      name: 'Bad Request Error',
      statusCode: 400,
      message: error.message,
      contextObject: { model, id }
    });
  }
}
