const Model = require('../dist').default;

let userModel = new Model({ name: 1, surname: 2, age: 1 }, 'users', { keyUnique: 'age' });

(async () => {
  let user = await userModel.create({ name: 'alihan', messages: ['asdasd', 'sdfbsrtdrgf'], age: 20, test: { a: 15, b: { c: [1, 2, true], d: false } } })
  console.log({ create: user });

  user.name = 'beyza';
  await user.save();

  user = await userModel.findById(user.age)
  console.log({ get: user });

  user = await userModel.deleteById(user.age)
  console.log({ delete: user });
})();
