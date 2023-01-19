<h1 align="center">
  <img/ width="280" src="images/metronom.svg" alt="metronom logo"> <br>
  <a href="https://anchovycation.github.io/metronom/">metronom</a>
</h1>

<h6 align="center">

[![npm version](https://badgen.net/npm/v/metronom)](https://www.npmjs.com/package/metronom)
[![download](https://badgen.net/npm/dt/metronom)](https://www.npmjs.com/package/metronom)
[![merged prs](https://badgen.net/github/merged-prs/anchovycation/metronom)](https://github.com/anchovycation/metronom)
[![last commit](https://badgen.net/github/last-commit/anchovycation/metronom/main)](https://github.com/anchovycation/metronom)
[![types](https://badgen.net/npm/types/metronom)](https://github.com/anchovycation/metronom)
[![license](https://badgen.net/npm/license/metronom)](https://www.npmjs.com/package/metronom)

</h6>

Metronom is user friendly Redis ORM based on  [node-redis](https://github.com/redis/node-redis) 

You can  **save**,  **read**,  **update**,  **filter**,  **delete**  and  **bulk**  operations JavaScript objects in Redis  **without needing to know Redis commands**.

It is used effortlessly without installing any plugins like RedisJSON. The system works with Hashes. It shreds the objects and saves them as key strings in the hash, and while reading, they break it down again according to the given scheme and type conversion with TypeScript.

## Let's start
### 1. Install `metronom`
Firstly, instal this package to your project via your package manager.
**npm**:
```bash
npm i metronom
```
**yarn**:
```bash
yarn add metronom
```
### 2. Create `Metronom` object
The `Metronom` object is create `Model` with your defined options like port, host, url or ttl. This step is not required but **recomended** because at the unnormal usage scenario(you need to use diffirent url from default redis ...) you must to pass that options to all `Model` defines otherwise `Metronom` object do it automaticly.

```js
import { Metronom } from 'metronom';

const metronom = new Metronom({
  host: '172.168.1.123',
  port: 1234
});
```

### 3. Define `Model`
`Model` is redis hash maper. It has two diffirent flow.
+ `flex`: you don't need to define schema. All hash keys dynamicly mapped
+ 'schema based': You define type, default value etc. in to the schema and metronom use it read/write operation. Keys not found in the schema are ignored.
```js
const userModel = metronom.define(
// const userModel = new Model(
  schema, redisKeyPrefix, modelOptions
);
```
### 4. Use model's query inferface
Now, you can use all metronom queries(`Metronom`, `Model` and `ModelInstance`) like `Model.create`, `Model.findById`, `Model.destroy`, `ModelInstance.save`, etc. .Start conding the project that will save the world

**For example**:
```js
const { Metronom, Model, Types } = require('metronom');

const metronom = new Metronom({
  url: "redis://localhost:6380",
  // redisClient options
});

const userModel = metronom.define(
// const userModel = new Model(
  {
    name: {
      type: Types.String,
    },
    surname: {
      type: Types.String,
    },
    age: {
      type: Types.Number,
      default: 1
    },
    isAdmin: {
      type: Types.Boolean,
      dafeult: false,
    }
  },
  'users',
  { 
    keyUnique: 'name',
    // set `flexSchema` to true and never define schema
  }
);

let user = await userModel.create({
  name: 'Chandler',
  surname: 'Bing',
  age: 18,
});
// Redis key - 'users:Chandler'
// {
//  name: 'Chandler',
//  surname: 'Bing',
//  age: 18,
//  isAdmin: false
// }

user.isAdmin = true;
await user.save();

let admin = userModel.findById('Chandler');
// {
//  name: 'Chandler',
//  surname: 'Bing',
//  age: 18,
//  isAdmin: true
// }

// del users:Chandler
await admin.destroy();
```
**Source Code**:  [anchovycation/metronom](https://github.com/anchovycation/metronom)  
**NPM Package**:  [https://www.npmjs.com/package/metronom](https://www.npmjs.com/package/metronom)

## Commands

### Model Basics
Represents the Redis object you created in your database. You can create, read, update, delete, filter operations. It also includes system information.
```js
// create user model
// new Model(<model-schema>, <redis-key-prefix>, <model-options>)
const userModel = new Model(
  {
    name: 'John',
    surname: 'Doe',
    age: 1,
    isAdmin: false
  },
  'users',
  { keyUnique: 'name' }
);
```
### CREATE Methods
#### `create`

Creates `ModelInstance` by parameter then saves it to Redis and returns it.
```js
// create user
// create(<value-object>)
const user = await userModel.create({ name: "Beyza", surname: "Erkan" });
// { 
//   firstName: "Beyza",
//   lastName: "Erkan",
//   age: 1,
//   isAdmin: false,
//   _Model: {
//     _model: Model,
//     _dataInfo: {
//       redisKey: 'users:Beyza'
//     }
//   }
// }

```
### READ Methods
#### `findById`
Fetches record by  `keyUnique` . Returns ModelInstance or null.
```js
// find user with id
// findById(<id>)
user = await userModel.findById(user.name);
console.log({ user: user.getPureData() });
```
#### `getAll`
Fetches all records with the same  `keyPrefix`  value. Returns list of ModelInstance.
```js
// find all users
let users = await userModel.getAll();
console.log({ users });
```
#### `filter`
Filters in the same way as  `Array.filter`, pulling all records with the same  `keyPrefix`  value. Returns filtred ModelInstances or empty array.
```js
// filters users by condition
// filter(filter-function)
// filter function takes the values  (value, index, array) and returns  `true`  then the record is filtered. It can be asynchronous function
let users = await  userModel.filter((user) =>  user.age > 18);
console.log({ users })
```
### DELETE Methods
#### `deleteById`
Delete record by `keyUnique`.  Returns deleted records count it always '1' if it succesfull.
```js
// delete user with id
// deleteById(<id>)
let isDeleted = await userModel.deleteById(user.name);
console.log({ isDeleted });
```
#### `deleteAll`
Delete all records with the same  `keyPrefix`  value. Returns deleted records count or 0.
```js
// delete all users
await userModel.deleteAll();
```
### Other Methods
#### `runCommand`
Redis command executer.
```js
// runCommand(<commands>)
runCommand(['hget', 'user:1234', 'name'])
```

## ModelInstance Basics
It is the object from the Redis. You can directly process on the record then save or destroy it.
### UPDATE Methods
#### `save`
Saves the current state of the object to Redis.
```js
// update user and save
let user = await userModel.create({ name: "Beyza", surname: "Erkan" });
user.age = 20;
await user.save();
```

### DELETE Methods
#### `destroy`
Destroy the object from Redis. Returns true or false that it has been deleted.
```js
// destroy this user object
await  user.destroy();
```

### OTHER Methods
#### `getPureData`
Clears all metronom-related data within the object and restores it to its raw state. Returns raw data.
```js
// get raw data of user
user = await  userModel.findById(user.name);
console.log({ user:  user.getPureData() });
```
#### `toJSON`
Converts the object to JSON. Returns stringified object.
```js
// convert the user object to JSON
user = await  userModel.findById(user.name);
console.log({ user: user.toJSON() });
```

## Contributors
<a href = "https://github.com/anchovycation/metronom/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=anchovycation/metronom"/>
</a>

## License
[GNU GENERAL PUBLIC LICENSE Version 3](./LICENSE)
