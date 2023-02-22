# Lets Start
## 1. Create `Metronom` object
The `Metronom` object is create `Model` with your defined options like `port`, `host`, `url` or `ttl`. This step is not required but **recomended** because at the unnormal usage scenario(you need to use diffirent url from default redis ...) you must to pass that options to all `Model` defines otherwise `Metronom` object do it automatically.

```js
import { Metronom, LogLevels } from 'metronom';

const metronom = new Metronom({
  redisClientOptions: {
    host: '172.168.1.123',
    port: 1234
  },
  log: LogLevels.Error
});
```

## 2. Define `Model`
`Model` is redis hash maper. It has two diffirent flow.
+ `flex`: you don't need to define schema. All hash keys dynamically mapped
+ `schema based`: You define type, default value etc. in to the schema and metronom use it read/write operations. Keys not found in the schema are ignored.

```js
const tokenModel = metronom.define(
// const userModel = new Model(
  schema, redisKeyPrefix, modelOptions
);
```
### 2.1 Get/Set String Key
  Now, you can get/set key from defined metronom object
  ```js
  
    const isSuccess = await metronom.setKey('foo', 'bar'); // its return "OK"
    const value = await metronom.getKey('foo'); // bar
  ```

## 3. Define model
`Model` is redis hash maper. It has two diffirent flow.
+ `flex`: you don't need to define schema. All hash keys dynamically mapped
+ `schema based`: You define type, default value etc. in to the schema and metronom use it read/write operations. Keys not found in the schema are ignored.
```js
const userModel = metronom.define(
// const userModel = new Model(
  schema, redisKeyPrefix, modelOptions
);
```

## 4. Use model's query inferface
Now, you can use all metronom queries(`Metronom`, `Model` and `ModelInstance`) like `Model.create`, `Model.findById`, `Model.destroy`, `ModelInstance.save`, etc. .

Start coding the project that will save the world :)

**For example**:
```js

const tokenModel = metronom.define(
// const tokenModel = new Model(
  {
    value: {
      type: Types.String,
      default: null,
    },
    id: {
      type: Types.Number,
    },
    permissions: {
      type: Types.Array,
      default: ['none'],
    },
    expireDate: {
      type: Types.Boolean,
      dafeult: null,
    }
  },
  'tokens', // default `object`
  { 
    keyUnique: 'id', // if you don't define, we use unix timestamp for `keyUniqe` value
    log: LogLevels.All, // default is `None`
    // set `flexSchema` to true and never define schema
  }
);

let token = await tokenModel.create({
  id: 1,
  value: 'foobarbaz',
});
// Redis key - 'tokens:1'
// {
//   id: 1,
//   value: 'foobarbaz',
//   permissions: ['none'],
//   expireDate: null,
// }

token.permissions.shift();
token.permissions.push('read');
token.permissions.push('update');

await token.save();

// hgetall tokens:1
let admin = await tokenModel.findById(1);
// {
//   id: 1,
//   value: 'foobarbaz',
//   permissions: ['read', 'update'],
//   expireDate: null,
// }

// del tokens:1
await admin.destroy();
```