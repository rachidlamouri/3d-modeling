import { CompoundModel3D } from './compoundModel3D';
import { RectangularPrism } from './rectangularPrism';
import { RectangularPrismCorners } from './rectangularPrismCorners';
import { Subtraction } from './subtraction';
import { Transform3D } from './transform3D';

type ComplexRectangularPrismParams = {
  name?: string;
  lengthX: number;
  lengthY: number;
  lengthZ: number;
  cornerRadius: number;
  transforms?: Transform3D[];
};

export class ComplexRectangularPrism extends CompoundModel3D {
  constructor({
    name,
    lengthX,
    lengthY,
    lengthZ,
    cornerRadius,
    transforms = [],
  }: ComplexRectangularPrismParams) {
    super(
      new Subtraction({
        name,
        models: [
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX,
            lengthY,
            lengthZ,
          }),
          new RectangularPrismCorners({
            lengthX,
            lengthY,
            lengthZ,
            cornerRadius,
          }),
        ],
        transforms,
      }),
    );
  }
}
