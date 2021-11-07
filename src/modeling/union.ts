import { Model3D, CommonModel3DParams } from './model3D';
import { Operation3D } from './operation3D';

type UnionParams =
  CommonModel3DParams
  & {
    models: Model3D[];
  }

export class Union extends Operation3D {
  models: Model3D[];

  constructor({
    name = 'Union',
    models,
    transforms = [],
  }: UnionParams) {
    if (models.length === 0) {
      throw Error('At least 1 model must be provided');
    }

    super({
      name,
      position: models[0].position,
      transforms,
    });

    this.models = models;
  }
}
