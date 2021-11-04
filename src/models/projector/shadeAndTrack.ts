import { CompoundModel3D, Cylinder, Subtraction, Union, Vector3DObject } from '../../modeling';
import { projectorDimensions } from './dimensions';
import { Shade } from './shade';
import { Track } from './track';

export class ShadeAndTrack extends CompoundModel3D {
  constructor(translation: Partial<Vector3DObject> = {}) {
    super(
      new Union({
        models: [
          new Shade({ z: projectorDimensions.trackBaseHeight }),
          new Track(),
        ],
        translation,
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
            origin: 'bottom',
            diameter: trackBaseOuterDiameter,
            height: shadeHeight + trackBaseHeight,
            translation: {
              z: trackBaseHeight + trackLipHeight,
            },
          }),
        ],
      }),
    );
  }
}
