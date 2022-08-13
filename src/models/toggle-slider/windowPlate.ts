import {
  CompoundModel3D,
  RectangularPrism,
  Subtraction,
  Transform3D,
} from '../../modeling';
import { toggleSliderDimensions as d } from './dimensions';

export type WindowPlateParameter = {
  transforms?: Transform3D[];
}

export class WindowPlate extends CompoundModel3D {
  constructor({ transforms = [] }: WindowPlateParameter = {}) {
    super(
      new Subtraction({
        models: [
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: d.windowPlateLengthX,
            lengthY: d.windowPlateLengthY,
            lengthZ: d.windowPlateLengthZ,
          }),
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: d.windowPlateHoleLengthX,
            lengthY: d.windowPlateHoleLengthY,
            lengthZ: d.windowPlateHoleLengthZ,
          }),
        ],
        transforms,
      }),
    );
  }
}
