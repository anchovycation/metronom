import { createClient, RedisClientOptions } from 'redis';
import ModelInstance from './ModelInstance';
import {
  isObject, getKeyValue, safeWrite, safeRead,
} from './utility';

interface ModelOptions {
  keyUnique?: string,
  redisClientOptions?: RedisClientOptions,
  flexSchema?: boolean,
}

class Model {
  /* eslint-disable no-undef */
  [index: string]: any // index signature

  public keyPrefix: String;

  public keyUnique: String | undefined;

  public schema: Object;

  public redisClient: any;

  public flexSchema: Boolean | undefined;

  constructor(schema: Object, keyPrefix = 'object', modelOption?: ModelOptions) {
    this.schema = schema;
    this.keyPrefix = keyPrefix;
    this.flexSchema = modelOption?.flexSchema;

    if (!modelOption?.keyUnique) {
      this.keyUnique = undefined;
    } else {
      if (!Object.keys(schema).includes(modelOption?.keyUnique)) {
        throw new Error(`${modelOption?.keyUnique} keyUnique must be in to schema!`);
      }
      this.keyUnique = modelOption?.keyUnique;
    }

    this.redisClient = createClient(modelOption?.redisClientOptions);
    this.redisClient.connect();
  }

  public async create(valueObject: Object): Promise<ModelInstance> {
    if (!isObject(valueObject)) {
      throw new Error('Value must be object!');
    }
    if (Object.keys(valueObject).length === 0) {
      throw new Error('Value can\'t be empty');
    }

    const redisKey = this.generateRedisKey(valueObject);
    const isExist = (await this.redisClient.keys(redisKey)).length > 0;

    if (isExist) {
      throw new Error(`"${redisKey}" already exist!`);
    }

    await this._write(redisKey, valueObject);

    return new ModelInstance(valueObject, this, { redisKey });
  }

  public async findById(id: any): Promise<ModelInstance | null> {
    const redisKey: string = `${this.keyPrefix}:${id}`;
    const response = await this._read(redisKey);
    if (Object.entries(response).length === 0) {
      return null;
    }
    return new ModelInstance(response, this, { redisKey });
  }

  public async deleteById(id: any): Promise<number> {
    return await this.redisClient.del(`${this.keyPrefix}:${id}`);
  }

  public async deleteAll(options?: any) {
    const keys: String[] = await this.redisClient.keys(`${this.keyPrefix}:*`);
    return keys.length > 0 ? await this.redisClient.del(keys) : 0;
  }

  private async _write(redisKey: String, data: Object): Promise<Object> {
    if (!redisKey.toString().startsWith(`${this.keyPrefix}:`)) {
      redisKey = `${this.keyPrefix}:${redisKey}`;
    }

    return await safeWrite(data, redisKey, this.redisClient, this.flexSchema, this.schema);
  }

  private async _read(redisKey: String): Promise<Object> {
    if (!redisKey.toString().startsWith(`${this.keyPrefix}:`)) {
      redisKey = `${this.keyPrefix}:${redisKey}`;
    }

    return await safeRead(redisKey, this.redisClient, this.schema);
  }

  private generateRedisKey(data: Object): string {
    const u = this.keyUnique
      ? getKeyValue(this.keyUnique.toString())(data)
      : Date.now() + Math.floor(Math.random() * 99999);
    return `${this.keyPrefix}:${u}`;
  }

  public async runCommand(commands: Array<String>): Promise<any> {
    return await this.redisClient.sendCommand(commands); // ['hget', 'user:1', 'name']
  }
}

export default Model;
