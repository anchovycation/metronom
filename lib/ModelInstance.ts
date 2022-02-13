import Model from './Model';
import { safeWrite } from './utility';

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
    const { _Model, ...data } = this;
    await safeWrite(data, _Model._dataInfo.redisKey, _Model._model.redisClient);
  }
}

export default ModelInstance;
