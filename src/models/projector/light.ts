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
            axis: 'z',
            origin: 'bottom',
            diameter: lightBaseDiameter,
            axialLength: lightBaseHeight,
          }),
          new Cylinder({
            axis: 'z',
            origin: 'bottom',
            diameter: lightMidDiameter,
            axialLength: lightLightBottomHeight - lightBaseHeight,
            transforms: [
              new Translation({ z: lightBaseHeight }),
            ],
          }),
          new Cylinder({
            axis: 'z',
            origin: 'bottom',
            diameter: lightLightDiameter,
            axialLength: lightLightTopHeight - lightLightBottomHeight,
            transforms: [
              new Translation({ z: lightLightBottomHeight }),
            ],
          }),
          new Cylinder({
            axis: 'z',
            origin: 'bottom',
            diameter: lightMidDiameter,
            axialLength: (lightTopHeight - lightLightTopHeight) / 2,
            transforms: [
              new Translation({ z: lightLightTopHeight }),
            ],
          }),
          new Cylinder({
            axis: 'z',
            origin: 'bottom',
            diameter: lightTopDiameter,
            axialLength: (lightTopHeight - lightLightTopHeight) / 2,
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
