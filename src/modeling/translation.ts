import { Transform3D } from './transform3D';
import { Vector3D, Vector3DObject } from './vector';

export class Translation extends Transform3D {
  vector: Vector3D;

  constructor(translation: Partial<Vector3DObject>) {
    super();

    this.vector = new Vector3D(
      translation.x ?? 0,
      translation.y ?? 0,
      translation.z ?? 0,
    );
  }
}
