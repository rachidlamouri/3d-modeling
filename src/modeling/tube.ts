import { buildParseInputDimensions, InputDimensions } from '../dimensionParser';
import { CompoundModel3D } from './compoundModel3D';
import { Subtraction } from './subtraction';
import { Cylinder, CylinderOrigin } from './cylinder';
import { CommonModel3DParams } from './model3D';

const dimensionNames = [
  'innerRadius',
  'innerDiameter',
  'wallThickness',
  'outerRadius',
  'outerDiameter',
  'lengthZ',
  'height',
] as const;

type DimensionNames = typeof dimensionNames;

const parseInputDimensions = buildParseInputDimensions<DimensionNames>(
  dimensionNames,
  {
    innerDiameter: '2 * innerRadius',
    outerDiameter: '2 * outerRadius',
    outerRadius: 'innerRadius + wallThickness',
    height: 'lengthZ',
  },
);

type TubeParams =
  CommonModel3DParams
  & InputDimensions<DimensionNames>
  & {
    origin: CylinderOrigin
  };

export class Tube extends CompoundModel3D {
  constructor({
    origin,
    transforms = [],
    ...inputParams
  }: TubeParams) {
    const {
      innerDiameter,
      outerDiameter,
      lengthZ,
    } = parseInputDimensions(inputParams);

    super(
      new Subtraction({
        models: [
          new Cylinder({
            origin,
            diameter: outerDiameter,
            lengthZ,
          }),
          new Cylinder({
            origin,
            diameter: innerDiameter,
            lengthZ,
          }),
        ],
        transforms,
      }),
    );
  }
}
