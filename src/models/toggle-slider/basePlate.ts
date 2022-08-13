import _ from 'lodash';
import {
  CompoundModel3D,
  RectangularPrism,
  Subtraction,
  Cylinder,
  Translation,
} from '../../modeling';
import { toggleSliderDimensions as d } from './dimensions';

export class BasePlate extends CompoundModel3D {
  constructor() {
    super(
      new Subtraction({
        models: [
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: d.basePlateLengthX,
            lengthY: d.basePlateLengthY,
            lengthZ: d.basePlateLengthZ,
          }),
          ..._.range(2).map((index) => (
            new Cylinder({
              axis: 'z',
              origin: 'bottom',
              diameter: d.magnetHoleDiameter,
              axialLength: d.magnetHoleLengthZ,
              transforms: [
                new Translation({ x: ((index === 0 ? -1 : 1) * d.centerToCenterLength) / 2 }),
              ],
            })
          )),
        ],
      }),
    );
  }
}
