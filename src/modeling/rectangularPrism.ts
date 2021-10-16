import { buildParseInputDimensions, InputDimensions, Dimensions } from '../dimensionParser';
import { PrimitiveModel3D } from './primitiveModel3D';
import { Vector3DObject, Vector3DTuple } from './vector';

type OriginX = 'left' | 'center' | 'right';
type OriginY = 'back' | 'center' | 'front';
type OriginZ = 'bottom' | 'center' | 'top';
type OriginTuple = [OriginX, OriginY, OriginZ];

const dimensionNames = [
  'lengthX',
  'lengthY',
  'lengthZ',
] as const;

type RectangularPrismParams = InputDimensions<typeof dimensionNames> & {
  origin: OriginTuple;
  rotation?: Partial<Vector3DObject>;
  translation?: Partial<Vector3DObject>;
}

export class RectangularPrism extends PrimitiveModel3D {
  private dimensions: Dimensions<typeof dimensionNames>;

  static parseInputDimensions = buildParseInputDimensions(dimensionNames, {})

  constructor({
    origin,
    rotation = {},
    translation = {},
    ...inputDimensions
  }: RectangularPrismParams) {
    const dimensions = RectangularPrism.parseInputDimensions(inputDimensions);

    const [originX, originY, originZ] = origin;
    const {
      lengthX,
      lengthY,
      lengthZ,
    } = dimensions;

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
      rotation,
      translation,
    });

    this.dimensions = dimensions;
  }

  get lengthX() {
    return this.dimensions.lengthX;
  }

  get lengthY() {
    return this.dimensions.lengthY;
  }

  get lengthZ() {
    return this.dimensions.lengthZ;
  }

  get sizeTuple(): Vector3DTuple {
    return [this.lengthX, this.lengthY, this.lengthZ];
  }
}
