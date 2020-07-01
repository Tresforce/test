import { EntityManager, UpdateResult } from 'typeorm';
import DbHelper from '../utils/helper';
import { DatabaseModel } from '../../../typings/databaseController';

/**
 * Updates entity by Id
 * @export
 * @param {EntityManager} transactionManager Transaction manager
 * @param {string} model Entity to update
 * @param {} entityUpdate fields being updated
 * @returns {Promise<UpdateResult>}
 */
export async function updateById(
  transactionManager: EntityManager,
  model: string,
  entityUpdate: Partial<DatabaseModel>
): Promise<UpdateResult> {
  const { id } = entityUpdate;
  await DbHelper.validateEntityExistsbyIds({ ids: [id!], model });
  return transactionManager.update<DatabaseModel>(model, id, entityUpdate);
}

/**
 * Updates multiple objects for a single Entity
 *
 * @export
 * @param {EntityManager} transactionManager Transaction Manager
 * @param {Entities} model The entity being updated
 * @param {[]} entityUpdateArray Array of objects to update
 * @returns {Promise<UpdateResult[]>}
 */
export async function updateMany(
  transactionManager: EntityManager,
  model: string,
  entityUpdateArray: DatabaseModel[]
): Promise<UpdateResult[]> {
  const ids = entityUpdateArray.map(update => update.id);
  await DbHelper.validateEntityExistsbyIds({ ids, transactionManager, model });

  return Promise.all(
    entityUpdateArray.map(async (update, index) =>
      transactionManager.update<DatabaseModel>(
        model,
        entityUpdateArray[index].id,
        update
      )
    )
  );
}
