import { Model3D, CommonModel3DParams } from './model3D';
import { Operation3D } from './operation3D';

type SubtractionParams =
  CommonModel3DParams
  & {
    models: [Model3D, ...Model3D[]];
  }

export class Subtraction extends Operation3D {
  minuend: Model3D;
  subtrahends: Model3D[];

  constructor({
    models,
    transforms = [],
  }: SubtractionParams) {
    const [minuend, ...subtrahends] = models;

    super({
      position: minuend.position,
      transforms,
    });

    this.minuend = minuend;
    this.subtrahends = subtrahends;
  }
}
