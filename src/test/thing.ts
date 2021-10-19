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
  'thingHeight',
  'shadeInnerRadius',
  'shadeInnerDiameter',
  'shadeOuterRadius',
  'shadeOuterDiameter',
  'shadeThickness',
  'shadeHeight',
  'shadeOutletDiameter',
  'shadeOutletLengthY',
  'reelAllowance',
  'reelInnerRadius',
  'reelInnerDiameter',
  'reelThickness',
  'reelOuterRadius',
  'reelOuterDiameter',
  'reelHeight',
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

const parseInputDimensions = buildParseInputDimensions<typeof dimensionNames>(
  dimensionNames,
  {
    thingHeight: 'wingChannelDiameter + 2',
    shadeInnerDiameter: '76',
    shadeInnerRadius: 'shadeInnerDiameter / 2',
    shadeThickness: '2',
    shadeOuterRadius: 'shadeInnerRadius + 2',
    shadeOuterDiameter: '2 * shadeOuterRadius',
    shadeHeight: 'thingHeight',
    shadeOutletDiameter: 'frameDiameter + 2', // widening to permit more light
    shadeOutletLengthY: '2 * shadeThickness', // doubling to force a hole
    reelAllowance: '.1',
    reelInnerRadius: 'shadeOuterRadius + reelAllowance',
    reelInnerDiameter: '2 * reelInnerRadius',
    reelThickness: '6',
    reelOuterRadius: 'reelInnerRadius + reelThickness',
    reelOuterDiameter: '2 * reelOuterRadius',
    reelHeight: 'thingHeight',
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
);

class Shade extends CompoundModel3D {
  constructor(thingParams: Dimensions<typeof dimensionNames>) {
    const {
      shadeInnerRadius,
      shadeInnerDiameter,
      shadeThickness,
      shadeOuterDiameter,
      shadeHeight,
      shadeOutletDiameter,
      shadeOutletLengthY,
    } = thingParams;

    super(
      new Subtraction({
        minuend: new Cylinder({
          origin: 'bottom',
          diameter: shadeOuterDiameter,
          height: shadeHeight,
        }),
        subtrahends: [
          new Cylinder({
            origin: 'bottom',
            diameter: shadeInnerDiameter,
            height: shadeHeight,
          }),
          new Cylinder({
            origin: 'center',
            diameter: shadeOutletDiameter,
            height: shadeOutletLengthY,
            translation: {
              y: shadeInnerRadius + shadeThickness / 2,
              z: shadeHeight / 2,
            },
            rotations: [
              [{ x: 90 }, 'self'],
            ],
          }),
        ],
      }),
    );
  }
}

type FrameParams = {
  originAngleZ: number;
  thingParams: Dimensions<typeof dimensionNames>;
};

class Frame extends CompoundModel3D {
  constructor({ originAngleZ, thingParams }: FrameParams) {
    const {
      frameDiameter,
      frameLengthZ,
      reelOuterRadius,
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
          y: reelOuterRadius - reelThickness / 2,
          z: reelHeight / 2,
        },
        rotations: [
          [{ z: originAngleZ }, 'origin'],
        ],
      }),
    );
  }
}

class Reel extends CompoundModel3D {
  constructor(thingParams: Dimensions<typeof dimensionNames>) {
    const {
      reelOuterDiameter,
      reelHeight,
      reelInnerDiameter,
      frameCount,
      firstFrameAngle,
      frameAngleZ,
    } = thingParams;

    super(
      new Subtraction({
        minuend: new Cylinder({
          origin: 'bottom',
          diameter: reelOuterDiameter,
          height: reelHeight,
        }),
        subtrahends: [
          new Cylinder({
            origin: 'bottom',
            diameter: reelInnerDiameter,
            height: reelHeight,
          }),
          ..._.range(frameCount).map((index) => (
            new Frame({
              originAngleZ: firstFrameAngle + index * frameAngleZ,
              thingParams,
            })
          )),
        ],
      }),
    );
  }
}

export class Thing extends CompoundModel3D {
  constructor(inputParams: InputDimensions<typeof dimensionNames>) {
    const params = parseInputDimensions(inputParams);

    super(
      new Union({
        models: [
          new Shade(params),
          new Reel(params),
        ],
      }),
    );
  }
}
