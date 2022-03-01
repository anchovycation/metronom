import { createClient, RedisClientOptions, RedisClientType } from 'redis';
import ModelInstance, { DataInfo } from './ModelInstance';
import {
  isObject, getKeyValue, safeWrite, safeRead,
} from './utility';

interface ModelOptions {
  keyUnique?: string,
  redisClientOptions?: RedisClientOptions,
  flexSchema?: boolean,
}

interface FilterFunction {
  /* eslint-disable-next-line */
  (value: ModelInstance, index: number, array: ModelInstance[]): boolean
}

class Model {
  /* eslint-disable no-undef */
  [index: string]: any // index signature

  public keyPrefix: String;

  public keyUnique: String | undefined;

  public schema: Object;

  public redisClient: RedisClientType<any, any>;

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

    return this.createInstance(valueObject, { redisKey });
  }

  public async getAll(): Promise<Array<ModelInstance> | []> {
    const keys: String[] = await this.redisClient.keys(`${this.keyPrefix}:*`);
    const results: any[] = [];
    for await (const key of keys) {
      const response = await this._read(key);
      results.push(this.createInstance(response, { redisKey: key }));
    }
    return results;
  }

  public async findById(id: any): Promise<ModelInstance | null> {
    const redisKey: string = `${this.keyPrefix}:${id}`;
    const response = await this._read(redisKey);
    if (Object.entries(response).length === 0) {
      return null;
    }
    return this.createInstance(response, { redisKey });
  }

  public async deleteById(id: any): Promise<number> {
    return await this.redisClient.del(`${this.keyPrefix}:${id}`);
  }

  public async deleteAll(options?: any) {
    const keys: any = await this.redisClient.keys(`${this.keyPrefix}:*`);
    return keys.length > 0 ? await this.redisClient.del(keys) : 0;
  }

  public async runCommand(commands: any | Array<String>): Promise<any> {
    return await this.redisClient.sendCommand(commands); // ['hget', 'user:1', 'name']
  }

  public async filter(filterFunction: FilterFunction): Promise<Array<ModelInstance> | []> {
    if (typeof filterFunction !== 'function') {
      throw new Error('The type of the parameter of the "filter" function must be "function"!');
    }
    const records: Array<ModelInstance> = await this.getAll();
    const filtredRecords = records.filter(async (value, index, array) =>
      await filterFunction(value, index, array)
    );
    return filtredRecords;
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

  private createInstance(data: Object, dataInfo: DataInfo): ModelInstance {
    return new ModelInstance(data, this, dataInfo);
  }
}

export default Model;
