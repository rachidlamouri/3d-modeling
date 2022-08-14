import { Translation, Union } from '../../modeling';
import { BasePlate } from './basePlate';
import { WindowPlate } from './windowPlate';
import { toggleSliderDimensions as d } from './dimensions';
import { Slider } from './slider';

export default {
  basePlate: new BasePlate(),
  windowPlate: new WindowPlate(),
  slider: new Slider(),
  plateDemo: new Union({
    models: [
      new BasePlate(),
      new WindowPlate({
        transforms: [
          new Translation({ z: d.basePlateLengthZ }),
        ],
      }),
    ],
  }),
  sliderDemo: new Union({
    models: [
      new Slider({
        transforms: [
          new Translation({ x: -d.centerToCenterLength / 2, z: d.basePlateLengthZ }),
        ],
      }),
    ],
  }),
};
