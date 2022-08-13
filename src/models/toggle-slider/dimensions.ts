import { buildParseInputDimensions, Dimensions } from '../../dimensionParser';

const dimensionNames = [
  'magnetDiameter',
  'magnetDiameterTolerance',
  'magnetLengthZ',
  'magnetLengthZTolerance',

  'magnetHoleDiameter',
  'magnetHoleLengthZ',

  'centerToCenterLength',

  'openBorderLength',
  'solidBorderLength',

  'windowPlateLengthX',
  'windowPlateLengthY',
  'windowPlateLengthZ',

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

    centerToCenterLength: '50',

    openBorderLength: '5',
    solidBorderLength: 'openBorderLength',

    basePlateTopThickness: '.6',

    basePlateLengthX: '2 * solidBorderLength + 2 * openBorderLength + magnetDiameter + centerToCenterLength',
    basePlateLengthY: '2 * solidBorderLength + 2 * openBorderLength + magnetDiameter',
    basePlateLengthZ: 'magnetHoleLengthZ + basePlateTopThickness',

    windowPlateLengthX: 'basePlateLengthX',
    windowPlateLengthY: 'basePlateLengthY',
    windowPlateLengthZ: '1.5 * (magnetLengthZ + 2 * magnetLengthZTolerance)',

    windowPlateHoleLengthX: 'windowPlateLengthX - 2 * solidBorderLength',
    windowPlateHoleLengthY: 'windowPlateLengthY - 2 * solidBorderLength',
    windowPlateHoleLengthZ: 'windowPlateLengthZ',
  },
);

type ToggleSliderDimensions = Dimensions<typeof dimensionNames>;

export const toggleSliderDimensions: ToggleSliderDimensions = parseInputDimensions({});
