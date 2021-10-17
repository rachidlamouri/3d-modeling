import { Model3D, RotationInput } from './model3D';
import { Vector3DObject } from './vector';
import { Operation3D } from './operation3D';

type UnionParams = {
  models: Model3D[];
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
}

export class Union extends Operation3D {
  models: Model3D[];

  constructor({
    models,
    rotations = [],
    translation = {},
  }: UnionParams) {
    if (models.length === 0) {
      throw Error('At least 1 model must be provided');
    }

    super({
      position: models[0].position,
      rotations,
      translation,
    });

    this.models = models;
  }
}
