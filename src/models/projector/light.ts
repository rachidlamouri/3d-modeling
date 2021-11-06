import {
  CompoundModel3D,
  Vector3DObject,
  Union,
  Cylinder,
} from '../../modeling';
import { projectorDimensions } from './dimensions';

export class Light extends CompoundModel3D {
  constructor(translation: Partial<Vector3DObject> = {}) {
    const {
      lightBaseDiameter,
      lightMidDiameter,
      lightLightDiameter,
      lightTopDiameter,
      lightBaseHeight,
      lightLightBottomHeight,
      lightLightTopHeight,
      lightTopHeight,
    } = projectorDimensions;

    super(
      new Union({
        models: [
          new Cylinder({
            origin: 'bottom',
            diameter: lightBaseDiameter,
            height: lightBaseHeight,
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightMidDiameter,
            height: lightLightBottomHeight - lightBaseHeight,
            translation: { z: lightBaseHeight },
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightLightDiameter,
            height: lightLightTopHeight - lightLightBottomHeight,
            translation: { z: lightLightBottomHeight },
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightMidDiameter,
            height: (lightTopHeight - lightLightTopHeight) / 2,
            translation: { z: lightLightTopHeight },
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightTopDiameter,
            height: (lightTopHeight - lightLightTopHeight) / 2,
            translation: { z: lightLightTopHeight + ((lightTopHeight - lightLightTopHeight) / 2) },
          }),
        ],
        translation,
      }),
    );
  }
}
