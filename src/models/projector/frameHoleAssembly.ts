import { CompoundModel3D, Cylinder, RectangularPrism, RotationInput, Union, Vector3DObject } from '../../modeling';
import { projectorDimensions } from './dimensions';

type FrameHoleAssemblyParams = {
  originAngleZ: number;
  translation?: Partial<Vector3DObject>,
  rotations?: RotationInput[],
};

export class FrameHoleAssembly extends CompoundModel3D {
  constructor({
    translation = {},
    rotations = [],
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
            rotations: [
              [{ x: -90 }, 'origin'],
            ],
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: frameWingChannelDiameter,
            lengthZ: frameWingChannelLengthY,
            rotations: [
              [{ x: -90 }, 'origin'],
              [{ z: frameWingDeflectionAngle }, 'self'],
            ],
          }),
          new RectangularPrism({
            origin: ['center', 'back', 'center'],
            lengthX: frameWingCatchLengthX + frameWallChannelDiameter + frameWingCatchLengthX,
            lengthY: frameWingCatchLengthY,
            lengthZ: frameWingCatchLengthZ,
          }),
        ],
        translation,
        rotations,
      }),
    );
  }
}
