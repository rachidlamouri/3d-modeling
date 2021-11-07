import {
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  Subtraction,
  Translation,
  Tube,
  Union,
  Rotation,
} from '../../modeling';
import { projectorDimensions } from './dimensions';

export class Track extends CompoundModel3D {
  constructor() {
    const {
      trackBaseInnerDiameter,
      trackBaseOuterDiameter,
      trackBaseHeight,
      trackLipInnerRadius,
      trackLipInnerDiameter,
      trackLipOuterDiameter,
      trackLipHeight,
      trackNubLength,
      trackNubRadius,
      trackNubDiameter,
      trackBaseSupportHoleOuterRadius,
      trackBaseSupportHoleThickness,
      supportMainGapLength,
      supportMainDiameterAllowance,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new Union({
            models: [
              new Tube({
                axis: 'z',
                origin: 'bottom',
                outerDiameter: trackBaseOuterDiameter,
                innerDiameter: trackBaseInnerDiameter,
                axialLength: trackBaseHeight,
              }),
              new Tube({
                axis: 'z',
                origin: 'bottom',
                outerDiameter: trackLipOuterDiameter,
                innerDiameter: trackLipInnerDiameter,
                axialLength: trackLipHeight,
                transforms: [
                  new Translation({ z: trackBaseHeight }),
                ],
              }),
              new Subtraction({
                models: [
                  new Cylinder({
                    axis: 'z',
                    origin: 'center',
                    radius: trackNubRadius,
                    axialLength: trackNubLength,
                    transforms: [
                      new Rotation({ x: 90 }, 'self'),
                    ],
                  }),
                  new RectangularPrism({
                    origin: ['center', 'center', 'top'],
                    lengthX: trackNubDiameter,
                    lengthY: trackNubLength,
                    lengthZ: trackNubRadius,
                  }),
                ],
                transforms: [
                  new Translation({
                    y: -(trackNubLength / 2) + trackLipInnerRadius,
                    z: trackBaseHeight,
                  }),
                ],
              }),
            ],
          }),
          new Subtraction({
            models: [
              new Tube({
                axis: 'z',
                origin: 'bottom',
                outerRadius: trackBaseSupportHoleOuterRadius,
                wallThickness: trackBaseSupportHoleThickness,
                axialLength: trackBaseHeight,
              }),
              new Union({
                models: [
                  new RectangularPrism({
                    origin: ['center', 'center', 'bottom'],
                    lengthX: supportMainGapLength - supportMainDiameterAllowance,
                    lengthY: trackBaseOuterDiameter,
                    lengthZ: trackBaseHeight,
                  }),
                  new RectangularPrism({
                    origin: ['center', 'center', 'bottom'],
                    lengthX: trackBaseOuterDiameter,
                    lengthY: supportMainGapLength - supportMainDiameterAllowance,
                    lengthZ: trackBaseHeight,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  }
}
