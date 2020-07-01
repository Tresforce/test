import { EntityManager, getRepository, getConnection } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { flatten } from 'lodash';
import { EntityObject } from '../../../typings/databaseController';
import { NON_UPDATABLE_FIELDS } from '../../../utils/constants/database';
import DetailedError from '../../../utils/DetailedError';

/**
 * Helper methods for the database controllers
 *
 * @export
 * @class DbHelper
 */
export default class DbHelper {
  /**
   * Validates objects exist in the database for the supplied id's
   *
   * @static
   * @param {{
   *     transactionManager?: EntityManager;
   *     model: Entities;
   *     ids: string[];
   *   }} {
   *     transactionManager,
   *     model,
   *     ids
   *   }
   * @returns {Promise<any>}
   * @memberof DbHelper
   */
  static async validateEntityExistsbyIds({
    transactionManager,
    model,
    ids
  }: {
    transactionManager?: EntityManager;
    model: string;
    ids: string[];
  }): Promise<any> {
    if (typeof transactionManager !== 'undefined') {
      return Promise.all(
        ids.map(async id =>
          transactionManager.getRepository(model).findOneOrFail(id)
        )
      );
    }
    return Promise.all(
      ids.map(async id => getRepository(model).findOneOrFail(id))
    );
  }

  static sanitizeInput(input: EntityObject): EntityObject;
  static sanitizeInput<EntityObject>(array: EntityObject[]): EntityObject[];
  /**
   * Takes in an object or an array of objects and removes fields that cannot be updated/created
   *
   * @static
   * @param {(EntityObject | EntityObject[])} input
   * @returns {(EntityObject | EntityObject[])}
   * @memberof DbHelper
   */
  static sanitizeInput(
    input: EntityObject | EntityObject[]
  ): EntityObject | EntityObject[] {
    if (Array.isArray(input)) {
      return input.map(object => {
        return this.sanitize(object);
      });
    }
    return this.sanitize(input);
  }

  /**
   * Validates that the input has all of the required fields from the schema
   *
   * @static
   * @param {Entities} model The entity being created
   * @param {EntityObject} input the object being inserted into the database
   * @returns {boolean}
   * @memberof DbHelper
   */
  static isValidInputForInsert(model: string, input: EntityObject): boolean {
    const requiredFields = this.getRequiredFields(model);
    return requiredFields.every(field => typeof input[field] !== 'undefined');
  }

  /**
   * Checks if there are extra fields that are not in schema
   *
   * @static
   * @param {Entities} model Entity being created or updated
   * @param {EntityObject} input Object being inserted or created
   * @memberof DbHelper
   */
  static isValidForUpdate(model: string, input: EntityObject): void {
    const updatableFields = this.getUpdatableFields(model);
    if (Object.keys(input).some(field => !updatableFields.includes(field))) {
      const invalidFields = { ...input };
      updatableFields.forEach(field => delete invalidFields[field]);
      throw new DetailedError({
        name: 'Bad Request Error',
        statusCode: 400,
        message: `Fields are not in entity: ${model}`,
        contextObject: input
      });
    }
  }

  /**
   * Gets the fields that are updatable for the Entity
   *
   * @static
   * @param {Entities} model The entity being updated
   * @returns {string[]} an array of fields that updatable
   * @memberof DbHelper
   */
  static getUpdatableFields(model: string): string[] {
    const schema = this.getSchema(model);
    return Object.keys(schema).filter(
      field => !NON_UPDATABLE_FIELDS.includes(field)
    );
  }

  /**
   * Gets the fields that are required for create
   *
   * @static
   * @param {Entities} model Entity being inserted
   * @returns {string[]} array of fields that are required
   * @memberof DbHelper
   */
  static getRequiredFields(model: string): string[] {
    const schema = this.getSchema(model);
    return Object.keys(schema)
      .filter(field => !NON_UPDATABLE_FIELDS.includes(field))
      .map(field => {
        if (
          typeof schema[field] !== 'undefined' &&
          schema[field].isRequired === true
        ) {
          return field;
        }
        return '';
      })
      .filter(field => field !== '');
  }

  /**
   * Gets the Schema for the Entity
   *
   * @static
   * @param {string} model The entity
   * @returns {*}
   * @memberof DbHelper
   */
  static getSchema(model: string): any {
    const allColumns = this.getAllColumnsFromMetadata(model);
    const schema: { [type: string]: any } = {};
    allColumns.forEach(column => {
      if (typeof column.type === 'function') {
        const defaultValue = column.type();
        const type = typeof defaultValue;
        if (
          typeof defaultValue === 'string' &&
          !Number.isNaN(Date.parse(defaultValue))
        ) {
          schema[column.propertyPath] = { type: 'timestamp' };
        } else {
          schema[column.propertyPath] = { type };
        }
      } else if (column.type === 'enum' && column.isArray) {
        schema[column.propertyPath] = {
          type: 'arrayOfEnums',
          options: column.enum
        };
      } else if (column.type === 'enum' && !column.isArray) {
        schema[column.propertyPath] = { type: 'enum', options: column.enum };
      } else if (column.type === 'numeric') {
        schema[column.propertyPath] = {
          precision: column.precision,
          scale: column.scale,
          type: 'numeric'
        };
      } else {
        schema[column.propertyPath] = { type: column.type };
      }
      schema[column.propertyPath].isReadonly = !column.isUpdate;
      schema[column.propertyPath].isRequired =
        !column.isNullable && column.default === undefined; // if a field has a default value (not null) it's by definition not required
    });

    return schema;
  }

  private static sanitize(object: EntityObject): EntityObject {
    const sanitized = { ...object };
    NON_UPDATABLE_FIELDS.forEach(field => {
      delete sanitized[field];
    });
    return sanitized;
  }

  /**
   * Gets all of the columns for an Entity
   *
   * @private
   * @static
   * @param {string} model The Entity being requested
   * @returns {Array<ColumnMetadata>}
   * @memberof DbHelper
   */
  private static getAllColumnsFromMetadata(
    model: string
  ): Array<ColumnMetadata> {
    const {
      ownColumns, // these are the flat fields in an entity's schema
      allEmbeddeds // Array where each element represents an embedded entity that itself contains multiple columns (e.g. Address entity)
    } = getConnection().getMetadata(model);
    const flattenedEmbeddedColumns = flatten(
      allEmbeddeds.map(embeddedEntity => embeddedEntity.columns)
    );
    return [...ownColumns, ...flattenedEmbeddedColumns]; // an array of all columns in an entity flattened 1 layer deep.  TODO: consider increasing depth as needed
  }
}
