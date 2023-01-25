import { RedisClientOptions } from 'redis';
import Model from './Model';
import {
  ModelOptions,
  Schema,
} from './Interfaces';

/**
 * Metronom model creator
 * @class Metronom
 * @category Metronom
 */
class Metronom {
  public redisClientOptions: RedisClientOptions;

  /**
   * Base Metronom object.
   * You can create new metronom instance with diffirent options like redis url.
   * @constructor
   * @param {RedisClientOptions} redisClientOptions redis client settings
   * @returns {Metronom} new record of Metronom object
   */
  constructor(redisClientOptions: RedisClientOptions) {
    this.redisClientOptions = redisClientOptions;
  }

  /**
   * Create metronom model from this Metronom object
   *
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
  public define(schema: Schema, keyPrefix: string = 'object', modelOptions?: ModelOptions): Model {
    const redisOption = this.redisClientOptions
      ? this.redisClientOptions
      : modelOptions?.redisClientOptions;

    return new Model(schema, keyPrefix, {
      ...modelOptions,
      redisClientOptions: redisOption,
    });
  }
}

export default Metronom;
