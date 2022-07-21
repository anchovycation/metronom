import Model from './Model';
import { safeWrite } from './Utilities';

export interface DataInfo {
  redisKey: String,
}

interface ModelFields {
  _model: Model;
  _previousDataValues: any | Object;
  _dataInfo: DataInfo;
}

/**
 * ModelInstance Class
 * @class ModelInstance
 * @category ModelInstance
 */
class ModelInstance {
  /* eslint-disable no-undef */
  [index: string]: any // index signature

  public _Model: ModelFields;

  /**
   * Represents an object produced from Metronom ORM Model
   * @constructor
   * @param {Object} data - Lead data
   * @param {Model} model - Parent model to generate object
   * @param {DataInfo} dataInfo - The place where redis information about the record is kept.
   * @returns {ModelInstance} new record of ModelInstance
   */

  constructor(data: Object, model: Model, dataInfo: DataInfo) {
    this._Model = {
      _model: model,
      _previousDataValues: data,
      _dataInfo: dataInfo,
    };
    Object.entries(data).forEach(([key, defaultValue]) => {
      this[key] = defaultValue;
    });
  }

  /**
   * Saves the current state of the object to Redis.
   */
  public async save(): Promise<void> {
    const { _Model, ...data } = this;
    const { redisClient, flexSchema, schema } = _Model._model;
    await safeWrite(data, _Model._dataInfo.redisKey, redisClient, schema, flexSchema);
  }

  /**
   * Clears all metronome-related data within the object and restores it to its raw state.
   * @returns {Object} raw data
   */
  public getPureData(): Object {
    const { _Model, ...data } = this;
    return data;
  }

  /**
   * Converts the object to JSON
   * @returns {string} stringified object
   */
  public toJSON(): string {
    return JSON.stringify(this.getPureData());
  }

  /**
   * Destroy the object from Redis.
   * @returns {boolean} Returns true or false that it has been deleted.
   */
  public async destroy(): Promise<boolean> {
    const { redisClient } = this._Model._model;
    const willBeDeleted = await redisClient.del(`${this._Model._dataInfo.redisKey}`);
    return willBeDeleted !== 0;
  }
}

export default ModelInstance;
