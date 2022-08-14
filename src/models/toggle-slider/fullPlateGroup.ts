import _ from 'lodash';
import {
  CompoundModel3D,
  Translation,
  Union,
} from '../../modeling';
import { toggleSliderDimensions as d } from './dimensions';
import { FullPlate } from './fullPlate';

export type FullPlateGroupParameter = {
  count: number;
}

export class FullPlateGroup extends CompoundModel3D {
  constructor({ count }: FullPlateGroupParameter) {
    super(
      new Union({
        models: _.range(count).map((index) => new FullPlate({
          transforms: [
            new Translation({ y: index * -(d.basePlateLengthY - d.windowWallThickness) }),
          ],
        })) as [FullPlate, ...FullPlate[]],
      }),
    );
  }
}
