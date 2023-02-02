const { expect, describe, test } = require('@jest/globals');
const { Metronom } = require('../../dist');

describe('Metronom.constructor()', () => {
  test('client should connect diffrent url', async () => {
    const m = new Metronom({
      url: 'redis://localhost:6380',
    });
    const model = await m.define({}, 'users', { flexSchema: true });
    expect(await model.redisClient.echo('test')).toBe('test');
  });
});

describe('Metronom.define()', () => {
  test('client should define model from custom url', async () => {
    const m = new Metronom({
      url: 'redis://localhost:6380',
    });
    const userModel = m.define({}, 'users', { flexSchema: true });
    const user = await userModel.create({ name: 'joe' });
    const u2 = await userModel.runCommand(['hgetall', user._Model._dataInfo.redisKey]);
    expect(u2[1]).toBe('joe');
  });
});

describe('Metronom.setKey()', () => {
  const m = new Metronom({
    url: 'redis://localhost:6380',
  });

  test('client should get error when key was empty', async () => {
    let error = null;
    try {
      await m.setKey('', 'bar');
    } catch (e) {
      error = e.message;
    }
    expect(error).toBe('setKey: Keys can\'t be empty!');
  });
  test('client should get "OK" when set key', async () => {
    const u = await m.setKey('foo', 'bar');
    expect(u).toBe('OK');
  });
});

describe('Metronom.getKey()', () => {
  const m = new Metronom({
    url: 'redis://localhost:6380',
  });

  test('client should get error when key was empty', async () => {
    let error = null;
    try {
      await m.getKey('', 'bar');
    } catch (e) {
      error = e.message;
    }
    expect(error).toBe('getKey: Keys can\'t be empty!');
  });
  test('client should get null when key not found', async () => {
    const u = await m.getKey('baz');
    expect(u).toBe(null);
  });
  test('client should read key', async () => {
    await m.setKey('bar', 'foz');
    const u = await m.getKey('bar');
    expect(u).toBe('foz');
  });
});
