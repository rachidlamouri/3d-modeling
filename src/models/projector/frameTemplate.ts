import _ from 'lodash';
import {
  CompoundModel3D,
  Union,
  Cylinder,
  Tube,
  Subtraction,
  RectangularPrism,
  Translation,
  Rotation,
} from '../../modeling';
import { projectorDimensions } from './dimensions';

export class FrameTemplate extends CompoundModel3D {
  constructor() {
    const {
      frameImageDiameter,
      frameWallInnerDiameter,
      frameWallOuterDiameter,
      frameWallLengthY,
      frameWingLengthY,
      frameWingLengthZ,
      frameWingspan,
    } = projectorDimensions;

    super(
      new Union({
        models: [
          new Cylinder({
            origin: 'bottom',
            diameter: frameImageDiameter,
            lengthZ: 1, // sample image height
          }),
          new Tube({
            origin: 'bottom',
            outerDiameter: frameWallOuterDiameter,
            innerDiameter: frameWallInnerDiameter,
            lengthZ: frameWallLengthY,
          }),
          new Subtraction({
            models: [
              new Cylinder({
                origin: 'bottom',
                diameter: frameWingspan,
                lengthZ: frameWingLengthY,
              }),
              new Cylinder({
                origin: 'bottom',
                diameter: frameWallOuterDiameter,
                lengthZ: frameWingLengthY,
              }),
              ..._.range(2).map((index) => new RectangularPrism({
                origin: ['center', (index === 0 ? 'front' : 'back'), 'bottom'],
                lengthX: frameWingspan,
                lengthY: frameWingspan,
                lengthZ: frameWingLengthY,
                transforms: [
                  new Translation({ y: (index === 0 ? -1 : 1) * (frameWingLengthZ / 2) }),
                ],
              })),
            ],
          }),
        ],
        transforms: [
          new Rotation({ x: 90 }, 'self'),
          new Translation({ z: frameWallOuterDiameter / 2 }),
        ],
      }),
    );
  }
}
