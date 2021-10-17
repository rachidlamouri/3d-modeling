import { Model3D, RotationInput } from './model3D';
import { Vector3DObject } from './vector';
import { Operation3D } from './operation3D';

type SubtractionParams = {
  minuend: Model3D;
  subtrahends: Model3D[];
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
}

export class Subtraction extends Operation3D {
  minuend: Model3D;
  subtrahends: Model3D[];

  constructor({
    minuend,
    subtrahends,
    rotations = [],
    translation = {},
  }: SubtractionParams) {
    super({
      position: minuend.position,
      rotations,
      translation,
    });

    this.minuend = minuend;
    this.subtrahends = subtrahends;
  }
}
