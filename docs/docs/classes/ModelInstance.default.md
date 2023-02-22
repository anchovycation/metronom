[metronom](../README.md) / [Modules](../modules.md) / [ModelInstance](../modules/ModelInstance.md) / default

# Class: default

[ModelInstance](../modules/ModelInstance.md).default

ModelInstance Class

## Indexable

▪ [index: `string`]: `any`

## Table of contents

### Properties

- [\_Model](ModelInstance.default.md#_model)

### Constructors

- [constructor](ModelInstance.default.md#constructor)

### Methods

- [save](ModelInstance.default.md#save)
- [getPureData](ModelInstance.default.md#getpuredata)
- [toJSON](ModelInstance.default.md#tojson)
- [destroy](ModelInstance.default.md#destroy)

## Properties

### \_Model

• **\_Model**: [`ModelFields`](../interfaces/Interfaces.ModelFields.md)

#### Defined in

[ModelInstance.ts:17](https://github.com/saracalihan/metronom/blob/b7ca806/lib/ModelInstance.ts#L17)

## Constructors

### constructor

• **new default**(`data`, `model`, `dataInfo`)

Represents an object produced from Metronom ORM Model

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | Lead data |
| `model` | [`default`](Model.default.md) | Parent model to generate object |
| `dataInfo` | [`DataInfo`](../interfaces/Interfaces.DataInfo.md) | The place where redis information about the record is kept. |

## Methods

### save

▸ **save**(): `Promise`<`void`\>

Saves the current state of the object to Redis.

#### Returns

`Promise`<`void`\>

___

### getPureData

▸ **getPureData**(): `Object`

Clears all metronome-related data within the object and restores it to its raw state.

#### Returns

`Object`

raw data

___

### toJSON

▸ **toJSON**(): `string`

Converts the object to JSON

#### Returns

`string`

stringified object

___

### destroy

▸ **destroy**(): `Promise`<`boolean`\>

Destroy the object from Redis.

#### Returns

`Promise`<`boolean`\>

Returns true or false that it has been deleted.
