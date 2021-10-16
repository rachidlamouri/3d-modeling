import { Model3D } from './model3D';

export abstract class Operation3D extends Model3D {}

export class NoOp3D extends Operation3D {
  model: Model3D;

  constructor(model: Model3D) {
    super(model);
    this.model = model;
  }
}
