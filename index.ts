import Model from './lib/Model';
import Metronom from './lib/Metronom';
import ModelInstance from './lib/ModelInstance';
import * as Constants from './lib/Constants';
import * as Interfaces from './lib/Interfaces';
import * as Enums from './lib/Enums';

export = {
  Model,
  ModelInstance,
  Metronom,
  ...Constants,
  ...Interfaces,
  ...Enums,
};
