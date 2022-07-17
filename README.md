# metronom
![image](images/metronom.svg)


Metronom is user friendly Redis ORM based on  [node-redis](https://github.com/redis/node-redis)

You can  **save**,  **read**,  **update**,  **filter**,  **delete**  and  **bulk**  operations JavaScript objects in Redis  **without needing to know Redis commands**.

It is used effortlessly without installing any plugins like RedisJSON. The system works with Hashes. It shreds the objects and saves them as key strings in the hash, and while reading, they break it down again according to the given scheme and type conversion with TypeScript.

**Source Code**:  [anchovycation/metronom](https://github.com/anchovycation/metronom)  
**NPM Package**:  [https://www.npmjs.com/package/metronom](https://www.npmjs.com/package/metronom)
## Installation
```bash
npm install metronom
```

## Usage

### Model Basics
Represents a Metronom ORM Model. Returns new record of Model.

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
  { keyUnique: 'age' }
);
```
### CREATE Methods
#### `create`

Creates `ModelInstance` by parameter then saves it to Redis and returns it.
```js
// create user
// create(<value-object>)
const user = await userModel.create({ firstName: "Beyza", lastName: "Erkan" });
```
### READ Methods
#### `findById`
Fetches record by  `keyUnique` . Returns ModelInstance or null.
```js
// find user with id
// findById(<id>)
user = await userModel.findById(user.age);
console.log({ find: user.getPureData() });
```
#### `getAll`
Fetches all records with the same  `keyPrefix`  value. Returns list of ModelInstance.
```js
// find all users
let users = await userModel.getAll();
console.log({ getAll: users });
```
#### `filter`
Filters in the same way as  `Array.filter`, pulling all records with the same  `keyPrefix`  value. Returns filtred ModelInstances or empty array.
```js
// filters users by condition
// filter(filter-function)
// filter function takes the values  (value, index, array) and returns  `true`  then the record is filtered. It can be asynchronous function
users = await  userModel.filter((user) =>  user.age > 18);
console.log({ filter:  users })
```
### DELETE Methods
#### `deleteById`
Delete record by `keyUnique`.  Returns deleted records count it always '1' if it succesfull.
```js
// delete user with id
// deleteById(<id>)
user = await userModel.deleteById(user.age);
console.log({ delete: user });
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
### UPDATE Methods
#### `save`
Saves the current state of the object to Redis.
```js
// update user and save
let user = await userModel.create({ firstName: "Beyza", lastName: "Erkan" });
user.firstName = 'Michel';
await user.save();
```

### DELETE Methods
#### `destroy`
Destroy the object from Redis. Returns true or false that it has been deleted.
```js
// destroy user object
await  user.destroy();
```

### OTHER Methods
#### `getPureData`
Clears all metronome-related data within the object and restores it to its raw state. Returns raw data.
```js
// get raw data of user
user = await  userModel.findById(user.age);
console.log({ find:  user.getPureData() });
```
#### `toJSON`
Converts the object to JSON. Returns stringified object.
```js
// convert the user object to JSON
user = await  userModel.findById(user.age);
await user.toJSON()
```

## Contributors
<a href = "https://github.com/anchovycation/metronom/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=anchovycation/metronom"/>
</a>

## License
[GNU GENERAL PUBLIC LICENSE Version 3](./LICENSE)
