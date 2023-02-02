import { RedisClientOptions } from 'redis';
import Model from './Model';
import IRedisAdaptor from './IRedisAdaptor';
import {
  MetronomOptions,
  ModelOptions,
  Schema,
} from './Interfaces';
import { LogLevels } from './Enums';
import { throwError } from './Utilities';
import NodeRedisAdaptor from './adaptors/NodeRedisAdaptor';
import Logger from './Logger';

/**
 * Metronom model creator
 * @class Metronom
 * @category Metronom
 */
class Metronom {
  public redisClientOptions?: RedisClientOptions;

  public log?: boolean | LogLevels;

  #redisClient: IRedisAdaptor | null;

  /**
   * Base Metronom object.
   * You can create new metronom instance with diffirent options like redis url.
   * @constructor
   * @param {MetronomOptions} options redis client settings
   * @returns {Metronom} new record of Metronom object
   */
  constructor(options: MetronomOptions) {
    this.redisClientOptions = options?.redisClientOptions;
    this.log = options?.log;
    this.#redisClient = null;
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

    const log = this.log
      ? this.log
      : modelOptions?.log;

    return new Model(schema, keyPrefix, {
      ...modelOptions,
      log,
      redisClientOptions: redisOption,
    });
  }

  /**
   * Create String key or update if it exist.
   * Redis's "SET" command
   * @param {strin} key redis key
   * @param {string} value value
   * @returns it return "OK" if the process done
   */
  public async setKey(key: string, value: any): Promise<string> {
    if (key === '') {
      throwError('setKey: Keys can\'t be empty!');
    }

    this.#connectToRedis();
    // @ts-ignore
    return await this.#redisClient.set(key, value);
  }

  /**
   * Read String key
   * Redis's "GET" command
   * @param {string} key Redis key
   * @returns if the key is exist it return the value else return null
   */
  public async getKey(key: string): Promise<string | null> {
    if (key === '' || key === undefined) {
      throwError('getKey: Keys can\'t be empty!');
    }

    this.#connectToRedis();
    // @ts-ignore
    return this.#redisClient.get(key);
  }

  #connectToRedis() {
    if (this.#redisClient === null) {
      // @ts-ignore
      this.#redisClient = new NodeRedisAdaptor(this.redisClientOptions);
      this.#redisClient.connect();
      new Logger(this.log);
    }
  }
}

export default Metronom;
