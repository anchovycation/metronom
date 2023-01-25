/* eslint-disable no-unused-vars */

/**
 * Redis Interface
 * @internal
 */
interface IRedisAdaptor{
  redisClient: any;
  hGetAll(redisKey: string): Promise<object>;
  hSet(redisKey: string, values:[string, any]): Promise<number>;
  connect(): void;
  keys(regex: string): Promise<Array<string>>;
  del(redisKey: string): Promise<number>;
  sendCommand(commands: Array<string>): Promise<unknown>;
  echo(message: any):any
}

export default IRedisAdaptor;
