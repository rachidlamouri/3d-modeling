import { Model3D } from './model3D';
import { Operation3D } from './operation3D';

export abstract class CompoundModel3D extends Model3D {
  operation: Operation3D;

  constructor(operation: Operation3D) {
    super({ position: operation.position });
    this.operation = operation;
  }
}
