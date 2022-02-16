const Model = require('../../dist');

describe('constructor()', () => {
  test('client should connect successfully', () => {
    const userModel = new Model({ name: '', surname: '', age: 1 }, 'users', { keyUnique: 'age' });
    expect(userModel.redisClient).not.toBeUndefined();
  });
  test('client should connect successfully without "modelOptions"', () => {
    const userModel = new Model({ name: '', surname: '', age: 1 }, 'users');
    expect(userModel.redisClient).not.toBeUndefined();
  });
  test('client should create instance successfully when keyPrefix doesnt exist', () => {
    const userModel = new Model({ name: '', surname: '', age: 1 });
    expect(userModel.keyPrefix).toBe('object');
  });
  test('client should get error when keyUnique doesnt exist in the schema', () => {
    try {
      new Model({ name: '', surname: '', age: 1 }, 'users', { keyUnique: 'createdAt' });
    } catch (error) {
      expect(error.message).toBe('createdAt keyUnique must be in to schema!');
    }
  });
});

describe('model.create()', () => {
  const userModel = new Model({ id: 0, name: '', surname: '', age: 1 }, 'users', { keyUnique: 'id' });
  test('client should create successfully when data\'s keys is equal to schema\'s key\'s', async () => {
    const id = Date.now();
    const user = await userModel.create({ id, name: 'alihan', surname: 'sarac', age: 20 })
    expect(user.id).toEqual(id);
  });
  test('client should create successfully without "keyUnique" option', async () => {
    const id = Date.now();
    const userModel2 = new Model({ id: 0, name: '', surname: '', age: 1 }, 'users');
    const user = await userModel2.create({ id, name: 'alihan', surname: 'sarac', age: 20 })
    expect(user._Model._dataInfo.redisKey.replace(user._Model._model.keyPrefix + ':', '')).not.toEqual('');
  });
  test('client should get error when data isnt object', async () => {
    try {
      const user = await userModel.create([])
    } catch (error) {
      expect(error.message).toEqual('Value must be object!');
    }
  });
  test('client should get error when data is empty object', async () => {
    try {
      const user = await userModel.create({})
    } catch (error) {
      expect(error.message).toEqual('Value can\'t be empty');
    }
  });
  test('client should create successfully when data has array', async () => {
    const id = Date.now();
    const userModel2 = new Model({ id: 0, messages: [] }, 'users');
    const user = await userModel2.create({ id, messages: ['m1', 'm2', 'm3'] });
    expect(Array.isArray(user.messages)).toBe(true);
  });
  test('client should create successfully when data has nested object', async () => {
    const userModel2 = new Model({ id: 0, name: '', surname: '', age: 1 }, 'users', { keyUnique: 'id' });
    const user = await userModel2.create({ id: Date.now(), info: { name: 'alihan', surname: 'sarac', contact: { tel: 123, email: 'asd' } } })
    expect(user.info.contact.tel).toBe(123);
  });
})

describe('model.findById()', () => {
  const userModel = new Model({ id: 0, name: '', surname: '', age: 1 }, 'users', { keyUnique: 'id' });

  test('client should find successfully when id is correct', async () => {
    const id = Date.now();
    await userModel.create({ id, name: 'alihan', surname: 'sarac', age: 20 })
    const user = await userModel.findById(id);
    expect(user).not.toBeNull();
  });
  test('client should get null when id is incorrect', async () => {
    const u = await userModel.findById(1000000);
    expect(u).toBeNull();
  });
  test('client should objeleri düngün bir şekilde getirilmeli', async () => {
    const id = Date.now();
    const userModel2 = new Model({ id: 0 }, 'users', { keyUnique: 'id', flexSchema: true });
    await userModel2.create({ id, info: { name: 'alihan', surname: 'sarac', contact: { tel: 123, email: 'asd' } } })
    const u = await userModel.findById(id);
    expect(u.info.contact.email).toBe('asd');
  });
});

describe('model.deleteById()', () => {
  const userModel = new Model({ id: 0, name: '', surname: '', age: 1 }, 'users', { keyUnique: 'id' });

  test('client should get 0 when record cant deleted', async () => {
    const u = await userModel.deleteById(100000);
    expect(u).toEqual(0);
  });
  test('client should get 1 when deleted succesfully', async () => {
    const id = Date.now();
    await userModel.create({ id, name: 'alihan', surname: 'sarac', age: 20 })
    const u = await userModel.deleteById(id);
    expect(u).toEqual(1);
  });
});

describe('model.deleteAll()', () => {
  const userModel = new Model({ id: 0, name: '', surname: '', age: 1 }, 'users', { keyUnique: 'id' });

  test('client should get 1 when this model\'s keys deleted succesfully', async () => {
    const isDeleted = await userModel.deleteAll();
    const isKeyExist = (await userModel.redisClient.keys(`${userModel.keyPrefix}:*`)).length > 0;
    expect(isDeleted && !isKeyExist).toEqual(true);
  });
  test('client should get 0 when records cant deleted', async () => {
    const isDeleted = await userModel.deleteAll();
    const isKeyExist = (await userModel.redisClient.keys(`${userModel.keyPrefix}:*`)).length > 0;
    expect(!isDeleted && !isKeyExist).toEqual(true);
  });
});

describe('model.getAll()', () => {
  const userModel = new Model({ id: 0, name: '', surname: '', age: 1 }, 'users', { keyUnique: 'id' });

  test('client should find succesfully when created new record', async () => {
    const id = Date.now();
    await userModel.create({ id, name: 'beyza', surname: 'erkan', age: 19 })
    const users = await userModel.getAll();
    expect(users).not.toBeNull();
  });

  test('client should get empty array when record deleted succesfully', async () => {
    const id = Date.now();
    await userModel.deleteAll();
    const users = await userModel.getAll();
    expect(users).toEqual([]);
  });
});
