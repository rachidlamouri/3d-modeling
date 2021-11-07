import {
  buildParseInputDimensions,
  InputDimensions,
  Dimensions,
} from '../dimensionParser/buildParseInputDimensions';
import { PrimitiveModel3D } from './primitiveModel3D';
import { CommonModel3DParams, OrientationAxis } from './model3D';
import { Vector3D } from './vector';
import { Rotation } from './rotation';

const dimensionNames = [
  'diameter',
  'radius',
  'axialLength',
] as const;

type DimensionNames = typeof dimensionNames;

const parseInputDimensions = buildParseInputDimensions<DimensionNames>(
  dimensionNames,
  {
    diameter: '2 * radius',
  },
);

export type CylinderOrigin = 'bottom' | 'center' | 'top';

type CylinderParams =
  CommonModel3DParams
  & InputDimensions<DimensionNames>
  & {
    axis: OrientationAxis;
    origin: CylinderOrigin;
  };

export class Cylinder extends PrimitiveModel3D {
  static getOrientationTransform(axis: OrientationAxis) {
    if (axis === 'x') {
      return new Rotation({ y: 90 }, 'self');
    }

    if (axis === 'y') {
      return new Rotation({ x: -90 }, 'self');
    }

    return new Rotation({ z: 0 }, 'self');
  }

  private dimensions: Dimensions<DimensionNames>;

  constructor({
    name = 'Cylinder',
    axis,
    origin,
    transforms = [],
    ...inputParams
  }: CylinderParams) {
    const dimensions = parseInputDimensions(inputParams);

    const {
      axialLength,
      diameter,
    } = dimensions;

    const lengthZ = axis === 'z' ? axialLength : diameter;
    const position = {
      bottom: new Vector3D(0, 0, lengthZ / 2),
      center: new Vector3D(0, 0, 0),
      top: new Vector3D(0, 0, -lengthZ / 2),
    }[origin];

    super({
      name,
      position,
      transforms: [
        Cylinder.getOrientationTransform(axis),
        ...transforms,
      ],
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
    return this.dimensions.axialLength;
  }
}
