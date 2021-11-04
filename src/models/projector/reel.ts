import _ from 'lodash';
import { CompoundModel3D, Cylinder, RectangularPrism, Subtraction, Tube, Vector3DObject } from '../../modeling';
import { projectorDimensions } from './dimensions';
import { FrameHoleAssembly } from './frameHoleAssembly';

export class Reel extends CompoundModel3D {
  constructor(translation: Partial<Vector3DObject> = {}) {
    const {
      reelInnerRadius,
      reelInnerDiameter,
      reelOuterRadius,
      reelOuterDiameter,
      reelHeight,
      reelThicknessBuffer,
      frameCount,
      firstFrameAngle,
      frameAngleZ,
      frameImageHoleDiameter,
      frameImageHoleLengthY,
      reelNotchRadius,
      reelNotchLength,
    } = projectorDimensions;

    const getOriginAngle = (index: number) => firstFrameAngle + index * frameAngleZ;

    super(
      new Subtraction({
        models: [
          new Tube({
            origin: 'bottom',
            outerDiameter: reelOuterDiameter,
            innerDiameter: reelInnerDiameter,
            height: reelHeight,
          }),
          ..._.range(frameCount).map((index) => (
            new Cylinder({
              origin: 'center',
              diameter: frameImageHoleDiameter,
              height: frameImageHoleLengthY,
              translation: {
                y: frameImageHoleLengthY / 2,
                z: reelHeight / 2,
              },
              rotations: [
                [{ x: 90 }, 'self'],
                [{ z: getOriginAngle(index) }, 'origin'],
              ],
            })
          )),
          ..._.range(frameCount).map((index) => (
            new FrameHoleAssembly({
              originAngleZ: getOriginAngle(index),
              translation: {
                y: reelInnerRadius + reelThicknessBuffer,
                z: reelHeight / 2,
              },
              rotations: [
                [{ z: getOriginAngle(index) }, 'origin'],
              ],
            })
          )),
          ..._.range(frameCount + 1).map((index) => (
            new Cylinder({
              origin: 'center',
              radius: reelNotchRadius,
              height: reelNotchLength,
              translation: {
                y: -reelNotchLength / 2 + reelOuterRadius,
              },
              rotations: [
                [{ x: 90 }, 'self'],
                [{ z: index === 4 ? 180 : getOriginAngle(index) }, 'origin'],
              ],
            })
          )),
        ],
        translation,
      }),
    );
  }
}

export class ReelLowerSliceTest extends CompoundModel3D {
  constructor() {
    const {
      reelOuterDiameter,
      reelHeight,
      trackBaseHeight,
      trackLipHeight,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new Reel(),
          new Cylinder({
            origin: 'bottom',
            diameter: reelOuterDiameter,
            height: reelHeight,
            translation: {
              z: trackBaseHeight + trackLipHeight + 2,
            },
          }),
        ],
      }),
    );
  }
}

export class ReelFrameHoleSliceTest extends CompoundModel3D {
  constructor() {
    const {
      reelOuterRadius,
      reelOuterDiameter,
      reelHeight,
      frameWingChannelDiameter,
      frameWingChannelBuffer,
      firstFrameAngle,
      frameAngleZ,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new Reel(),
          new Subtraction({
            models: [
              new Cylinder({
                origin: 'bottom',
                diameter: reelOuterDiameter,
                lengthZ: reelHeight,
              }),
              new RectangularPrism({
                origin: ['center', 'back', 'bottom'],
                lengthX: frameWingChannelDiameter + (2 * frameWingChannelBuffer),
                lengthY: reelOuterRadius,
                lengthZ: reelHeight,
                rotations: [
                  [{ z: firstFrameAngle + frameAngleZ }, 'origin'],
                ],
              }),
            ],
          }),
        ],
      }),
    );
  }
}

export class ReelFrameChannelSliceTest extends CompoundModel3D {
  constructor() {
    const {
      frameWallChannelDiameter,
      reelInnerDiameter,
      reelThickness,
      firstFrameAngle,
      frameAngleZ,
      frameWingDeflectionAngle,
    } = projectorDimensions;

    super(
      new Subtraction({
        models: [
          new ReelFrameHoleSliceTest(),
          new RectangularPrism({
            origin: ['center', 'front', 'bottom'],
            lengthX: frameWallChannelDiameter,
            lengthY: reelThickness,
            lengthZ: reelInnerDiameter,
            translation: {
              y: 54.9,
            },
            rotations: [
              [{ z: firstFrameAngle + frameAngleZ }, 'origin'],
              [{ z: frameWingDeflectionAngle }, 'self'],
            ],
          }),
        ],
        rotations: [
          [{ z: -(firstFrameAngle + frameAngleZ) }, 'origin'],
        ],
      }),
    );
  }
}
