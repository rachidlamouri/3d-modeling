import _ from 'lodash';
import { buildParseInputDimensions, Dimensions, InputDimensions } from '../dimensionParser';
import {
  Collection3D,
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  RotationInput,
  Subtraction,
  Union,
} from '../modeling';
import { Vector3DObject } from '../modeling/vector';
import { Image, ImageParams } from './image';

const dimensionNames = [
  'frameCount',
  'firstFrameAngle',
  'lastFrameAngle',
  'frameAngleZ',
  'frameDiameterAllowance',
  'frameRadiusAllowance',
  'frameLengthYAllowance',
  'frameImageDiameter',
  'frameImageRadius',
  'frameImageMinLengthY',
  'frameImageMaxLengthY',
  'frameWallInnerRadius',
  'frameWallInnerDiameter',
  'frameWallLengthXZ',
  'frameWallLengthY',
  'frameWallOuterRadius',
  'frameWallOuterDiameter',
  'frameWingLengthX',
  'frameWingLengthY',
  'frameWingLengthZ',
  'frameWingLengthZAllowance',
  'frameWingDeflectionAngle',
  'frameWingspan',
  'frameWingChannelBuffer',
  'frameImageHoleDiameter',
  'frameImageHoleRadius',
  'frameWallChannelDiameter',
  'frameWallChannelRadius',
  'frameWallChannelLengthY',
  'frameWingChannelDiameter',
  'frameWingChannelRadius',
  'frameWingChannelLengthY',
  'frameWingCatchLengthX',
  'frameWingCatchLengthY',
  'frameWingCatchLengthZ',
  'trackNubRadius',
  'trackNubDiameter',
  'trackNubRadiusAllowance',
  'trackNubHoleRadius',
  'trackNubHoleDiameter',
  'reelHeight',
  'reelDiameterAllowance',
  'reelRadiusAllowance',
  'reelHeightAllowance',
  'frameSlotLengthX',
  'frameSlotLengthY',
  'frameSlotLengthZ',
  'lightBaseHeight',
  'lightLightBottomHeight',
  'lightLightTopHeight',
  'lightTopHeight',
  'lightBaseDiameter',
  'lightBaseRadius',
  'lightMidDiameter',
  'lightLightDiameter',
  'lightTopDiameter',
  'lightDiameterAllowance',
  'supportBaseHeight',
  'supportLightHoleInnerDiameter',
  'supportLightHoleHeight',
  'supportLightBaseSupportLength',
  'shadeInnerDiameter',
  'shadeInnerRadius',
  'shadeThickness',
  'shadeOuterRadius',
  'shadeOuterDiameter',
  'shadeHeight',
  'shadeOutletDiameter',
  'shadeOutletLengthY',
  'supportMainThickness',
  'supportMainDiameterAllowance',
  'supportMainRadiusAllowance',
  'supportMainOuterRadius',
  'supportMainOuterDiameter',
  'supportMainInnerRadius',
  'supportMainInnerDiameter',
  'supportMainOverlapHeight',
  'supportMainHeight',
  'supportMainGapLength',
  'reelInnerRadius',
  'reelInnerDiameter',
  'reelThicknessBuffer',
  'reelThickness',
  'reelOuterRadius',
  'reelOuterDiameter',
  'reelNotchRadius',
  'reelNotchLength',
  'frameImageHoleLengthY',
  'trackLipThickness',
  'trackLipHeight',
  'trackBaseInnerRadius',
  'trackBaseInnerDiameter',
  'trackLipInnerRadius',
  'trackLipInnerDiameter',
  'trackLipOuterRadius',
  'trackLipOuterDiameter',
  'trackBaseOuterRadius',
  'trackBaseOuterDiameter',
  'trackBaseSupportHoleHeightAllowance',
  'trackBaseHeight',
  'trackBaseSupportHoleOuterRadius',
  'trackBaseSupportHoleThickness',
  'trackNubLength',
] as const;

const parseInputDimensions = buildParseInputDimensions<typeof dimensionNames>(
  dimensionNames,
  {
    frameCount: '4',
    firstFrameAngle: '90',
    lastFrameAngle: '-90',
    frameAngleZ: '(lastFrameAngle - firstFrameAngle) / (frameCount - 1)',
    frameDiameterAllowance: '.3',
    frameRadiusAllowance: 'frameDiameterAllowance / 2',
    frameLengthYAllowance: '.2',

    frameImageDiameter: '40',
    frameImageRadius: 'frameImageDiameter / 2',
    frameImageMinLengthY: '.1',
    frameImageMaxLengthY: '4',

    frameWallInnerRadius: 'frameImageRadius',
    frameWallInnerDiameter: '2 * frameWallInnerRadius',
    frameWallLengthXZ: '.8',
    frameWallLengthY: 'frameImageMaxLengthY',
    frameWallOuterRadius: 'frameWallInnerRadius + frameWallLengthXZ',
    frameWallOuterDiameter: '2 * frameWallOuterRadius',

    frameWingLengthX: '4',
    frameWingLengthY: '1.6',
    frameWingLengthZ: '6',
    frameWingLengthZAllowance: '.3',
    frameWingDeflectionAngle: '2',
    frameWingspan: 'frameWallOuterDiameter + 2 * frameWingLengthX',
    frameWingChannelBuffer: '1',

    frameImageHoleDiameter: 'frameImageDiameter + frameDiameterAllowance',
    frameImageHoleRadius: 'frameImageHoleDiameter / 2',

    frameWallChannelDiameter: 'frameWallOuterDiameter + frameDiameterAllowance',
    frameWallChannelRadius: 'frameWallChannelDiameter / 2',
    frameWallChannelLengthY: 'frameWallLengthY + frameLengthYAllowance',

    frameWingChannelDiameter: 'frameWingspan + frameDiameterAllowance',
    frameWingChannelRadius: 'frameWingChannelDiameter / 2',
    frameWingChannelLengthY: 'frameWingLengthY + frameLengthYAllowance',
    frameWingCatchLengthX: '2 * (frameRadiusAllowance) + frameWingLengthX',
    frameWingCatchLengthY: 'frameWingChannelLengthY',
    frameWingCatchLengthZ: 'frameWingLengthZ + frameWingLengthZAllowance',

    trackNubRadius: '2',
    trackNubDiameter: '2 * trackNubRadius',
    trackNubRadiusAllowance: '.3',
    trackNubHoleRadius: 'trackNubRadius + trackNubRadiusAllowance',
    trackNubHoleDiameter: '2 * trackNubHoleRadius',

    reelHeight: '2 * (trackNubHoleRadius + frameWingChannelBuffer) + frameWingChannelDiameter',
    reelDiameterAllowance: '.5',
    reelRadiusAllowance: 'reelDiameterAllowance / 2',
    reelHeightAllowance: '.1',

    frameSlotLengthX: 'frameWallChannelDiameter',
    frameSlotLengthY: 'frameWallChannelLengthY',
    frameSlotLengthZ: 'reelHeight / 2',

    lightBaseHeight: '16',
    lightLightBottomHeight: '95',
    lightLightTopHeight: '150',
    lightTopHeight: '182',
    lightBaseDiameter: '89',
    lightBaseRadius: 'lightBaseDiameter / 2',
    lightMidDiameter: '82',
    lightLightDiameter: '66',
    lightTopDiameter: '100',
    lightDiameterAllowance: '.3',

    supportBaseHeight: '2',
    supportLightHoleInnerDiameter: 'lightBaseDiameter + lightDiameterAllowance',
    supportLightHoleHeight: 'lightBaseHeight',
    supportLightBaseSupportLength: '16',

    shadeInnerDiameter: 'lightTopDiameter + lightDiameterAllowance',
    shadeInnerRadius: 'shadeInnerDiameter / 2',
    shadeThickness: '.8',
    shadeOuterRadius: 'shadeInnerRadius + shadeThickness',
    shadeOuterDiameter: '2 * shadeOuterRadius',
    shadeHeight: 'reelHeight + reelHeightAllowance',
    shadeOutletDiameter: 'frameImageHoleDiameter + 2', // widening to permit more light
    shadeOutletLengthY: 'shadeOuterRadius',

    supportMainThickness: '.8',
    supportMainDiameterAllowance: '.6',
    supportMainRadiusAllowance: 'supportMainDiameterAllowance / 2',
    supportMainOuterRadius: '.5 * trackBaseInnerRadius + .5 * trackBaseOuterRadius + supportMainThickness / 2',
    supportMainOuterDiameter: '2 * supportMainOuterRadius',
    supportMainInnerRadius: 'supportMainOuterRadius - supportMainThickness',
    supportMainInnerDiameter: '2 * supportMainInnerRadius',
    supportMainOverlapHeight: '6',
    supportMainHeight: 'lightLightBottomHeight + supportMainOverlapHeight',
    supportMainGapLength: 'shadeOutletDiameter',

    reelInnerRadius: 'shadeOuterRadius + reelRadiusAllowance',
    reelInnerDiameter: '2 * reelInnerRadius',
    reelThicknessBuffer: '2',
    reelThickness: '1.8 * frameSlotLengthY + 2 * reelThicknessBuffer',
    reelOuterRadius: 'reelInnerRadius + reelThickness',
    reelOuterDiameter: '2 * reelOuterRadius',

    reelNotchRadius: 'trackNubRadius + trackNubRadiusAllowance',
    reelNotchLength: 'reelOuterRadius',

    frameImageHoleLengthY: 'reelOuterRadius',

    trackLipThickness: '.8',
    trackLipHeight: 'trackNubHoleRadius + frameWingChannelBuffer',

    trackBaseInnerRadius: 'shadeInnerRadius',
    trackBaseInnerDiameter: '2 * trackBaseInnerRadius',
    trackLipInnerRadius: 'shadeOuterRadius + 2 * reelRadiusAllowance + reelThickness',
    trackLipInnerDiameter: '2 * trackLipInnerRadius',
    trackLipOuterRadius: 'trackLipInnerRadius + trackLipThickness',
    trackLipOuterDiameter: '2 * trackLipOuterRadius',
    trackBaseOuterRadius: 'trackLipOuterRadius',
    trackBaseOuterDiameter: '2 * trackBaseOuterRadius',
    trackBaseSupportHoleHeightAllowance: '.5',
    trackBaseHeight: 'supportMainOverlapHeight + trackBaseSupportHoleHeightAllowance',
    trackBaseSupportHoleOuterRadius: 'supportMainOuterRadius + supportMainRadiusAllowance',
    trackBaseSupportHoleThickness: 'supportMainThickness + 2 * supportMainRadiusAllowance',

    trackNubLength: 'trackLipInnerRadius - trackBaseInnerRadius',
  },
);

type ThingDimensions = Dimensions<typeof dimensionNames>;

const tubeDimensions = [
  'innerRadius',
  'innerDiameter',
  'wallThickness',
  'outerRadius',
  'outerDiameter',
  'lengthZ',
  'height',
] as const;

const parseTubeDimensions = buildParseInputDimensions<typeof tubeDimensions>(
  tubeDimensions,
  {
    innerDiameter: '2 * innerRadius',
    outerDiameter: '2 * outerRadius',
    outerRadius: 'innerRadius + wallThickness',
    height: 'lengthZ',
  },
);

type TubeParams = InputDimensions<typeof tubeDimensions> & {
  origin: 'bottom' | 'center' | 'top';
  rotations?: RotationInput[];
  translation?: Partial<Vector3DObject>;
};

class Tube extends CompoundModel3D {
  constructor({
    origin,
    rotations = [],
    translation = {},
    ...inputParams
  }: TubeParams) {
    const {
      innerDiameter,
      outerDiameter,
      lengthZ,
    } = parseTubeDimensions(inputParams);

    super(
      new Subtraction({
        models: [
          new Cylinder({
            origin,
            diameter: outerDiameter,
            lengthZ,
          }),
          new Cylinder({
            origin,
            diameter: innerDiameter,
            lengthZ,
          }),
        ],
        rotations,
        translation,
      }),
    );
  }
}

class Shade extends CompoundModel3D {
  constructor(thingParams: ThingDimensions, translation?: Partial<Vector3DObject>) {
    const {
      shadeInnerDiameter,
      shadeOuterDiameter,
      shadeHeight,
      shadeOutletDiameter,
      shadeOutletLengthY,
    } = thingParams;

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
            translation: {
              y: shadeOutletLengthY / 2,
              z: shadeHeight / 2,
            },
            rotations: [
              [{ x: -90 }, 'self'],
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
    } = params;

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

class ShadeAndTrack extends CompoundModel3D {
  constructor(params: ThingDimensions, translation: Partial<Vector3DObject> = {}) {
    super(
      new Union({
        models: [
          new Shade(params, { z: params.trackBaseHeight }),
          new Track(params),
        ],
        translation,
      }),
    );
  }
}

type FrameHoleAssemblyParams = {
  thingParams: Dimensions<typeof dimensionNames>;
  originAngleZ: number;
  translation?: Partial<Vector3DObject>,
  rotations?: RotationInput[],
};

class FrameHoleAssembly extends CompoundModel3D {
  constructor({
    thingParams,
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
    } = thingParams;

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

class Reel extends CompoundModel3D {
  constructor(params: Dimensions<typeof dimensionNames>, translation: Partial<Vector3DObject> = {}) {
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
    } = params;

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
              thingParams: params,
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

export class FrameTemplate extends CompoundModel3D {
  constructor(params: Dimensions<typeof dimensionNames>) {
    const {
      frameImageDiameter,
      frameWallInnerDiameter,
      frameWallOuterDiameter,
      frameWallLengthY,
      frameWingLengthY,
      frameWingLengthZ,
      frameWingspan,
    } = params;

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
                translation: {
                  y: (index === 0 ? -1 : 1) * (frameWingLengthZ / 2),
                },
              })),
            ],
          }),
        ],
        translation: {
          z: frameWallOuterDiameter / 2,
        },
        rotations: [
          [{ x: 90 }, 'self'],
        ],
      }),
    );
  }
}

export class Frame extends Collection3D {
  constructor(params: Omit<ImageParams, 'lengthX' | 'lengthY' | 'minLengthZ' | 'maxLengthZ'>) {
    const {
      frameImageDiameter,
      frameImageMinLengthY,
      frameImageMaxLengthY,
      frameWallInnerDiameter,
      frameWallOuterDiameter,
      frameWallLengthY,
      frameWingspan,
      frameWingLengthY,
      frameWingLengthZ,
    } = parseInputDimensions({});

    const models = new Image({
      ...params,
      lengthX: frameImageDiameter,
      lengthY: frameImageDiameter,
      minLengthZ: frameImageMinLengthY,
      maxLengthZ: frameImageMaxLengthY,
    })
      .models.map((imageSlice) => (
        new Union({
          models: [
            new Subtraction({
              models: [
                imageSlice,
                new Subtraction({
                  minuend: new RectangularPrism({
                    origin: ['center', 'center', 'bottom'],
                    lengthX: frameImageDiameter,
                    lengthY: frameImageDiameter,
                    lengthZ: frameImageMaxLengthY,
                  }),
                  subtrahends: [
                    new Cylinder({
                      origin: 'bottom',
                      diameter: frameImageDiameter,
                      lengthZ: frameImageMaxLengthY,
                    }),
                  ],
                }),
              ],
            }),
            new Tube({
              origin: 'bottom',
              outerDiameter: frameWallOuterDiameter,
              innerDiameter: frameWallInnerDiameter,
              lengthZ: frameWallLengthY,
            }),
            new Subtraction({
              minuend: new Cylinder({
                origin: 'bottom',
                diameter: frameWingspan,
                lengthZ: frameWingLengthY,
              }),
              subtrahends: [
                new Cylinder({
                  origin: 'bottom',
                  diameter: frameWallOuterDiameter,
                  lengthZ: frameWingLengthY,
                }),
                ..._.range(2).map((index) => (
                  new RectangularPrism({
                    origin: ['center', (index === 0 ? 'front' : 'back'), 'bottom'],
                    lengthX: frameWingspan,
                    lengthY: (frameWingspan - frameWingLengthZ) / 2,
                    lengthZ: frameWingLengthY,
                    translation: {
                      y: (index === 0 ? -1 : 1) * (frameWingLengthZ / 2),
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

class Light extends CompoundModel3D {
  constructor(params: ThingDimensions, translation: Partial<Vector3DObject> = {}) {
    const {
      lightBaseDiameter,
      lightMidDiameter,
      lightLightDiameter,
      lightTopDiameter,
      lightBaseHeight,
      lightLightBottomHeight,
      lightLightTopHeight,
      lightTopHeight,
    } = params;

    super(
      new Union({
        models: [
          new Cylinder({
            origin: 'bottom',
            diameter: lightBaseDiameter,
            height: lightBaseHeight,
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightMidDiameter,
            height: lightLightBottomHeight - lightBaseHeight,
            translation: { z: lightBaseHeight },
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightLightDiameter,
            height: lightLightTopHeight - lightLightBottomHeight,
            translation: { z: lightLightBottomHeight },
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightMidDiameter,
            height: (lightTopHeight - lightLightTopHeight) / 2,
            translation: { z: lightLightTopHeight },
          }),
          new Cylinder({
            origin: 'bottom',
            diameter: lightTopDiameter,
            height: (lightTopHeight - lightLightTopHeight) / 2,
            translation: { z: lightLightTopHeight + ((lightTopHeight - lightLightTopHeight) / 2) },
          }),
        ],
        translation,
      }),
    );
  }
}

class Support extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    const {
      supportLightHoleInnerDiameter,
      supportLightHoleHeight,
      supportBaseHeight,
      lightBaseRadius,
      supportLightBaseSupportLength,
      supportMainHeight,
      supportMainThickness,
      supportMainInnerDiameter,
      supportMainOuterDiameter,
      supportMainOverlapHeight,
      supportMainGapLength,
    } = params;

    super(
      new Union({
        models: [
          new Tube({
            origin: 'bottom',
            outerDiameter: supportMainOuterDiameter,
            innerRadius: lightBaseRadius - supportLightBaseSupportLength,
            height: supportBaseHeight,
          }),
          new Union({
            models: [
              new Tube({
                origin: 'bottom',
                outerDiameter: supportMainInnerDiameter,
                innerDiameter: supportLightHoleInnerDiameter,
                height: supportLightHoleHeight,
              }),
              new Subtraction({
                models: [
                  new Tube({
                    origin: 'bottom',
                    outerDiameter: supportMainOuterDiameter,
                    wallThickness: supportMainThickness,
                    height: supportMainHeight,
                  }),
                  new Union({
                    models: [
                      new RectangularPrism({
                        origin: ['center', 'center', 'bottom'],
                        lengthX: supportMainGapLength,
                        lengthY: supportMainOuterDiameter,
                        lengthZ: supportMainOverlapHeight,
                      }),
                      new RectangularPrism({
                        origin: ['center', 'center', 'bottom'],
                        lengthX: supportMainOuterDiameter,
                        lengthY: supportMainGapLength,
                        lengthZ: supportMainOverlapHeight,
                      }),
                    ],
                    translation: {
                      z: supportMainHeight - supportMainOverlapHeight,
                    },
                  }),
                ],
              }),
            ],
            translation: {
              z: supportBaseHeight,
            },
          }),
        ],
      }),
    );
  }
}

export class FrameHoleAssemblyDemo extends FrameHoleAssembly {
  constructor(params: ThingDimensions) {
    super({
      originAngleZ: 0,
      thingParams: params,
    });
  }
}

export class ReelLowerSliceTest extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    const {
      reelOuterDiameter,
      reelHeight,
      trackBaseHeight,
      trackLipHeight,
    } = params;

    super(
      new Subtraction({
        models: [
          new Reel(params),
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

export class ShadeAndTrackLowerSliceTest extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    const {
      trackBaseOuterDiameter,
      shadeHeight,
      trackBaseHeight,
      trackLipHeight,
    } = params;

    super(
      new Subtraction({
        models: [
          new ShadeAndTrack(params),
          new Cylinder({
            origin: 'bottom',
            diameter: trackBaseOuterDiameter,
            height: shadeHeight + trackBaseHeight,
            translation: {
              z: trackBaseHeight + trackLipHeight,
            },
          }),
        ],
      }),
    );
  }
}

export class ReelFrameHoleSliceTest extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    const {
      reelOuterRadius,
      reelOuterDiameter,
      reelHeight,
      frameWingChannelDiameter,
      frameWingChannelBuffer,
      firstFrameAngle,
      frameAngleZ,
    } = params;

    super(
      new Subtraction({
        models: [
          new Reel(params),
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
  constructor(params: ThingDimensions) {
    const {
      frameWallChannelDiameter,
      reelInnerDiameter,
      reelThickness,
      firstFrameAngle,
      frameAngleZ,
      frameWingDeflectionAngle,
    } = params;

    super(
      new Subtraction({
        models: [
          new ReelFrameHoleSliceTest(params),
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

export class SupportTopSliceTest extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    super(
      new Subtraction({
        models: [
          new Support(params),
          new Cylinder({
            origin: 'bottom',
            diameter: params.supportMainOuterDiameter,
            height: params.supportMainHeight - params.supportMainOverlapHeight * 2,
          }),
        ],
      }),
    );
  }
}

export class SupportBottomSliceTest extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    super(
      new Subtraction({
        models: [
          new Support(params),
          new Cylinder({
            origin: 'bottom',
            diameter: params.supportMainOuterDiameter,
            height: params.supportMainHeight,
            translation: {
              z: params.lightBaseHeight,
            },
          }),
        ],
      }),
    );
  }
}

export class ShadeSliceTest extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    super(
      new Subtraction({
        models: [
          new Shade(params),
          new RectangularPrism({
            origin: ['center', 'back', 'bottom'],
            lengthX: params.shadeOuterDiameter,
            lengthY: params.shadeOuterRadius,
            lengthZ: params.shadeHeight,
          }),
          new RectangularPrism({
            origin: ['left', 'front', 'bottom'],
            lengthX: params.shadeOuterRadius,
            lengthY: params.shadeOuterRadius,
            lengthZ: params.shadeHeight,
          }),
        ],
      }),
    );
  }
}

export class Demo extends CompoundModel3D {
  constructor(params: ThingDimensions) {
    const {
      lightLightBottomHeight,
      reelHeightAllowance,
      trackBaseHeight,
      supportBaseHeight,
    } = params;

    super(
      new Union({
        models: [
          new Support(params),
          new Light(params, { z: supportBaseHeight }),
          new ShadeAndTrack(params, { z: supportBaseHeight + lightLightBottomHeight }),
          new Reel(params, { z: lightLightBottomHeight + trackBaseHeight + reelHeightAllowance }),
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
          // new FrameTemplate(params),

          // new Light(params),
          // new Support(params),
          // new Shade(params),
          // new Track(params),
          // new ShadeAndTrack(params),

          // new FrameHoleAssemblyDemo(params),
          // new Reel(params),

          // new ReelLowerSliceTest(params),
          // new ShadeAndTrackLowerSliceTest(params),
          // new ReelFrameHoleSliceTest(params),
          // new ReelFrameChannelSliceTest(params),
          // new SupportTopSliceTest(params),
          // new SupportBottomSliceTest(params),
          // new ShadeSliceTest(params),

          new Demo(params),
        ],
      }),
    );
  }
}
