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

export const safeRead = async (redisKey: String, redisClient: any): Promise<Object> => {
  const response = await redisClient.hGetAll(redisKey);
  const entries = Object
    .entries(response)
    .map(
      ([key, value]: [string, any]) =>
        [key, (hasJsonStructure(value) ? JSON.parse(value) : value)],
    );
  return Object.fromEntries(entries);
};

export const safeWrite = async (data: Object, redisKey: String, redisClient: any): Promise<Object> => {
  const keysAndValues: [String, any][] = Object
    .entries(data)
    .map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value]); // include array, objects etc.
  return await redisClient.hSet(redisKey, keysAndValues);
};
