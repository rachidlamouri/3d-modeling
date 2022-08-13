import { Translation, Union } from '../../modeling';
import { BasePlate } from './basePlate';
import { WindowPlate } from './windowPlate';
import { toggleSliderDimensions as d } from './dimensions';

export default {
  basePlate: new BasePlate(),
  windowPlate: new WindowPlate(),
  demo: new Union({
    models: [
      new BasePlate(),
      new WindowPlate({
        transforms: [
          new Translation({ z: d.basePlateLengthZ }),
        ],
      }),
    ],
  }),
};
