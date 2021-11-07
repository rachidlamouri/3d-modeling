import { Transform3D } from './transform3D';
import { Vector3D, Vector3DObject } from './vector';

type RotationCenter = 'self' | 'origin';

const getKeys = <O>(object: O): (keyof O)[] => Object.keys(object) as (keyof O)[];

export class Rotation extends Transform3D {
  axis: 'x' | 'y' | 'z';
  angles: Vector3D;
  center: RotationCenter;

  constructor(angles: Partial<Vector3DObject>, center: RotationCenter) {
    const axes = getKeys(angles);
    if (axes.length > 1) {
      throw Error('Rotation can only have one of x, y or z');
    }

    super();
    ([this.axis] = axes);
    this.angles = new Vector3D(
      angles.x ?? 0,
      angles.y ?? 0,
      angles.z ?? 0,
    );
    this.center = center;
  }

  get angle() {
    return this.angles.object[this.axis];
  }
}

export class NoRotation extends Rotation {
  constructor() {
    super({ z: 0 }, 'self');
  }
}
