import * as jscad from '@jscad/modeling';
import { Vec3 } from '@jscad/modeling/src/maths/vec3';
import { Transform3D, TransformState } from './transform3D';
import { Vector3D } from './vector';
import { Translation, NoTranslation } from './translation';
import { NoRotation, Rotation } from './rotation';

const {
  maths: { vec3 },
  utils: { degToRad },
} = jscad;

export type OrientationAxis = 'x' | 'y' | 'z';

export type CommonModel3DParams = {
  name?: string;
  transforms?: Transform3D[];
}

export type Model3DParams = {
  name: string;
  position: Vector3D;
  transforms: Transform3D[];
}

export abstract class Model3D {
  readonly name: string;
  readonly position: Vector3D;
  readonly transforms: Transform3D[];
  private memoizedTransformStates?: TransformState[];

  constructor({
    name,
    position,
    transforms,
  }: Model3DParams) {
    this.name = name;
    this.position = position;
    this.transforms = transforms;
  }

  get transformStates(): TransformState[] {
    if (this.memoizedTransformStates === undefined) {
      let previousPosition = this.position;
      let nextPosition: Vector3D;

      this.memoizedTransformStates = this.transforms
        .filter((transform) => (
          !(transform instanceof NoTranslation)
          && !(transform instanceof NoRotation)
        ))
        .map((transform) => {
          if (transform instanceof Translation) {
            nextPosition = previousPosition.add(transform.vector);
          } else if (transform instanceof Rotation) {
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
          } else {
            throw Error(`Unhandled ${Transform3D.name}: ${transform.constructor.name}`);
          }

          const transformState: TransformState = [previousPosition, transform];
          previousPosition = nextPosition;
          return transformState;
        });
    }

    return this.memoizedTransformStates;
  }
}
