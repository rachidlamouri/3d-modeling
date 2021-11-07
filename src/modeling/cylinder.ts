import {
  buildParseInputDimensions,
  InputDimensions,
  Dimensions,
} from '../dimensionParser/buildParseInputDimensions';
import { PrimitiveModel3D } from './primitiveModel3D';
import { CommonModel3DParams } from './model3D';
import { Vector3D } from './vector';

const dimensionNames = [
  'diameter',
  'radius',
  'lengthZ',
  'height',
] as const;

type DimensionNames = typeof dimensionNames;

const parseInputDimensions = buildParseInputDimensions<DimensionNames>(
  dimensionNames,
  {
    diameter: '2 * radius',
    height: 'lengthZ',
  },
);

export type CylinderOrigin = 'bottom' | 'center' | 'top';

type CylinderParams =
  CommonModel3DParams
  & InputDimensions<DimensionNames>
  & {
    origin: CylinderOrigin;
  };

export class Cylinder extends PrimitiveModel3D {
  private dimensions: Dimensions<DimensionNames>;

  constructor({
    origin,
    transforms = [],
    ...inputParams
  }: CylinderParams) {
    const dimensions = parseInputDimensions(inputParams);

    const position = {
      bottom: new Vector3D(0, 0, dimensions.lengthZ / 2),
      center: new Vector3D(0, 0, 0),
      top: new Vector3D(0, 0, -dimensions.lengthZ / 2),
    }[origin];

    super({
      position,
      transforms,
    });

    this.dimensions = dimensions;
  }

  get diameter() {
    return this.dimensions.diameter;
  }

  get radius() {
    return this.dimensions.radius;
  }

  get lengthZ() {
    return this.dimensions.lengthZ;
  }
}
