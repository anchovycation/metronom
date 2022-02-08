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
