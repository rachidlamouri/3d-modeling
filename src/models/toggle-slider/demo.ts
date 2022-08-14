import { Translation, Union } from '../../modeling';
import { BasePlate } from './basePlate';
import { WindowPlate } from './windowPlate';
import { toggleSliderDimensions as d } from './dimensions';
import { Slider } from './slider';
import { FullPlate } from './fullPlate';
import { FullPlateGroup } from './fullPlateGroup';

export default {
  basePlate: new BasePlate(),
  windowPlate: new WindowPlate(),
  slider: new Slider(),
  fullPlate: new FullPlate(),
  fullPlateGroupDemo: new FullPlateGroup({
    count: 3,
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
