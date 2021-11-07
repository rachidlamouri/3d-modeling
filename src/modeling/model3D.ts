import { Vector3D, Vector3DObject, Vector3DTuple } from './vector';

export type RotationInput = [Partial<Vector3DObject>, 'self' | 'origin'];

type Rotation = {
  angles: Vector3DTuple;
  offset: Vector3DTuple;
}

export type CommonModel3DParams = {
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
}

export type Model3DParams = {
  position: Vector3D;
  rotations: RotationInput[];
  translation: Partial<Vector3DObject>;
}

export abstract class Model3D {
  readonly position: Vector3D;
  readonly rotations: Rotation[];
  readonly translation: Vector3D;

  constructor({
    position,
    rotations: rotationInputs,
    translation,
  }: Model3DParams) {
    this.position = position;
    this.translation = new Vector3D(
      translation.x ?? 0,
      translation.y ?? 0,
      translation.z ?? 0,
    );

    this.position = position.add(this.translation);

    this.rotations = rotationInputs.map(([angles, type]) => {
      const { x = 0, y = 0, z = 0 } = angles;
      return {
        angles: [x, y, z],
        offset: type === 'self'
          ? (this.position.tuple.map((value) => -value) as Vector3DTuple)
          : [0, 0, 0],
      };
    });
  }
}
