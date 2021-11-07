import { buildParseInputDimensions, InputDimensions } from '../../../dimensionParser/buildParseInputDimensions';
import {
  CompoundModel3D,
  RectangularPrism,
  Subtraction,
  Cylinder,
} from '../../../modeling';

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

type DimensionNames = typeof dimensionNames;

const parseInputDimensions = buildParseInputDimensions<DimensionNames>(
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
  constructor(inputDimensions: InputDimensions<DimensionNames>) {
    const {
      lengthX,
      lengthY,
      lengthZ,
      circleRadius,
    } = parseInputDimensions(inputDimensions);

    super(
      new Subtraction({
        models: [
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX,
            lengthY,
            lengthZ,
          }),
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
