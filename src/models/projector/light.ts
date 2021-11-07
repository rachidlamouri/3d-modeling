import {
  CompoundModel3D,
  Union,
  Cylinder,
  Translation,
} from '../../modeling';
import { projectorDimensions } from './dimensions';

export class Light extends CompoundModel3D {
  constructor(translation: Translation = new Translation({})) {
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
            transforms: [
              new Translation({ z: lightBaseHeight }),
            ],
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightLightDiameter,
            height: lightLightTopHeight - lightLightBottomHeight,
            transforms: [
              new Translation({ z: lightLightBottomHeight }),
            ],
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightMidDiameter,
            height: (lightTopHeight - lightLightTopHeight) / 2,
            transforms: [
              new Translation({ z: lightLightTopHeight }),
            ],
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightTopDiameter,
            height: (lightTopHeight - lightLightTopHeight) / 2,
            transforms: [
              new Translation({ z: lightLightTopHeight + ((lightTopHeight - lightLightTopHeight) / 2) }),
            ],
          }),
        ],
        transforms: [
          translation,
        ],
      }),
    );
  }
}
