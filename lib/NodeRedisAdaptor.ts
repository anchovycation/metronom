/* eslint-disable class-methods-use-this */
import { createClient, RedisClientOptions, RedisClientType } from 'redis';
import IRedisAdaptor from './IRedisAdaptor';

class NodeRedisAdaptor implements IRedisAdaptor {
  redisClient: RedisClientType<any, any>;

  constructor(options: RedisClientOptions) {
    this.redisClient = createClient(options);
  }

  hGetAll(redisKey: string): Promise<object> {
    return this.redisClient.hGetAll(redisKey);
  }

  hSet(redisKey: string, values: [string, any]): Promise<number> {
    return this.redisClient.hSet(redisKey, values);
  }

  connect(): void {
    this.redisClient.connect();
  }

  keys(regex: string): Promise<string[]> {
    return this.redisClient.keys(regex);
  }

  del(redisKey: string): Promise<number> {
    return this.redisClient.del(redisKey);
  }

  sendCommand(commands: string[]): Promise<unknown> {
    return this.redisClient.sendCommand(commands);
  }

  echo(message: any) {
    return this.redisClient.echo(message);
  }
}

export default NodeRedisAdaptor;
