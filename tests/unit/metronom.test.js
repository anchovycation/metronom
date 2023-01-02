const { expect, describe, test } = require('@jest/globals');
const { Metronom } = require('../../dist');

describe('Metronom', () => {
  test('Metronom.constructor()', async () => {
    const m = new Metronom({
      url: 'redis://localhost:6380',
    });
    const model = await m.define({}, 'users', { flexSchema: true });
    expect(await model.redisClient.echo('test')).toBe('test');
  });
  test('Metronom.define()', async () => {
    const m = new Metronom({
      url: 'redis://localhost:6380',
    });
    const userModel = m.define({}, 'users', { flexSchema: true });
    const user = await userModel.create({ name: 'joe' });
    const u2 = await userModel.runCommand(['hgetall', user._Model._dataInfo.redisKey]);
    expect(u2[1]).toBe('joe');
  });
});
