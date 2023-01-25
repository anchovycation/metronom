/* eslint-disable class-methods-use-this */
import { createClient, RedisClientOptions, RedisClientType } from 'redis';
import IRedisAdaptor from '../IRedisAdaptor';
import Logger from '../Logger';

class NodeRedisAdaptor implements IRedisAdaptor {
  redisClient: RedisClientType<any, any>;

  constructor(options: RedisClientOptions) {
    this.redisClient = createClient(options);
  }

  hGetAll(redisKey: string): Promise<object> {
    Logger.log(`hGetAll ${redisKey}`);
    return this.redisClient.hGetAll(redisKey);
  }

  hSet(redisKey: string, values: [string, any]): Promise<number> {
    Logger.log(`hSet ${redisKey} ${values.join(' ')}`);
    return this.redisClient.hSet(redisKey, values);
  }

  connect(): void {
    this.redisClient.connect();
  }

  keys(regex: string): Promise<string[]> {
    Logger.log(`keys ${regex}`);
    return this.redisClient.keys(regex);
  }

  del(redisKey: string): Promise<number> {
    Logger.log(`del ${redisKey}`);
    return this.redisClient.del(redisKey);
  }

  sendCommand(commands: string[]): Promise<unknown> {
    Logger.log(`sendCommand ${commands.join(' ')}`);
    return this.redisClient.sendCommand(commands);
  }

  echo(message: any) {
    Logger.log(`echo ${message}`);
    return this.redisClient.echo(message);
  }
}

export default NodeRedisAdaptor;
