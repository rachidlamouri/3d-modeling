import {
  CompoundModel3D,
  Cylinder,
  Subtraction,
  Translation,
  Union,
} from '../../modeling';
import { projectorDimensions } from './dimensions';
import { Shade } from './shade';
import { Track } from './track';

export class ShadeAndTrack extends CompoundModel3D {
  constructor(translation: Translation = new Translation({})) {
    super(
      new Union({
        models: [
          new Shade(new Translation({ z: projectorDimensions.trackBaseHeight })),
          new Track(),
        ],
        transforms: [
          translation,
        ],
      }),
    );
  }
}

export class ShadeAndTrackLowerSliceTest extends CompoundModel3D {
  constructor() {
    const {
      trackBaseOuterDiameter,
      shadeHeight,
      trackBaseHeight,
      trackLipHeight,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new ShadeAndTrack(),
          new Cylinder({
            axis: 'z',
            origin: 'bottom',
            diameter: trackBaseOuterDiameter,
            axialLength: shadeHeight + trackBaseHeight,
            transforms: [
              new Translation({
                z: trackBaseHeight + trackLipHeight,
              }),
            ],
          }),
        ],
      }),
    );
  }
}
