import * as jscad from '@jscad/modeling';
import { Vec3 } from '@jscad/modeling/src/maths/vec3';
import { Transform3D, TransformState } from './transform3D';
import { Vector3D } from './vector';
import { Translation } from './translation';
import { Rotation } from './rotation';

const {
  maths: { vec3 },
  utils: { degToRad },
} = jscad;

export type CommonModel3DParams = {
  transforms?: Transform3D[];
}

export type Model3DParams = {
  position: Vector3D;
  transforms: Transform3D[];
}

export abstract class Model3D {
  readonly position: Vector3D;
  readonly transforms: TransformState[];

  constructor({
    position,
    transforms,
  }: Model3DParams) {
    this.position = position;

    let previousPosition = position;
    let nextPosition: Vector3D;
    this.transforms = transforms.map((transform) => {
      if (transform instanceof Translation) {
        nextPosition = previousPosition.add(transform.vector);
      }

      if (transform instanceof Rotation) {
        const rotate = {
          x: vec3.rotateX,
          y: vec3.rotateY,
          z: vec3.rotateZ,
        }[transform.axis];
        const nextPositionTuple: Vec3 = vec3.create();
        const origin = transform.center === 'self'
          ? previousPosition.tuple
          : [0, 0, 0] as Vec3;
        const angle = degToRad(transform.angle);

        rotate(nextPositionTuple, previousPosition.tuple, origin, angle);
        nextPosition = new Vector3D(...nextPositionTuple);
      }

      const transformState: TransformState = [previousPosition, transform];
      previousPosition = nextPosition;
      return transformState;
    });
  }
}
