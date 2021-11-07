export type Vector3DObject = {
  x: number;
  y: number;
  z: number;
}

export type Vector3DTuple = [x: number, y: number, z: number];

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
    return new Vector3D(
      -this.#x,
      -this.#y,
      -this.#z,
    );
  }

  get object(): Vector3DObject {
    return {
      x: this.#x,
      y: this.#y,
      z: this.#z,
    };
  }

  get tuple(): Vector3DTuple {
    return [
      this.#x,
      this.#y,
      this.#z,
    ];
  }
}
