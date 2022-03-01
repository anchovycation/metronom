const Model = require('../dist');

const userModel = new Model(
  {
    name: 'John',
    surname: 'Doe',
    age: 1,
    isAdmin: false
  },
  'users',
  { keyUnique: 'age' }
);

const flexUserModel = new Model(
  {
    id: 1
  },
  'users',
  { keyUnique: 'id', flexSchema: true }
);

(async () => {
  const data = {
    surname: 'Black',
    age: Date.now(),
    job: 'teacher' // Dont save because userModel is not flex
  };
  let user = await userModel.create(data);
  console.log({ create: user.getPureData() });

  user.name = 'Michel';
  await user.save();

  user = await userModel.findById(user.age);
  console.log({ find: user.getPureData() });

  user = await userModel.getAll();
  console.log({ getAll: user });

  user = await userModel.deleteById(user.age);
  console.log({ delete: user });

  user = await flexUserModel.create({
    id: Date.now(),
    tel: 123456789,
    address: 'abcd'
  });
  console.log({ createFlex: user.getPureData() });
})();
