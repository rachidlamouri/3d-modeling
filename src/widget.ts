import { buildDimensionDefinitions } from './dimensionParser/parseDimensions';
import { buildParseInputDimensions, InputDimensions } from './dimensionParser/buildParseInputDimensions';
import {
  CompoundModel3D,
  RectangularPrism,
  Subtraction,
  Cylinder,
} from './modeling';

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

export class Widget extends CompoundModel3D {
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

    super(
      new Subtraction({
        minuend: new RectangularPrism({
          origin: ['center', 'center', 'bottom'],
          lengthX,
          lengthY,
          lengthZ,
        }),
        subtrahends: [
          new Cylinder({
            origin: 'bottom',
            lengthZ,
            radius: circleRadius,
          }),
        ],
      }),
    );
  }
}
