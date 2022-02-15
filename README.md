# metronom
Easy to use Redis ORM based on [node-redis](https://www.npmjs.com/package/redis)
## Installation
```bash
npm install metronom
```
## Usage

### Basic Example
```js
const Model = require('metronom');

// create user model
// new Model(<model-schema>, <redis-key-prefix>, <model-options>)
const modelSchema = { // key: defaultValue 
  id: 0,
  name: '',
  age: 1,
  job: {
    name: 'teacher',
    room: 12,
    isManeger: false
  },
  tags: ['teacher', 'highschool', 'math']
},

const keyPrefix = 'users';  // default 'object'
const modelOptions = {
  keyUnique: 'name', // this value must be in to the schema because metronom use it to create redis key like "users:12". Default value is object's created time 
  redisClientOptions: { /* node-redis configration */ }
  flexSchema: false // if this value is true you cannot save a field outside the schema. Dafault value is false
}

// const userModel = new Model(modelSchema);
// const userModel = new Model(modelSchema, keyPrefix);
const userModel = new Model(modelSchema, keyPrefix, modelOptions);

const alice = await userModel.create({
  name: 'alice',
  age: 35
);

alice.age = 36;
await alice.save();

const response = await userModel.findById('alice');
console.log(response);
// {
//     name: 'alice',
//     age: 36,
//     job: {
//         name: 'teacher',
//         room: 205,
//         isManeger: true
//     },
//     tags:['teacher', 'highschool', 'music'] 
// }

await userModel.deleteById('alice');
// 1
```

## Contributors
<a href = "https://github.com/anchovycation/metronom/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=anchovycation/metronom"/>
</a>

## License
[GNU GENERAL PUBLIC LICENSE Version 3](./LICENSE)
