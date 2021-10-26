import { Model3D, RotationInput } from './model3D';
import { Vector3DObject } from './vector';
import { Operation3D } from './operation3D';

type SubtractionParams = {
  models?: never;
  minuend: Model3D;
  subtrahends: Model3D[];
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
} | {
  models: [Model3D, ...Model3D[]];
  minuend?: never;
  subtrahends?: never;
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
}

export class Subtraction extends Operation3D {
  minuend: Model3D;
  subtrahends: Model3D[];

  constructor({
    models,
    minuend: inputMinuend,
    subtrahends: inputSubtrahends,
    rotations = [],
    translation = {},
  }: SubtractionParams) {
    if (models !== undefined && models.length === 0) {
      throw Error('"models" cannot be empty');
    }

    const minuend = inputMinuend !== undefined
      ? inputMinuend
      : (models as Model3D[])[0];

    const subtrahends = inputSubtrahends !== undefined
      ? inputSubtrahends
      : (models as Model3D[]).slice(1);

    super({
      position: minuend.position,
      rotations,
      translation,
    });

    this.minuend = minuend;
    this.subtrahends = subtrahends;
  }
}
