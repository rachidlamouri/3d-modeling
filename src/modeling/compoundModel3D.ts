import { Model3D } from './model3D';
import { Operation3D } from './operation3D';

export abstract class CompoundModel3D extends Model3D {
  operation: Operation3D;

  constructor(operation: Operation3D) {
    super({
      position: [0, 0, 0],
      rotations: [],
      translation: { x: 0, y: 0, z: 0 },
    });
    this.operation = operation;
  }
}
