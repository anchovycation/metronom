/* eslint-disable eqeqeq */
import { Types } from './Constants';
import { Schema } from './Interfaces';
import Logger from './Logger';
/**
 * Utilities
 * @category Utilities
 */

export function isObject(variable: any): Boolean {
  return variable === null || (variable && variable.toString() === '[object Object]');
}

/**
 * Get value's of object with key
 * @param key - wanted key of object
 * @example
 * ```
 *  getKeyValue("name")(user) // joey
 * ```
 */
export const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

export const hasJsonStructure = (str: any): Boolean => {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]'
      || type === '[object Array]';
  } catch (err) {
    return false;
  }
};

/**
 * Read record from Redis and restruct it like schema
 * @param redisKey - Redis record key with `keyPrefix` and `keyUnique`
 * @param redisClient - Connected Redis client
 * @param schema - Model schema
 * @returns raw object
 */
export const safeRead = async (
  redisKey: String,
  redisClient: any,
  schema: Schema,
): Promise<Object> => {
  const response = await redisClient.hGetAll(redisKey);
  const entries = Object
    .entries(response)
    .map(
      ([key, value]: [string, any]) => {
        if (value !== undefined || value !== null) {
          if (hasJsonStructure(value)) {
            value = JSON.parse(value);
          } else {
            value = new schema[key].type(value).valueOf(); // convert to primative type
          }
        }
        return [key, value];
      },
    );
  return Object.fromEntries(entries);
};

/**
 * Control data with isFlex and schema then serialize and write it into redis
 * @param data - Raw data
 * @param redisKey - Redis record key with `keyPrefix` and `keyUnique`
 * @param redisClient  - Connected Redis client
 * @param isFlex - if it is true you can pass diffirent key from schema
 * @param schema - Model schema
 */
export const safeWrite = async (
  data: { [key: string | number]: any },
  redisKey: String,
  redisClient: any,
  schema: Schema = {},
  isFlex: Boolean | null = false,
): Promise<Object> => {
  if (!isFlex) { // if isFlex is falsy, you can only save fields inside the schema
    const temp: { [key: string]: any } = { ...data };
    data = {};

    Object.entries(schema).forEach(([key, value]) => {
      if (value.default === null || value.default === undefined) {
        data[key] = value.default;
      } else {
        // data: { a, b, c } | schema: { b, c, d } ==> temp: { b, c, d}
        data[key] = temp[key]
        // @ts-ignore
        || (value.type == Types.Array ? value.default : new value.type(value.default).valueOf());
      }
    });
  }

  const keysAndValues: [String, any][] = Object
    .entries(data)
    .map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value]); // include array, objects etc.
  await redisClient.hSet(redisKey, keysAndValues);
  return data;
};

/**
 * Throw and log error with Metronom's internal Logger
 * @param message {string}
 */
export const throwError = (message: string) => {
  Logger.error(message);
  throw new Error(message);
};
