import {
  CompoundModel3D,
  Transform3D,
  Translation,
  Union,
} from '../../modeling';
import { BasePlate } from './basePlate';
import { toggleSliderDimensions as d } from './dimensions';
import { WindowPlate } from './windowPlate';

export type FullPlateParameter = {
  transforms?: Transform3D[];
}

export class FullPlate extends CompoundModel3D {
  constructor({ transforms }: FullPlateParameter = {}) {
    super(
      new Union({
        models: [
          new BasePlate(),
          new WindowPlate({
            transforms: [
              new Translation({ z: d.basePlateLengthZ }),
            ],
          }),
        ],
        transforms,
      }),
    );
  }
}
