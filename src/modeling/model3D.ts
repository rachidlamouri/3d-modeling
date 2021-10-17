import { Vector3D, Vector3DObject, Vector3DTuple } from './vector';

export type RotationInput = [Partial<Vector3DObject>, 'self' | 'origin'];

type Rotation = {
  angles: Vector3DTuple;
  offset: Vector3DTuple;
}

export type Model3DParams = {
  position: Vector3D;
  rotations: RotationInput[];
  translation: Partial<Vector3DObject>;
}

export abstract class Model3D {
  #positionX: number;
  #positionY: number;
  #positionZ: number;
  #rotations: Rotation[];

  constructor({
    position,
    rotations: rotationInputs,
    translation,
  }: Model3DParams) {
    if (Array.isArray(position)) {
      ([
        this.#positionX,
        this.#positionY,
        this.#positionZ,
      ] = position);
    } else {
      ({
        x: this.#positionX,
        y: this.#positionY,
        z: this.#positionZ,
      } = position);
    }

    const {
      x: translationX = 0,
      y: translationY = 0,
      z: translationZ = 0,
    } = translation;

    this.#positionX += translationX;
    this.#positionY += translationY;
    this.#positionZ += translationZ;

    this.#rotations = rotationInputs.map(([angles, type]) => {
      const { x = 0, y = 0, z = 0 } = angles;
      return {
        angles: [x, y, z],
        offset: type === 'self'
          ? (this.positionTuple.map((value) => -value) as Vector3DTuple)
          : [0, 0, 0],
      };
    });
  }

  get position(): Vector3DObject {
    return {
      x: this.#positionX,
      y: this.#positionY,
      z: this.#positionZ,
    };
  }

  get positionTuple(): Vector3DTuple {
    return [this.#positionX, this.#positionY, this.#positionZ];
  }

  get rotations() {
    return this.#rotations;
  }
}
