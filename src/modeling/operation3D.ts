import { Model3D, Model3DParams, CommonModel3DParams } from './model3D';

type ModelList = [Model3D, ...Model3D[]];

export type CommonOperation3DParams =
  CommonModel3DParams
  & {
    models: ModelList;
  };

type Operation3DParams<T> =
  Omit<Model3DParams, 'position'>
  & {
    type: T;
    models: ModelList;
  }

export abstract class Operation3D extends Model3D {
  type: typeof Operation3D;
  models: ModelList;

  constructor({
    name,
    type,
    models,
    transforms,
  }: Operation3DParams<typeof Operation3D>) {
    super({
      name,
      position: models[0].position,
      transforms,
    });

    this.type = type;
    this.models = models;
  }
}
