import { find, findAll, findById } from './find';
import { updateById, updateMany } from './update';
import { insertOne, insertMany } from './insert';
import DbHelper from './utils/helper';

function getSchema(model: string): Record<string, any> {
  return DbHelper.getSchema(model);
}

export default {
  find,
  findAll,
  findById,
  insertMany,
  insertOne,
  updateById,
  updateMany,
  getSchema
};
