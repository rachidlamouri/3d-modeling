import { buildParseInputDimensions, InputDimensions, Dimensions } from '../dimensionParser';
import { PrimitiveModel3D } from './primitiveModel3D';
import { RotationInput } from './model3D';
import { Vector3D, Vector3DObject } from './vector';

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
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
}

export class RectangularPrism extends PrimitiveModel3D {
  private dimensions: Dimensions<typeof dimensionNames>;

  static parseInputDimensions = buildParseInputDimensions(dimensionNames, {})

  constructor({
    origin,
    rotations = [],
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
      position: new Vector3D(positionX, positionY, positionZ),
      rotations,
      translation,
    });

    this.dimensions = dimensions;
  }

  get size() {
    return new Vector3D(
      this.dimensions.lengthX,
      this.dimensions.lengthY,
      this.dimensions.lengthZ,
    );
  }
}
