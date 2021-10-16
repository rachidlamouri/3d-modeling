import { Vector3D, Vector3DObject, Vector3DTuple } from './vector';

const degreesToRadian = (degrees: number) => (degrees * Math.PI) / 180;

export type Model3DParams = {
  position: Vector3D;
  rotation: Partial<Vector3DObject>;
  translation: Partial<Vector3DObject>;
}

export abstract class Model3D {
  #positionX: number;
  #positionY: number;
  #positionZ: number;
  #rotationX: number;
  #rotationY: number;
  #rotationZ: number;
  #translationX: number;
  #translationY: number;
  #translationZ: number;

  constructor({ position, rotation = {}, translation = {} }: Model3DParams) {
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
      x: rotationX = 0,
      y: rotationY = 0,
      z: rotationZ = 0,
    } = rotation;

    this.#rotationX = rotationX;
    this.#rotationY = rotationY;
    this.#rotationZ = rotationZ;

    const {
      x: translationX = 0,
      y: translationY = 0,
      z: translationZ = 0,
    } = translation;

    this.#translationX = translationX;
    this.#translationY = translationY;
    this.#translationZ = translationZ;
  }

  hasRotation() {
    return this.rotationTuple.some((value) => value !== 0);
  }

  hasTranslation() {
    return this.translationTuple.some((value) => value !== 0);
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

  get rotation(): Vector3DObject {
    return {
      x: this.#rotationX,
      y: this.#rotationY,
      z: this.#rotationZ,
    };
  }

  get rotationTuple(): Vector3DTuple {
    return [
      this.#rotationX,
      this.#rotationY,
      this.#rotationZ,
    ];
  }

  get rotationTupleRadians(): Vector3DTuple {
    return [
      degreesToRadian(this.#rotationX),
      degreesToRadian(this.#rotationY),
      degreesToRadian(this.#rotationZ),
    ];
  }

  get translation(): Vector3DObject {
    return {
      x: this.#translationX,
      y: this.#translationY,
      z: this.#translationZ,
    };
  }

  get translationTuple(): Vector3DTuple {
    return [
      this.#translationX,
      this.#translationY,
      this.#translationZ,
    ];
  }
}
