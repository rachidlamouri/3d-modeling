import {
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  Subtraction,
  Tube,
  Union,
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
                origin: 'bottom',
                outerDiameter: trackBaseOuterDiameter,
                innerDiameter: trackBaseInnerDiameter,
                height: trackBaseHeight,
              }),
              new Tube({
                origin: 'bottom',
                outerDiameter: trackLipOuterDiameter,
                innerDiameter: trackLipInnerDiameter,
                height: trackLipHeight,
                translation: { z: trackBaseHeight },
              }),
              new Subtraction({
                models: [
                  new Cylinder({
                    origin: 'center',
                    radius: trackNubRadius,
                    height: trackNubLength,
                    rotations: [
                      [{ x: 90 }, 'self'],
                    ],
                  }),
                  new RectangularPrism({
                    origin: ['center', 'center', 'top'],
                    lengthX: trackNubDiameter,
                    lengthY: trackNubLength,
                    lengthZ: trackNubRadius,
                  }),
                ],
                translation: {
                  y: -(trackNubLength / 2) + trackLipInnerRadius,
                  z: trackBaseHeight,
                },
              }),
            ],
          }),
          new Subtraction({
            models: [
              new Tube({
                origin: 'bottom',
                outerRadius: trackBaseSupportHoleOuterRadius,
                wallThickness: trackBaseSupportHoleThickness,
                height: trackBaseHeight,
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
