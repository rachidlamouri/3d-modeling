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
  'firstFrameAngle',
  'lastFrameAngle',
  'frameAngleZ',
  'frameDiameter',
  'frameRadius',
  'frameLengthY',
  'frameAllowance',
  'frameHoleRadius',
  'frameHoleDiameter',
  'frameHoleLengthY',
  'frameSlotLengthX',
  'frameSlotLengthY',
  'frameSlotLengthZ',
  'wingLengthX',
  'wingLengthY',
  'wingLengthZ',
  'frameWingspan',
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
    shadeOutletDiameter: 'frameHoleDiameter + 2', // widening to permit more light
    shadeOutletLengthY: '2 * shadeThickness', // doubling to force a hole
    reelAllowance: '.1',
    reelInnerRadius: 'shadeOuterRadius + reelAllowance',
    reelInnerDiameter: '2 * reelInnerRadius',
    reelThickness: '6',
    reelOuterRadius: 'reelInnerRadius + reelThickness',
    reelOuterDiameter: '2 * reelOuterRadius',
    reelHeight: 'thingHeight',
    frameCount: '4',
    firstFrameAngle: '90',
    lastFrameAngle: '-90',
    frameAngleZ: '(lastFrameAngle - firstFrameAngle) / (frameCount - 1)',
    frameDiameter: '16',
    frameRadius: 'frameDiameter / 2',
    frameLengthY: '2',
    frameAllowance: '.1',
    frameHoleDiameter: 'frameDiameter + frameAllowance',
    frameHoleRadius: 'frameHoleDiameter / 2',
    frameHoleLengthY: '2 * reelThickness', // doubling to force a hole
    frameSlotLengthX: 'frameHoleDiameter',
    frameSlotLengthY: 'frameLengthY + frameAllowance',
    frameSlotLengthZ: 'reelHeight / 2',
    wingLengthX: '4',
    wingLengthY: '6',
    wingLengthZ: '1',
    frameWingspan: 'frameDiameter + 2 * wingLengthX',
    wingAllowance: '.2',
    wingDeflectionAngle: '3',
    wingChannelRadius: 'frameHoleRadius + wingLengthX + wingAllowance',
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

type FrameHoleAssemblyParams = {
  originAngleZ: number;
  thingParams: Dimensions<typeof dimensionNames>;
};

class FrameHoleAssembly extends CompoundModel3D {
  constructor({ originAngleZ, thingParams }: FrameHoleAssemblyParams) {
    const {
      frameHoleDiameter,
      frameHoleLengthY,
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
            diameter: frameHoleDiameter,
            lengthZ: frameHoleLengthY,
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
            new FrameHoleAssembly({
              originAngleZ: firstFrameAngle + index * frameAngleZ,
              thingParams,
            })
          )),
        ],
      }),
    );
  }
}

class Frame extends CompoundModel3D {
  constructor(params: Dimensions<typeof dimensionNames>) {
    const {
      frameDiameter,
      frameLengthY,
      wingLengthY,
      wingLengthZ,
      frameWingspan,
    } = params;

    super(
      new Union({
        models: [
          new Cylinder({
            origin: 'bottom',
            diameter: frameDiameter,
            lengthZ: frameLengthY,
          }),
          new Subtraction({
            minuend: new Cylinder({
              origin: 'bottom',
              diameter: frameWingspan,
              lengthZ: wingLengthZ,
            }),
            subtrahends: _.range(2).map((index) => (
              new RectangularPrism({
                origin: ['center', (index === 0 ? 'front' : 'back'), 'bottom'],
                lengthX: frameWingspan,
                lengthY: (frameWingspan - wingLengthY) / 2,
                lengthZ: wingLengthZ,
                translation: {
                  y: (index === 0 ? -1 : 1) * (wingLengthY / 2),
                },
              })
            )),
          }),
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
          new Frame(params),
        ],
      }),
    );
  }
}
