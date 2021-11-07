import { buildParseInputDimensions, InputDimensions } from '../dimensionParser';
import { CompoundModel3D } from './compoundModel3D';
import { Subtraction } from './subtraction';
import { Cylinder, CylinderOrigin } from './cylinder';
import { CommonModel3DParams, OrientationAxis } from './model3D';
import { Translation } from './translation';

const dimensionNames = [
  'innerRadius',
  'innerDiameter',
  'wallThickness',
  'outerRadius',
  'outerDiameter',
  'axialLength',
] as const;

type DimensionNames = typeof dimensionNames;

const parseInputDimensions = buildParseInputDimensions<DimensionNames>(
  dimensionNames,
  {
    innerDiameter: '2 * innerRadius',
    outerDiameter: '2 * outerRadius',
    outerRadius: 'innerRadius + wallThickness',
  },
);

type TubeParams =
  CommonModel3DParams
  & InputDimensions<DimensionNames>
  & {
    axis: OrientationAxis;
    origin: CylinderOrigin;
  };

export class Tube extends CompoundModel3D {
  constructor({
    axis,
    origin,
    transforms = [],
    ...inputParams
  }: TubeParams) {
    const {
      innerDiameter,
      outerDiameter,
      axialLength,
    } = parseInputDimensions(inputParams);

    const lengthZ = axis === 'z' ? axialLength : outerDiameter;
    const positionTransform = {
      bottom: new Translation({ z: lengthZ / 2 }),
      center: new Translation({}),
      top: new Translation({ z: -lengthZ / 2 }),
    }[origin];

    super(
      new Subtraction({
        models: [
          new Cylinder({
            axis: 'z',
            origin: 'center',
            diameter: outerDiameter,
            axialLength,
          }),
          new Cylinder({
            axis: 'z',
            origin: 'center',
            diameter: innerDiameter,
            axialLength,
            transforms,
          }),
        ],
        transforms: [
          Cylinder.getOrientationTransform(axis),
          positionTransform,
          ...transforms,
        ],
      }),
    );
  }
}
