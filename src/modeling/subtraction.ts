import { Model3D } from './model3D';
import { Vector3DObject } from './vector';
import { Operation3D } from './operation3D';

type SubtractionParams = {
  minuend: Model3D;
  subtrahends: Model3D[];
  rotation?: Partial<Vector3DObject>;
  translation?: Partial<Vector3DObject>;
}

export class Subtraction extends Operation3D {
  minuend: Model3D;
  subtrahends: Model3D[];

  constructor({
    minuend,
    subtrahends,
    rotation = {},
    translation = {},
  }: SubtractionParams) {
    super({
      position: minuend.position,
      rotation,
      translation,
    });

    this.minuend = minuend;
    this.subtrahends = subtrahends;
  }
}
