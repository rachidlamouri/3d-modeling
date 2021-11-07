import {
  buildParseInputDimensions,
  InputDimensions,
  Dimensions,
} from '../dimensionParser/buildParseInputDimensions';
import { PrimitiveModel3D } from './primitiveModel3D';
import { RotationInput } from './model3D';
import { Vector3DObject, Vector3D } from './vector';

const dimensionNames = [
  'diameter',
  'radius',
  'lengthZ',
  'height',
] as const;

type CylinderParams = InputDimensions<typeof dimensionNames> & {
  origin: 'bottom' | 'center' | 'top';
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
};

export class Cylinder extends PrimitiveModel3D {
  static parseInputDimensions = buildParseInputDimensions<typeof dimensionNames>(
    dimensionNames,
    {
      diameter: '2 * radius',
      height: 'lengthZ',
    },
  )

  private params: Dimensions<typeof dimensionNames>;

  constructor({
    origin,
    rotations = [],
    translation = {},
    ...inputParams
  }: CylinderParams) {
    const params = Cylinder.parseInputDimensions(inputParams);

    const position = {
      bottom: new Vector3D(0, 0, params.lengthZ / 2),
      center: new Vector3D(0, 0, 0),
      top: new Vector3D(0, 0, -params.lengthZ / 2),
    }[origin];

    super({
      position,
      rotations,
      translation,
    });

    this.params = params;
  }

  get diameter() {
    return this.params.diameter;
  }

  get radius() {
    return this.params.radius;
  }

  get lengthZ() {
    return this.params.lengthZ;
  }
}
