import _ from 'lodash';
import { buildParseInputDimensions, Dimensions, InputDimensions } from '../dimensionParser';
import {
  Collection3D,
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  Subtraction,
  Union,
} from '../modeling';
import { Vector3DObject } from '../modeling/vector';
import { Image, ImageParams } from './image';

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
  'trackBaseRadius',
  'trackBaseDiameter',
  'trackBaseHeight',
  'trackLipThickness',
  'trackLipHeight',
  'trackNubRadius',
  'trackNubDiameter',
  'trackNubAllowance',
  'trackNubLength',
  'reelNotchRadius',
  'reelNotchLength',
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
  'frameWallThickness',
  'frameWallInnerRadius',
  'frameWallInnerDiameter',
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
  'wingAllowanceX',
  'wingAllowanceY',
  'wingAllowanceZ',
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
    shadeThickness: 'frameDiameter / 8',
    shadeOuterRadius: 'shadeInnerRadius + shadeThickness',
    shadeOuterDiameter: '2 * shadeOuterRadius',
    shadeHeight: 'thingHeight + reelAllowance',
    shadeOutletDiameter: 'frameHoleDiameter + 2', // widening to permit more light
    shadeOutletLengthY: '3 * shadeThickness', // tripling to force a hole
    trackBaseRadius: 'shadeOuterRadius + 2 * reelAllowance + reelThickness + trackLipThickness',
    trackBaseDiameter: '2 * trackBaseRadius',
    trackBaseHeight: '2',
    trackLipThickness: '.8',
    trackLipHeight: '(reelHeight - frameHoleDiameter) / 3',
    trackNubRadius: '.4 * trackLipHeight',
    trackNubDiameter: '2 * trackNubRadius',
    trackNubAllowance: '.2',
    trackNubLength: 'trackBaseRadius - shadeOuterRadius',
    reelNotchRadius: 'trackNubRadius + trackNubAllowance',
    reelNotchLength: 'reelThickness',
    reelAllowance: '.2',
    reelInnerRadius: 'shadeOuterRadius + reelAllowance',
    reelInnerDiameter: '2 * reelInnerRadius',
    reelThickness: '(3 / 8) * frameDiameter',
    reelOuterRadius: 'reelInnerRadius + reelThickness',
    reelOuterDiameter: '2 * reelOuterRadius',
    reelHeight: 'thingHeight',
    frameCount: '4',
    firstFrameAngle: '90',
    lastFrameAngle: '-90',
    frameAngleZ: '(lastFrameAngle - firstFrameAngle) / (frameCount - 1)',
    frameDiameter: '40',
    frameRadius: 'frameDiameter / 2',
    frameWallThickness: '.8',
    frameWallInnerRadius: 'frameRadius - frameWallThickness',
    frameWallInnerDiameter: '2 * frameWallInnerRadius',
    frameLengthY: '2',
    frameAllowance: '.2',
    frameHoleDiameter: 'frameDiameter + frameAllowance',
    frameHoleRadius: 'frameHoleDiameter / 2',
    frameHoleLengthY: '3 * reelThickness', // tripling to force a hole
    frameSlotLengthX: 'frameHoleDiameter',
    frameSlotLengthY: 'frameLengthY + frameAllowance',
    frameSlotLengthZ: 'reelHeight / 2',
    wingLengthX: '4',
    wingLengthY: '6',
    wingLengthZ: '1',
    frameWingspan: 'frameDiameter + 2 * wingLengthX',
    wingAllowanceX: '.2',
    wingAllowanceY: '.3',
    wingAllowanceZ: '.2',
    wingDeflectionAngle: '3',
    wingChannelRadius: 'frameHoleRadius + wingLengthX + wingAllowanceX',
    wingChannelDiameter: '2 * wingChannelRadius',
    wingChannelLengthY: 'wingLengthZ + wingAllowanceZ',
    wingCatchLengthX: 'wingChannelDiameter',
    wingCatchLengthY: 'wingChannelLengthY',
    wingCatchLengthZ: 'wingLengthY + wingAllowanceY',
  },
);

type ThingDimensions = Dimensions<typeof dimensionNames>;

class Shade extends CompoundModel3D {
  constructor(thingParams: ThingDimensions, translation?: Partial<Vector3DObject>) {
    const {
      shadeOuterRadius,
      shadeInnerDiameter,
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
              y: -shadeOutletLengthY / 2 + shadeOuterRadius,
              z: shadeHeight / 2,
            },
            rotations: [
              [{ x: 90 }, 'self'],
            ],
          }),
        ],
        translation,
      }),
    );
  }
}

class Track extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    const {
      trackBaseRadius,
      trackBaseDiameter,
      trackBaseHeight,
      trackLipHeight,
      trackLipThickness,
      shadeInnerDiameter,
      trackNubLength,
      trackNubRadius,
      trackNubDiameter,
    } = params;

    super(
      new Union({
        models: [
          new Subtraction({
            minuend: new Cylinder({
              origin: 'bottom',
              diameter: trackBaseDiameter,
              height: trackBaseHeight,
            }),
            subtrahends: [
              new Cylinder({
                origin: 'bottom',
                diameter: shadeInnerDiameter,
                height: trackBaseDiameter,
              }),
            ],
          }),
          new Subtraction({
            minuend: new Cylinder({
              origin: 'bottom',
              diameter: trackBaseDiameter,
              height: trackLipHeight,
            }),
            subtrahends: [
              new Cylinder({
                origin: 'bottom',
                radius: trackBaseRadius - trackLipThickness,
                height: trackLipHeight,
              }),
            ],
            translation: { z: trackBaseHeight },
          }),
          new Subtraction({
            minuend: new Cylinder({
              origin: 'center',
              radius: trackNubRadius,
              height: trackNubLength,
              rotations: [
                [{ x: 90 }, 'self'],
              ],
            }),
            subtrahends: [
              new RectangularPrism({
                origin: ['center', 'center', 'top'],
                lengthX: trackNubDiameter,
                lengthY: trackNubLength,
                lengthZ: trackNubRadius,
              }),
            ],
            translation: {
              y: -(trackNubLength / 2) + trackBaseRadius - trackLipThickness,
              z: trackBaseHeight,
            },
          }),
        ],
      }),
    );
  }
}

class ShadeAndTrack extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    super(
      new Union({
        models: [
          new Shade(params, { z: params.trackBaseHeight }),
          new Track(params),
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

class ReelNotch extends Cylinder {
  constructor({ originAngleZ, thingParams }: FrameHoleAssemblyParams) {
    const {
      reelNotchRadius,
      reelNotchLength,
      reelInnerRadius,
    } = thingParams;

    super({
      origin: 'center',
      radius: reelNotchRadius,
      lengthZ: reelNotchLength,
      translation: {
        y: (reelNotchLength / 2) + reelInnerRadius,
      },
      rotations: [
        [{ x: 90 }, 'self'],
        [{ z: originAngleZ }, 'origin'],
      ],
    });
  }
}

class Reel extends CompoundModel3D {
  constructor(thingParams: Dimensions<typeof dimensionNames>, translation: Partial<Vector3DObject>) {
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
          ..._.range(frameCount).flatMap((index) => {
            const originAngleZ = firstFrameAngle + index * frameAngleZ;

            return [
              new FrameHoleAssembly({
                originAngleZ,
                thingParams,
              }),
              new ReelNotch({
                originAngleZ,
                thingParams,
              }),
            ];
          }),
        ],
        translation,
      }),
    );
  }
}

class FrameTemplate extends CompoundModel3D {
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

export class Frame extends Collection3D {
  constructor(params: Omit<ImageParams, 'lengthX' | 'lengthY'>) {
    const {
      frameDiameter,
      frameLengthY,
      frameWallInnerDiameter,
      frameWingspan,
      wingLengthY,
      wingLengthZ,
    } = parseInputDimensions({});

    const models = new Image({
      ...params,
      lengthX: frameDiameter,
      lengthY: frameDiameter,
    })
      .models.map((imageSlice) => (
        new Union({
          models: [
            new Subtraction({
              minuend: imageSlice,
              subtrahends: [
                new Subtraction({
                  minuend: new RectangularPrism({
                    origin: ['center', 'center', 'bottom'],
                    lengthX: frameDiameter,
                    lengthY: frameDiameter,
                    lengthZ: params.maxLengthZ,
                  }),
                  subtrahends: [
                    new Cylinder({
                      origin: 'bottom',
                      diameter: frameWallInnerDiameter,
                      lengthZ: params.maxLengthZ,
                    }),
                  ],
                }),
              ],
            }),
            new Subtraction({
              minuend: new Cylinder({
                origin: 'bottom',
                diameter: frameDiameter,
                lengthZ: frameLengthY,
              }),
              subtrahends: [
                new Cylinder({
                  origin: 'bottom',
                  diameter: frameWallInnerDiameter,
                  lengthZ: frameLengthY,
                }),
              ],
            }),
            new Subtraction({
              minuend: new Cylinder({
                origin: 'bottom',
                diameter: frameWingspan,
                lengthZ: wingLengthZ,
              }),
              subtrahends: [
                new Cylinder({
                  origin: 'bottom',
                  diameter: frameDiameter,
                  lengthZ: wingLengthZ,
                }),
                ..._.range(2).map((index) => (
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
              ],
            }),
          ],
        })
      ));

    super(models);
  }
}

export class Thing extends CompoundModel3D {
  constructor(inputParams: InputDimensions<typeof dimensionNames>) {
    const params = parseInputDimensions(inputParams);

    const {
      trackBaseHeight,
      reelAllowance,
    } = params;

    super(
      new Union({
        models: [
          new ShadeAndTrack(params),
          new Reel(params, { z: trackBaseHeight + reelAllowance }),
          new FrameTemplate(params),
        ],
      }),
    );
  }
}
