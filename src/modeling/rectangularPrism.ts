import { buildParseInputDimensions, InputDimensions, Dimensions } from '../dimensionParser';
import { PrimitiveModel3D } from './primitiveModel3D';
import { CommonModel3DParams } from './model3D';
import { Vector3D } from './vector';

type OriginX = 'left' | 'center' | 'right';
type OriginY = 'back' | 'center' | 'front';
type OriginZ = 'bottom' | 'center' | 'top';
type OriginTuple = [OriginX, OriginY, OriginZ];

const dimensionNames = [
  'lengthX',
  'lengthY',
  'lengthZ',
] as const;

type DimensionNames = typeof dimensionNames;

const parseInputDimensions = buildParseInputDimensions(dimensionNames, {});

export type RectangularPrismParams =
  CommonModel3DParams
  & InputDimensions<DimensionNames>
  & {
    origin: OriginTuple;
  }

export class RectangularPrism extends PrimitiveModel3D {
  private dimensions: Dimensions<DimensionNames>;

  constructor({
    name = 'Rectangular Prism',
    origin,
    transforms = [],
    ...inputDimensions
  }: RectangularPrismParams) {
    const dimensions = parseInputDimensions(inputDimensions);

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
      name,
      position: new Vector3D(positionX, positionY, positionZ),
      transforms,
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
