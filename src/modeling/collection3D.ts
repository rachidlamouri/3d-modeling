import { Model3D } from './model3D';

export class Collection3D {
  models: Model3D[];

  constructor(models: Model3D[]) {
    this.models = models;
  }
}
