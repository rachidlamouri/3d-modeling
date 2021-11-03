import { Model3D, RotationInput } from './model3D';
import { Vector3DObject } from './vector';
import { Operation3D } from './operation3D';

type SubtractionParams = {
  models: [Model3D, ...Model3D[]];
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
}

export class Subtraction extends Operation3D {
  minuend: Model3D;
  subtrahends: Model3D[];

  constructor({
    models,
    rotations = [],
    translation = {},
  }: SubtractionParams) {
    const [minuend, ...subtrahends] = models;

    super({
      position: minuend.position,
      rotations,
      translation,
    });

    this.minuend = minuend;
    this.subtrahends = subtrahends;
  }
}
