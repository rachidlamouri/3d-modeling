import { buildParseInputDimensions, Dimensions } from '../../dimensionParser';

const dimensionNames = [
  'magnetDiameter',
  'magnetDiameterTolerance',
  'magnetLengthZ',
  'magnetLengthZTolerance',

  'magnetHoleDiameter',
  'magnetHoleLengthZ',

  'sliderBottomThickness',
  'sliderWallThickness',
  'sliderExtraGrabLengthZ',

  'sliderLengthX',
  'sliderLengthY',
  'sliderLengthZ',
  'sliderHoleLengthZ',

  'centerToCenterLength',

  'windowWallThickness',

  'windowPlateLengthX',
  'windowPlateLengthY',
  'windowPlateLengthZ',

  'windowPlateHoleAllowanceXY',
  'windowPlateHoleLengthX',
  'windowPlateHoleLengthY',
  'windowPlateHoleLengthZ',

  'basePlateTopThickness',

  'basePlateLengthX',
  'basePlateLengthY',
  'basePlateLengthZ',
] as const;

const parseInputDimensions = buildParseInputDimensions<typeof dimensionNames>(
  dimensionNames,
  {
    magnetDiameter: '10',
    magnetDiameterTolerance: '.1',
    magnetLengthZ: '3',
    magnetLengthZTolerance: '.1',

    magnetHoleDiameter: 'magnetDiameter + 2 * magnetDiameterTolerance',
    magnetHoleLengthZ: 'magnetLengthZ + 1.5 * magnetLengthZTolerance',

    sliderBottomThickness: '.6',
    sliderWallThickness: '.8',

    sliderExtraGrabLengthZ: '2',

    sliderLengthX: 'magnetHoleDiameter + 2 * sliderWallThickness',
    sliderLengthY: 'sliderLengthX',
    sliderLengthZ: 'sliderBottomThickness + magnetHoleLengthZ + sliderExtraGrabLengthZ',
    sliderHoleLengthZ: 'sliderLengthZ',

    centerToCenterLength: '20',

    windowWallThickness: '.8',

    windowPlateHoleAllowanceXY: '.5',
    windowPlateHoleLengthX: 'sliderLengthX + centerToCenterLength + windowPlateHoleAllowanceXY',
    windowPlateHoleLengthY: 'sliderLengthY + windowPlateHoleAllowanceXY',
    windowPlateHoleLengthZ: 'windowPlateLengthZ',

    windowPlateLengthX: 'windowPlateHoleLengthX + 2 * windowWallThickness',
    windowPlateLengthY: 'windowPlateHoleLengthY + 2 * windowWallThickness',
    windowPlateLengthZ: 'magnetLengthZ',

    basePlateTopThickness: '.6',

    basePlateLengthX: 'windowPlateLengthX',
    basePlateLengthY: 'windowPlateLengthY',
    basePlateLengthZ: 'magnetHoleLengthZ + basePlateTopThickness',
  },
);

type ToggleSliderDimensions = Dimensions<typeof dimensionNames>;

export const toggleSliderDimensions: ToggleSliderDimensions = parseInputDimensions({});
