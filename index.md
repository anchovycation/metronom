## Welcome to Metronom
Metronome is a high-level and easy-to-use **[Redis](https://redis.io/)** ORM based on **[node-redis](https://github.com/redis/node-redis)**. It provides ease of use by keeping your objects in hash on Redis without the need to install any plugins.

If the type of the value in your object is supported by Redis, it keeps it in its own type. If it is among unsupported types such as array, object, it converts the data to JSON and keeps it as a string in Redis, and while reading it, it converts it back to JavaScript types according to the schema you specify.

### Usage
First you have to download metronome in to your project via npm
```bash
npm install metronom
```
Now you can import **metronom**

```js
const Model = require('metronom');

// create user model
const modelSchema = { // key: defaultValue 
  name: '',
  age: 1,
  job: {
    name: 'teacher',
    room: 12,
    isManeger: false
  },
  tags: ['teacher', 'highschool', 'math']
},

const userModel = new Model(modelSchema, 'users');

const alice = await userModel.create({
  name: 'alice',
  age: 35
);
// {
//     name: 'alice',
//     age: 35,
//     job: {
//         name: 'teacher',
//         room: 205,
//         isManeger: false
//     },
//     tags:['teacher', 'highschool', 'music'] 
// }


alice.job.isManager = true;
await alice.save();
// {
//     name: 'alice',
//     age: 35,
//     job: {
//         name: 'teacher',
//         room: 205,
//         isManeger: true
//     },
//     tags:['teacher', 'highschool', 'music'] 
// }
```
> Other commands will be added as soon as possible. For detailed information, you can visit our GitHub address.
### Support or Contact
Having trouble with **[metronom]()**? Check out our [GitHub issues](https://github.com/anchovycation/metronom/issues) or contact support and we’ll help you sort it out.
