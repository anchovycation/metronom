[metronom](../README.md) / [Modules](../modules.md) / [Metronom](../modules/Metronom.md) / default

# Class: default

[Metronom](../modules/Metronom.md).default

Metronom model creator

## Table of contents

### Properties

- [redisClientOptions](Metronom.default.md#redisclientoptions)
- [log](Metronom.default.md#log)
- [#redisClient](Metronom.default.md##redisclient)

### Constructors

- [constructor](Metronom.default.md#constructor)

### Methods

- [define](Metronom.default.md#define)
- [setKey](Metronom.default.md#setkey)
- [getKey](Metronom.default.md#getkey)

## Properties

### redisClientOptions

• `Optional` **redisClientOptions**: `RedisClientOptions`<`Record`<`string`, `never`\>, `Record`<`string`, `never`\>\>

#### Defined in

[Metronom.ts:20](https://github.com/saracalihan/metronom/blob/b7ca806/lib/Metronom.ts#L20)

___

### log

• `Optional` **log**: `boolean` \| [`LogLevels`](../enums/Enums.LogLevels.md)

#### Defined in

[Metronom.ts:22](https://github.com/saracalihan/metronom/blob/b7ca806/lib/Metronom.ts#L22)

___

### #redisClient

• `Private` **#redisClient**: ``null`` \| `IRedisAdaptor`

#### Defined in

[Metronom.ts:24](https://github.com/saracalihan/metronom/blob/b7ca806/lib/Metronom.ts#L24)

## Constructors

### constructor

• **new default**(`options`)

Base Metronom object.
You can create new metronom instance with diffirent options like redis url.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`MetronomOptions`](../interfaces/Interfaces.MetronomOptions.md) | redis client settings |

## Methods

### define

▸ **define**(`schema`, `keyPrefix?`, `modelOptions?`): [`default`](Model.default.md)

Create metronom model from this Metronom object

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `schema` | [`Schema`](../interfaces/Interfaces.Schema.md) | `undefined` | Record's key-value schema |
| `keyPrefix` | `string` | `'object'` | Record unique key's prefix. `"users:1234"` --> "`keyPrefix`:`keyUnique`" |
| `modelOptions?` | [`ModelOptions`](../interfaces/Interfaces.ModelOptions.md) | `undefined` | - |

#### Returns

[`default`](Model.default.md)

new record of Model

___

### setKey

▸ **setKey**(`key`, `value`): `Promise`<`string`\>

Create String key or update if it exist.
Redis's "SET" command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | redis key |
| `value` | `any` | value |

#### Returns

`Promise`<`string`\>

it return "OK" if the process done

___

### getKey

▸ **getKey**(`key`): `Promise`<``null`` \| `string`\>

Read String key
Redis's "GET" command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Redis key |

#### Returns

`Promise`<``null`` \| `string`\>

if the key is exist it return the value else return null
