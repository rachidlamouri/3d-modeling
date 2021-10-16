import { Model3D } from './model3D';
import { Vector3DObject } from './vector';
import { Operation3D } from './operation3D';

type UnionParams = {
  models: Model3D[];
  rotation?: Partial<Vector3DObject>;
  translation?: Partial<Vector3DObject>;
}

export class Union extends Operation3D {
  models: Model3D[];

  constructor({
    models,
    rotation = {},
    translation = {},
  }: UnionParams) {
    if (models.length === 0) {
      throw Error('At least 1 model must be provided');
    }

    super({
      position: models[0].position,
      rotation,
      translation,
    });

    this.models = models;
  }
}
