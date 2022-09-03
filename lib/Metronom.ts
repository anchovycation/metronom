import { RedisClientOptions } from 'redis';
import Model, { ModelOptions } from "./Model";

class Metronom {
  /**
   *
   */
  public redisClientOptions: RedisClientOptions;
  
  constructor(redisClientOptions: RedisClientOptions) {
    this.redisClientOptions = redisClientOptions;
  }
  
  public define(keyPrefix: string, schema: Object, modelOptions: ModelOptions): Model{
    let redisOption = this.redisClientOptions ? this.redisClientOptions : modelOptions.redisClientOptions;
    return new Model(schema, keyPrefix, {
      ...modelOptions,
      redisClientOptions: redisOption,
    });
  }
};

export default Metronom;
