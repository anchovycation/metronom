import Model from './Model';

interface DataInfo {
  redisKey: String,
}

interface ModelFields {
  _model: Model;
  _previousDataValues: any | Object;
  _dataInfo: DataInfo;
}

class ModelInstance {
  /* eslint-disable no-undef */
  [index: string]: any // index signature

  public _Model: ModelFields;

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

  public async save(): Promise<void> {
    Object.entries(this)
      .filter(([key, value]) => !(key === '_Model'))
      .forEach(async ([key, value]) => {
        await this._Model._model.redisClient.hSet(this._Model._dataInfo.redisKey, key, value);
      });
  }
}

export default ModelInstance;
