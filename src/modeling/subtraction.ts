import { Model3D } from './model3D';
import { Operation3D } from './operation3D';

type SubtractionParams = {
  minuend: Model3D;
  subtrahends: Model3D[];
}

export class Subtraction extends Operation3D {
  minuend: Model3D;
  subtrahends: Model3D[];

  constructor({ minuend, subtrahends }: SubtractionParams) {
    super();
    this.minuend = minuend;
    this.subtrahends = subtrahends;
  }

  get position() {
    return this.minuend.position;
  }
}
