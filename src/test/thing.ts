import _ from 'lodash';
import { buildParseInputDimensions, Dimensions, InputDimensions } from '../dimensionParser';
import {
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  Subtraction,
  Union,
} from '../modeling';

const dimensionNames = [
  'reelThickness',
  'reelRadius',
  'reelDiameter',
  'reelHeight',
  'reelHoleDiameter',
  'reelHoleRadius',
  'frameCount',
  'frameAllowance',
  'frameRadius',
  'frameDiameter',
  'frameLengthZ',
  'firstFrameAngle',
  'lastFrameAngle',
  'frameAngleZ',
  'frameSlotLengthX',
  'frameSlotLengthY',
  'frameSlotLengthZ',
  'wingLengthX',
  'wingLengthY',
  'wingLengthZ',
  'wingAllowance',
  'wingChannelRadius',
  'wingChannelDiameter',
  'wingChannelLengthY',
  'wingDeflectionAngle',
  'wingCatchLengthX',
  'wingCatchLengthY',
  'wingCatchLengthZ',
] as const;

type FrameParams = {
  originAngleZ: number;
  thingParams: Dimensions<typeof dimensionNames>;
};

class Frame extends CompoundModel3D {
  constructor({ originAngleZ, thingParams }: FrameParams) {
    const {
      frameDiameter,
      frameLengthZ,
      reelRadius,
      reelThickness,
      reelHeight,
      frameSlotLengthX,
      frameSlotLengthY,
      frameSlotLengthZ,
      wingDeflectionAngle,
      wingChannelDiameter,
      wingChannelLengthY,
      wingCatchLengthX,
      wingCatchLengthY,
      wingCatchLengthZ,
    } = thingParams;

    super(
      new Union({
        models: [
          new Cylinder({
            origin: 'center',
            diameter: frameDiameter,
            lengthZ: frameLengthZ,
            rotations: [
              [{ x: 90 }, 'self'],
            ],
          }),
          new Union({
            models: [
              new RectangularPrism({
                origin: ['center', 'front', 'bottom'],
                lengthX: frameSlotLengthX,
                lengthY: frameSlotLengthY,
                lengthZ: frameSlotLengthZ,
              }),
              new Cylinder({
                origin: 'center',
                diameter: wingChannelDiameter,
                height: wingChannelLengthY,
                translation: { y: -wingChannelLengthY / 2 - frameSlotLengthY / 2 },
                rotations: [
                  [{ x: 90 }, 'self'],
                  [{ z: wingDeflectionAngle }, 'self'],
                ],
              }),
              new RectangularPrism({
                origin: ['center', 'front', 'center'],
                lengthX: wingCatchLengthX,
                lengthY: wingCatchLengthY,
                lengthZ: wingCatchLengthZ,
                translation: { y: -(frameSlotLengthY / 2) },
              }),
            ],
            translation: { y: 1 },
          }),
        ],
        translation: {
          y: reelRadius - reelThickness / 2,
          z: reelHeight / 2,
        },
        rotations: [
          [{ z: originAngleZ }, 'origin'],
        ],
      }),
    );
  }
}

export class Thing extends CompoundModel3D {
  static parseInputDimensions = buildParseInputDimensions<typeof dimensionNames>(
    dimensionNames,
    {
      reelRadius: '40',
      reelDiameter: '2 * reelRadius',
      reelHeight: 'wingChannelDiameter + 2',
      reelThickness: '6',
      reelHoleDiameter: '2 * reelHoleRadius',
      reelHoleRadius: 'reelRadius - reelThickness',
      frameCount: '4',
      frameAllowance: '.1',
      frameDiameter: '16 + frameAllowance',
      frameRadius: 'frameDiameter / 2',
      frameLengthZ: '2 * reelThickness', // doubling to force a hole
      firstFrameAngle: '90',
      lastFrameAngle: '-90',
      frameAngleZ: '(lastFrameAngle - firstFrameAngle) / (frameCount - 1)',
      frameSlotLengthX: 'frameDiameter',
      frameSlotLengthY: '2',
      frameSlotLengthZ: 'reelHeight / 2',
      wingLengthX: '4',
      wingLengthY: '6',
      wingLengthZ: '1',
      wingAllowance: '.2',
      wingDeflectionAngle: '3',
      wingChannelRadius: 'frameRadius + wingLengthX + wingAllowance',
      wingChannelDiameter: '2 * wingChannelRadius',
      wingChannelLengthY: 'wingLengthZ + wingAllowance',
      wingCatchLengthX: 'wingChannelDiameter',
      wingCatchLengthY: 'wingChannelLengthY',
      wingCatchLengthZ: 'wingLengthY + wingAllowance',
    },
  )

  constructor(inputParams: InputDimensions<typeof dimensionNames>) {
    const params = Thing.parseInputDimensions(inputParams);
    const {
      reelDiameter,
      reelHeight,
      reelHoleDiameter,
      frameCount,
      firstFrameAngle,
      frameAngleZ,
    } = params;

    super(
      new Subtraction({
        minuend: new Cylinder({
          origin: 'bottom',
          diameter: reelDiameter,
          height: reelHeight,
        }),
        subtrahends: [
          new Cylinder({
            origin: 'bottom',
            diameter: reelHoleDiameter,
            height: reelHeight,
          }),
          ..._.range(frameCount).map((index) => (
            new Frame({
              originAngleZ: firstFrameAngle + index * frameAngleZ,
              thingParams: params,
            })
          )),
        ],
      }),
    );
  }
}
