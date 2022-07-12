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

  let users = await userModel.getAll();
  console.log({ getAll: users });

  user = await userModel.deleteById(user.age);
  console.log({ delete: user });

  user = await flexUserModel.create({
    id: Date.now(),
    tel: 123456789,
    address: 'abcd'
  });
  console.log({ createFlex: user.getPureData() });

  users = await userModel.filter((user) => user.age > 18);
  console.log({ filter: users })
  
  let newUser = await userModel.create(data);
  newUser = await flexUserModel.findById(newUser.age);
  console.log({newUser: newUser})
  await newUser.destroy();
})();
