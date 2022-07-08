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
  schema: { [key: string]: any },
): Promise<Object> => {
  const response = await redisClient.hGetAll(redisKey);
  const entries = Object
    .entries(response)
    .map(
      ([key, value]: [string, any]) => {
        if (hasJsonStructure(value)) {
          value = JSON.parse(value);
        } else {
          const typeOfValue = typeof schema[key];
          const types: { [key: string]: any } = {
            string: String,
            number: Number,
            boolean: Boolean,
            undefined,
            null: null,
          };

          value = typeOfValue === 'undefined' || value === 'null'
            ? types[typeOfValue]
            : new types[typeOfValue](value).valueOf(); // convert to primative type
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
  data: { [key: string | number]: any } ,
  redisKey: String,
  redisClient: any,
  schema: Object = {},
  isFlex: Boolean | null = false, 
): Promise<Object> => {
  if (!isFlex) { // if isFlex is falsy, you can only save fields inside the schema
    const temp: { [key: string]: any } = {};
    Object.entries(schema).forEach(([key, value]) => { // data: { a, b, c } | schema: { b, c, d } ==> temp: { b, c, d}
      temp[key] = data[key] || value; 
    });
    data = temp;
  }

  const keysAndValues: [String, any][] = Object
    .entries(data)
    .map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value]); // include array, objects etc.
  return await redisClient.hSet(redisKey, keysAndValues);
};
