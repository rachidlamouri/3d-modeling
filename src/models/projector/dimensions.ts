import { buildParseInputDimensions, Dimensions } from '../../dimensionParser';

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
    frameImageMaxLengthY: '3',

    frameWallInnerRadius: 'frameImageRadius',
    frameWallInnerDiameter: '2 * frameWallInnerRadius',
    frameWallLengthXZ: '.8',
    frameWallLengthY: '4',
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

type ProjectorDimensions = Dimensions<typeof dimensionNames>;

export const projectorDimensions: ProjectorDimensions = parseInputDimensions({});
