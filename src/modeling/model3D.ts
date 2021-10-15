import { Vector3D, Vector3DObject, Vector3DTuple } from './vector';

type Model3DParams = {
  position: Vector3D;
};

export abstract class Model3D {
  #positionX: number;
  #positionY: number;
  #positionZ: number;

  constructor({ position }: Model3DParams) {
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
}
