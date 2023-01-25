import IRedisAdaptor from './IRedisAdaptor';
import ModelInstance from './ModelInstance';
import NodeRedisAdaptor from './adaptors/NodeRedisAdaptor';
import Logger from './Logger';
import {
  isObject,
  getKeyValue,
  safeWrite,
  safeRead,
  throwError,
} from './Utilities';

import {
  Schema,
  ModelOptions,
  FilterOptions,
  FilterFunction,
  DataInfo,
} from './Interfaces';

/**
 * Model Class
 * @class Model
 * @category Model
 */
class Model {
  /* eslint-disable no-undef */
  [index: string]: any // index signature

  /** First part of redis key. It's identifier for model class */
  public keyPrefix: String;

  /** Second part of redis key. It's identifier for record */
  public keyUnique: String | undefined;

  /** Object struct model */
  public schema: Schema;

  public redisClient: IRedisAdaptor;

  /** you can't define any key except the fields in `schema`, but if this value is `true`,
   * you can only add a value to the schema by giving it `keyUnique`
   */
  public flexSchema: Boolean | undefined;

  /**
   * Represents a Metronom ORM Model
   * @constructor
   * @param {Schema} schema - Record's key-value schema
   * @param {string} keyPrefix - Record unique key's prefix.
   * `"users:1234"` --> "`keyPrefix`:`keyUnique`"
   * @param {ModelOptions} modelOption - Optional model settings. It's include 3 key.
   *   + `keyUnique`: it's unique part of model key
   *   + `flexSchema`: Normally, you can't define any key except the fields in `schema`,
   *                   but if this value is `true`, you can only add a value to the schema
   * by giving it `keyUnique`
   *   + `redisClientOptions`: node-redis client options.
   * @returns {Model} new record of Model
   */
  constructor(schema: Schema, keyPrefix:string = 'object', modelOption?: ModelOptions) {
    this.schema = schema;
    this.keyPrefix = keyPrefix;
    this.flexSchema = modelOption?.flexSchema ? modelOption?.flexSchema : false;
    new Logger(modelOption?.log);

    if (!this.flexSchema) {
      if (Object.keys(schema).length === 0) {
        throwError('Only flex schema can be empty! Set the "modelOption.flexSchema" to "true"');
      }

      Object.entries(schema).forEach(([key, value]) => {
        if (!value.type) {
          throwError(`"${key}" key must have to "type" property in the schema!`);
        }
        if (typeof value.type !== 'function') {
          throwError(`"schema.${key}.type" must be constructor! You send "${value.type}"`);
        }
      });
    }

    if (!modelOption?.keyUnique) {
      this.keyUnique = undefined;
    } else {
      if (!Object.keys(schema).includes(modelOption?.keyUnique)) {
        throwError(`${modelOption?.keyUnique} keyUnique must be in to schema!`);
      }
      this.keyUnique = modelOption?.keyUnique;
    }

    this.redisClient = new NodeRedisAdaptor(modelOption?.redisClientOptions);
    try {
      this.redisClient.connect();
    } catch (error: any) {
      throwError(`Metronom: redis connecting error: ${error.message}`);
    }
  }

  // #region WRITE OPERATIONS

  /**
   * Creates `ModelInstance` by parameter then saves it to Redis and returns it
   * @param {Object} valueObject - data to be saved according to the `Model.schema`
   * @returns {ModelInstance} new ModelInstance
   */
  public async create(valueObject: Object): Promise<ModelInstance> {
    if (!isObject(valueObject) && !Array.isArray(valueObject)) {
      throwError(`Value must be object or array!. Your type is: ${typeof valueObject}`);
    }

    const redisKey = this.generateRedisKey(valueObject);
    const isExist = (await this.redisClient.keys(redisKey)).length > 0;

    if (isExist) {
      throwError(`"${redisKey}" already exist!`);
    }

    valueObject = await this._write(redisKey, valueObject);
    return this.createInstance(valueObject, { redisKey });
  }

  /**
 * Internal record save function
 * @param redisKey - Redis record key with/without `keyUnique`
 * @param data
 * @returns raw data
 */
  private async _write(redisKey: String, data: Object): Promise<Object> {
    if (!redisKey.toString().startsWith(`${this.keyPrefix}:`)) {
      redisKey = `${this.keyPrefix}:${redisKey}`;
    }
    return await safeWrite(data, redisKey, this.redisClient, this.schema, this.flexSchema);
  }

  // #endregion WRITE OPERATIONS

  // #region READ OPERATIONS

  /**
   * Internal read function
   * @param redisKey - Redis record key with/without `keyUnique`
   * @returns raw data
   */
  private async _read(redisKey: String): Promise<Object> {
    if (!redisKey.toString().startsWith(`${this.keyPrefix}:`)) {
      redisKey = `${this.keyPrefix}:${redisKey}`;
    }

    return await safeRead(redisKey, this.redisClient, this.schema);
  }

  /**
   * Fetches record by `keyUnique`
   * @param {number | string} id - `keyUnique`
   * @returns {ModelInstance} ModelInstance or null
   */
  public async findById(id: any): Promise<ModelInstance | null> {
    const redisKey: string = `${this.keyPrefix}:${id}`;
    const response = await this._read(redisKey);
    if (Object.entries(response).length === 0) {
      return null;
    }
    return this.createInstance(response, { redisKey });
  }

  /**
   * Fetches all records with the same `keyPrefix` value
   * @returns {Array<ModelInstance>} List of ModelInstance
   */
  public async getAll(options?: FilterOptions): Promise<Array<ModelInstance> | []> {
    let keys: String[] = await this.redisClient.keys(`${this.keyPrefix}:*`);
    if (options?.limit) {
      keys = keys.slice(0, options.limit);
    }
    const results: any[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const key of keys) {
      const response = await this._read(key);
      results.push(this.createInstance(response, { redisKey: key }));
    }
    return results;
  }

  /**
   * Filters in the same way as `Array.filter`, pulling all records with the same `keyPrefix` value
   * @param filterFunction - It takes the values `(value, index, array)` and returns `true`
   * then the record is filtered. It can be asynchronous function
   * @returns Filtred ModelInstances or empty array
   */
  public async filter(filterFunction: FilterFunction): Promise<Array<ModelInstance> | []> {
    if (typeof filterFunction !== 'function') {
      throwError('The type of the parameter of the "filter" function must be "function"!');
    }
    const records: Array<ModelInstance> = await this.getAll();
    const filtredRecords = records.filter(async (value, index, array) =>
      await filterFunction(value, index, array));
    return filtredRecords;
  }

  // #endregion READ OPERATIONS

  // #region DELETE OPERATIONS

  /**
   * delete record by `keyUnique`
   * @param {number | string} id - `keyUnique`
   * @returns {number} deleted records count it always '1' if it succesfull
   */
  public async deleteById(id: any): Promise<number> {
    return await this.redisClient.del(`${this.keyPrefix}:${id}`);
  }

  /**
   * Delete all records with the same `keyPrefix` value
   * @returns {number} deleted records count or 0
   */
  public async deleteAll(options?: any) {
    const keys: any = await this.redisClient.keys(`${this.keyPrefix}:*`);
    return keys.length > 0 ? await this.redisClient.del(keys) : 0;
  }

  // #endregion DELETE OPERATIONS

  /**
   * Redis command executer
   * @param {Array<any>} commands - Redis command list.
   * @example
   * ```
   * runCommand(['hget', 'user:1234', 'name'])
   * ```
   */
  public async runCommand(commands: any | Array<String>): Promise<any> {
    return await this.redisClient.sendCommand(commands);
  }

  /**
   * Generate full redis key. if model has a `keyUnique` use it
   * from `data` else generate random unique
   * @param data - ModelInstance data
   */
  private generateRedisKey(data: Object): string {
    const unique = this.keyUnique
      ? getKeyValue(this.keyUnique.toString())(data)
      : Date.now() + Math.floor(Math.random() * 99999);
    return `${this.keyPrefix}:${unique}`;
  }

  /**
   * Create ModelInstance from raw data
   * @param data - raw
   * @param dataInfo
   */
  private createInstance(data: Object, dataInfo: DataInfo): ModelInstance {
    return new ModelInstance(data, this, dataInfo);
  }
}

export default Model;
