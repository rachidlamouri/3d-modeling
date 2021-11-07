import {
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  Rotation,
  Subtraction,
  Translation,
  Tube,
} from '../../modeling';
import { projectorDimensions } from './dimensions';

export class Shade extends CompoundModel3D {
  constructor(translation: Translation = new Translation({})) {
    const {
      shadeInnerDiameter,
      shadeOuterDiameter,
      shadeHeight,
      shadeOutletDiameter,
      shadeOutletLengthY,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new Tube({
            origin: 'bottom',
            outerDiameter: shadeOuterDiameter,
            innerDiameter: shadeInnerDiameter,
            height: shadeHeight,
          }),
          new Cylinder({
            origin: 'center',
            diameter: shadeOutletDiameter,
            height: shadeOutletLengthY,
            transforms: [
              new Rotation({ x: -90 }, 'self'),
              new Translation({
                y: shadeOutletLengthY / 2,
                z: shadeHeight / 2,
              }),
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

export class ShadeSliceTest extends CompoundModel3D {
  constructor() {
    const {
      shadeOuterDiameter,
      shadeOuterRadius,
      shadeHeight,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new Shade(),
          new RectangularPrism({
            origin: ['center', 'back', 'bottom'],
            lengthX: shadeOuterDiameter,
            lengthY: shadeOuterRadius,
            lengthZ: shadeHeight,
          }),
          new RectangularPrism({
            origin: ['left', 'front', 'bottom'],
            lengthX: shadeOuterRadius,
            lengthY: shadeOuterRadius,
            lengthZ: shadeHeight,
          }),
        ],
      }),
    );
  }
}
