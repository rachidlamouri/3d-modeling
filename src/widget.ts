import * as jscad from '@jscad/modeling';
import { Geom3 } from '@jscad/modeling/src/geometries/geom3';
import { buildDimensionDefinitions } from './dimensionParser/parseDimensions';
import { buildParseInputDimensions, InputDimensions } from './dimensionParser/buildParseInputDimensions';

const {
  booleans: { subtract },
  primitives: { cuboid, cylinder },
} = jscad;

const dimensionNames = [
  'lengthX',
  'lengthY',
  'lengthZ',
  'circleRadius',
  'circleDiameter',
  'xMargin',
  'leftXMargin',
  'rightXMargin',
  'yMargin',
  'backYMargin',
  'frontYMargin',
] as const;

const dimensionDefinitions = buildDimensionDefinitions<typeof dimensionNames>(
  dimensionNames,
  {
    leftXMargin: 'xMargin',
    rightXMargin: 'xMargin',
    backYMargin: 'yMargin',
    frontYMargin: 'yMargin',
    lengthX:
      'circleDiameter + 2 * xMargin',
    lengthY:
      'circleDiameter + 2 * yMargin',
    circleDiameter:
      '2 * circleRadius',
  },
);

export class Widget {
  #model: Geom3

  static parseInputDimensions = buildParseInputDimensions<
    typeof dimensionNames,
    keyof typeof dimensionDefinitions
  >(dimensionNames, dimensionDefinitions)

  constructor(inputDimensions: InputDimensions<typeof dimensionNames>) {
    const {
      lengthX,
      lengthY,
      lengthZ,
      circleRadius,
    } = Widget.parseInputDimensions(inputDimensions);

    this.#model = subtract(
      cuboid({ size: [lengthX, lengthY, lengthZ] }),
      cylinder({ height: lengthZ, radius: circleRadius }),
    );
  }

  get model() {
    return this.#model;
  }
}
