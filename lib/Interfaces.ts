import { RedisClientOptions } from 'redis';
import Model from './Model';
import ModelInstance from './ModelInstance';
import { LogLevels } from './Enums';

/**
 * Schema of Metronom model
 * @interface
 * @memberof Model
 * @example
 * ```
 * import { Types } from 'metronom';
 * const schema = {
 *   isAdmin: {
 *     type: Types.Boolean,
 *     default: false,
 *   }
 * };
 * ```
 */
export interface Schema {
  [index: string]: {
    type: any,
    default?: unknown,
  }
}

/**
 * Metronom Model settings
 * @interface
 */
export interface ModelOptions {
  keyUnique?: string;
  redisClientOptions?: RedisClientOptions | any;
  flexSchema?: boolean;
  log?: boolean | LogLevels;
}

/**
 * Metronom `Model.filter` function's argument type
 * @interface
 */
export interface FilterFunction {
  /* eslint-disable-next-line */
  (value: ModelInstance, index: number, array: ModelInstance[]): boolean
}

/**
 * Metronom `Model.filter` function's search options
 * @interface
 */
export interface FilterOptions {
  limit?: number,
}

/**
 * ModelInstance info
 * @interface
 */
export interface DataInfo {
  redisKey: String,
}

/**
 * ModelInstance's data fileds
 * @interface
 */
export interface ModelFields {
  _model: Model;
  _previousDataValues: any | Object;
  _dataInfo: DataInfo;
}
