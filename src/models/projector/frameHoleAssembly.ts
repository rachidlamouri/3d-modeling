import {
  CommonModel3DParams,
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  Rotation,
  Union,
} from '../../modeling';
import { projectorDimensions } from './dimensions';

type FrameHoleAssemblyParams =
  CommonModel3DParams
  & {
    originAngleZ: number;
  };

export class FrameHoleAssembly extends CompoundModel3D {
  constructor({
    transforms,
  }: FrameHoleAssemblyParams) {
    const {
      frameSlotLengthX,
      frameSlotLengthY,
      frameSlotLengthZ,
      frameWallChannelDiameter,
      frameWallChannelLengthY,
      frameWingChannelDiameter,
      frameWingChannelLengthY,
      frameWingDeflectionAngle,
      frameWingCatchLengthX,
      frameWingCatchLengthY,
      frameWingCatchLengthZ,
    } = projectorDimensions;

    super(
      new Union({
        models: [
          new RectangularPrism({
            origin: ['center', 'back', 'bottom'],
            lengthX: frameSlotLengthX,
            lengthY: frameSlotLengthY,
            lengthZ: frameSlotLengthZ,
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: frameWallChannelDiameter,
            lengthZ: frameWallChannelLengthY,
            transforms: [
              new Rotation({ x: -90 }, 'origin'),
            ],
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: frameWingChannelDiameter,
            lengthZ: frameWingChannelLengthY,
            transforms: [
              new Rotation({ x: -90 }, 'origin'),
              new Rotation({ z: frameWingDeflectionAngle }, 'self'),
            ],
          }),
          new RectangularPrism({
            origin: ['center', 'back', 'center'],
            lengthX: frameWingCatchLengthX + frameWallChannelDiameter + frameWingCatchLengthX,
            lengthY: frameWingCatchLengthY,
            lengthZ: frameWingCatchLengthZ,
          }),
        ],
        transforms,
      }),
    );
  }
}
