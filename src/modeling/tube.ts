import { buildParseInputDimensions, InputDimensions } from '../dimensionParser';
import { RotationInput } from './model3D';
import { CompoundModel3D } from './compoundModel3D';
import { Vector3DObject } from './vector';
import { Subtraction } from './subtraction';
import { Cylinder } from './cylinder';

const tubeDimensions = [
  'innerRadius',
  'innerDiameter',
  'wallThickness',
  'outerRadius',
  'outerDiameter',
  'lengthZ',
  'height',
] as const;

const parseTubeDimensions = buildParseInputDimensions<typeof tubeDimensions>(
  tubeDimensions,
  {
    innerDiameter: '2 * innerRadius',
    outerDiameter: '2 * outerRadius',
    outerRadius: 'innerRadius + wallThickness',
    height: 'lengthZ',
  },
);

type TubeParams = InputDimensions<typeof tubeDimensions> & {
  origin: 'bottom' | 'center' | 'top';
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
};

export class Tube extends CompoundModel3D {
  constructor({
    origin,
    rotations = [],
    translation = {},
    ...inputParams
  }: TubeParams) {
    const {
      innerDiameter,
      outerDiameter,
      lengthZ,
    } = parseTubeDimensions(inputParams);

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
        rotations,
        translation,
      }),
    );
  }
}
