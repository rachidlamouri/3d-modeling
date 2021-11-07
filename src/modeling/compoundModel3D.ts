import { Vector3D } from './vector';
import { Model3D } from './model3D';
import { Operation3D } from './operation3D';

export abstract class CompoundModel3D extends Model3D {
  operation: Operation3D;

  constructor(operation: Operation3D) {
    super({
      position: new Vector3D(0, 0, 0),
      transforms: [],
    });
    this.operation = operation;
  }
}
