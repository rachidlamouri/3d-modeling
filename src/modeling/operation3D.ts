import { Model3D, Model3DParams, CommonModel3DParams } from './model3D';

export type CommonOperation3DParams =
  CommonModel3DParams
  & {
    models: Model3D[];
  };

type Operation3DParams<T> =
  Omit<Model3DParams, 'position'>
  & {
    type: T;
    models: Model3D[];
  }

export abstract class Operation3D extends Model3D {
  type: typeof Operation3D;
  models: Model3D[];

  constructor({
    name,
    type,
    models,
    transforms,
  }: Operation3DParams<typeof Operation3D>) {
    if (models.length === 0) {
      throw Error('Operations must have at least 1 model');
    }

    super({
      name,
      position: models[0].position,
      transforms,
    });

    this.type = type;
    this.models = models;
  }
}
