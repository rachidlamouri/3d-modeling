import {
  buildParseInputDimensions,
  buildDimensionDefinitions,
  InputDimensions,
  Dimensions,
} from '../dimensionParser';
import { PrimitiveModel3D } from './primitiveModel3D';
import { Vector3DTuple } from './vector';

const dimensionNames = [
  'diameter',
  'radius',
  'lengthZ',
] as const;

const dimensionDefinitions = buildDimensionDefinitions<typeof dimensionNames>(
  dimensionNames,
  {
    diameter: '2 * radius',
  },
);

type CylinderParams = InputDimensions<typeof dimensionNames> & {
  origin: 'bottom' | 'center' | 'top';
};

export class Cylinder extends PrimitiveModel3D {
  static parseInputDimensions = buildParseInputDimensions<
    typeof dimensionNames,
    keyof typeof dimensionDefinitions
  >(dimensionNames, dimensionDefinitions)

  private params: Dimensions<typeof dimensionNames>;

  constructor({ origin, ...inputParams }: CylinderParams) {
    const params = Cylinder.parseInputDimensions(inputParams);

    const position = {
      bottom: [0, 0, params.lengthZ / 2],
      center: [0, 0, 0],
      top: [0, 0, -params.lengthZ / 2],
    }[origin] as Vector3DTuple;

    super({ position });

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
