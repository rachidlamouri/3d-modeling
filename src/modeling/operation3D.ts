import { Model3D } from './model3D';

export abstract class Operation3D extends Model3D {}

export class NoOp3D extends Operation3D {
  model: Model3D;

  constructor(model: Model3D) {
    super({
      position: [0, 0, 0],
      rotations: [],
      translation: { x: 0, y: 0, z: 0 },
    });
    this.model = model;
  }
}
