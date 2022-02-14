export function isObject(variable: any): Boolean {
  return variable === null || (variable && variable.toString() === '[object Object]');
}

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

export const safeWrite = async (
  data: Object,
  redisKey: String,
  redisClient: any,
  isFlex: Boolean = false,
  schema: Object = {},
): Promise<Object> => {
  if (!isFlex) { // if isFlex is falsy, you can only save fields inside the schema
    const temp: { [key: string]: any } = schema;
    Object.entries(data).forEach(([key, value]) => {
      if (temp[key]) {
        temp[key] = value;
      }
    });
    data = temp;
  }

  const keysAndValues: [String, any][] = Object
    .entries(data)
    .map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value]); // include array, objects etc.
  return await redisClient.hSet(redisKey, keysAndValues);
};
