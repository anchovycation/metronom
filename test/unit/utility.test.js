const { isObject, getKeyValue } = require('../../dist/lib/utility');

describe('isObject()', () => {
  test('should return true when data type is object', () => {
    expect(isObject({})).toBeTruthy();
  });
  test('should return false when data type isnot object', () => {
    expect(isObject([])).toBeFalsy();
  });
});

describe('getKeyValue()', () => {
  const obj = { foo: 'bar', a: 147 };
  test('should return value when key exist', () => {
    expect(getKeyValue('foo')(obj)).toEqual(obj.foo);
  });
  test('should return "undefined" when key doesnt exist', () => {
    expect(getKeyValue('baz')(obj)).toBeUndefined();
  });
});
