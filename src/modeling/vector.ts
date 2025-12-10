export type Vector3DObject = {
  x: number;
  y: number;
  z: number;
};

export type Point2D = [x: number, y: number];

export type Vector2DTuple = [x: number, y: number];

export type Vector3DTuple = [x: number, y: number, z: number];

export class Vector2D {
  readonly x: number;
  readonly y: number;

  readonly tuple: Vector2DTuple;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.tuple = [x, y];
  }

  scale(factor: number): Vector2D {
    return new Vector2D(this.x * factor, this.y * factor);
  }
}

/**
 * @note I tried using the iterator protocol on Vector2DTuple and Vector2D, but
 * a class cannot define an iterator for a strongly typed tuple
 */
export class Vector2DLike {
  value: Vector2DTuple;
  constructor(vector: Vector2DTuple | Vector2D) {
    this.value = vector instanceof Vector2D ? vector.tuple : vector;
  }
}

export class Vector3D {
  #x: number;
  #y: number;
  #z: number;

  constructor(x: number, y: number, z: number) {
    this.#x = x;
    this.#y = y;
    this.#z = z;
  }

  add(vector: Vector3D) {
    return new Vector3D(
      this.#x + vector.#x,
      this.#y + vector.#y,
      this.#z + vector.#z,
    );
  }

  invert() {
    return new Vector3D(-this.#x, -this.#y, -this.#z);
  }

  get object(): Vector3DObject {
    return {
      x: this.#x,
      y: this.#y,
      z: this.#z,
    };
  }

  get tuple(): Vector3DTuple {
    return [this.#x, this.#y, this.#z];
  }
}
