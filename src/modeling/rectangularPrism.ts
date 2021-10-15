import { PrimitiveModel3D } from './primitiveModel3D';
import { Vector3DTuple } from './vector';

type OriginX = 'left' | 'center' | 'right';
type OriginY = 'back' | 'center' | 'front';
type OriginZ = 'bottom' | 'center' | 'top';
type OriginTuple = [OriginX, OriginY, OriginZ];

type RectangularPrismParams = {
  lengthX: number;
  lengthY: number;
  lengthZ: number;
  origin: OriginTuple;
}

export class RectangularPrism extends PrimitiveModel3D {
  params: RectangularPrismParams;

  constructor(inputParams: RectangularPrismParams) {
    const {
      lengthX,
      lengthY,
      lengthZ,
      origin,
    } = inputParams;
    const [originX, originY, originZ] = origin;

    const positionX = {
      left: lengthX / 2,
      center: 0,
      right: -lengthX / 2,
    }[originX];

    const positionY = {
      back: lengthY / 2,
      center: 0,
      front: -lengthY / 2,
    }[originY];

    const positionZ = {
      bottom: lengthZ / 2,
      center: 0,
      top: -lengthZ / 2,
    }[originZ];

    super({
      position: [positionX, positionY, positionZ],
    });

    this.params = inputParams;
  }

  get lengthX() {
    return this.params.lengthX;
  }

  get lengthY() {
    return this.params.lengthY;
  }

  get lengthZ() {
    return this.params.lengthZ;
  }

  get sizeTuple(): Vector3DTuple {
    return [this.lengthX, this.lengthY, this.lengthZ];
  }
}
