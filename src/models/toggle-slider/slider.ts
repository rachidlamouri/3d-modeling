import {
  CompoundModel3D,
  RectangularPrism,
  Subtraction,
  Cylinder,
  Translation,
  Transform3D,
} from '../../modeling';
import { toggleSliderDimensions as d } from './dimensions';

export type SliderParameter = {
  transforms?: Transform3D[];
}

export class Slider extends CompoundModel3D {
  constructor({ transforms = [] }: SliderParameter = {}) {
    super(
      new Subtraction({
        models: [
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: d.sliderLengthX,
            lengthY: d.sliderLengthY,
            lengthZ: d.sliderLengthZ,
          }),
          new Cylinder({
            axis: 'z',
            origin: 'bottom',
            diameter: d.magnetHoleDiameter,
            axialLength: d.sliderHoleLengthZ,
            transforms: [
              new Translation({ z: d.sliderBottomThickness }),
            ],
          }),
        ],
        transforms,
      }),
    );
  }
}
