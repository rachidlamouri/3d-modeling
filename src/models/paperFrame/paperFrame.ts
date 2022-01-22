import { buildParseInputDimensions } from '../../dimensionParser';
import {
  RectangularPrism, Rotation, Subtraction, Translation,
} from '../../modeling';

const dimensionNames = [
  'paperLengthXY',
  'paperLengthZ',

  'paperLengthXYTolerance',
  'paperLengthZTolerance',

  'paperMarginLengthXY',
  'wallLengthXY',
  'topBottomFaceLengthZ',

  'paperOffsetZ',

  'bottomInnerLengthXY',
  'bottomInnerLengthZ',
  'bottomInnerOffsetZ',

  'bottomOuterLengthXY',
  'bottomOuterLengthZ',

  'bottomToleranceXY',
  'bottomToleranceZ',

  'topInnerLengthXY',
  'topInnerLengthZ',
  'topInnerOffsetZ',

  'topOuterLengthXY',
  'topOuterLengthZ',

  'topHoleLengthXY',
  'topHoleLengthZ',
] as const;

const d = buildParseInputDimensions(dimensionNames, {
  paperLengthXY: '76',
  paperLengthZ: '.12',

  paperLengthXYTolerance: '.5',
  paperLengthZTolerance: '1',

  paperMarginLengthXY: '3',
  wallLengthXY: '.8',
  topBottomFaceLengthZ: '.6',

  paperOffsetZ: 'topBottomFaceLengthZ + paperLengthZTolerance / 2',

  bottomInnerLengthXY: 'paperLengthXY + paperLengthXYTolerance',
  bottomInnerLengthZ: 'paperLengthZ + paperLengthZTolerance',
  bottomInnerOffsetZ: 'topBottomFaceLengthZ',

  bottomOuterLengthXY: 'bottomInnerLengthXY + 2 * wallLengthXY',
  bottomOuterLengthZ: 'bottomInnerLengthZ + topBottomFaceLengthZ',

  bottomToleranceXY: '.4',
  bottomToleranceZ: '.2',

  topInnerLengthXY: 'bottomOuterLengthXY + bottomToleranceXY',
  topInnerLengthZ: 'bottomOuterLengthZ + bottomToleranceZ',
  topInnerOffsetZ: 'topBottomFaceLengthZ',

  topOuterLengthXY: 'topInnerLengthXY + 2 * wallLengthXY',
  topOuterLengthZ: 'topInnerLengthZ + topBottomFaceLengthZ',

  topHoleLengthXY: 'paperLengthXY - 2 * paperMarginLengthXY',
  topHoleLengthZ: 'topBottomFaceLengthZ',
})({});

export default {
  paper: new RectangularPrism({
    origin: ['center', 'center', 'bottom'],
    lengthX: d.paperLengthXY,
    lengthY: d.paperLengthXY,
    lengthZ: d.paperLengthZ,
    transforms: [
      new Translation({
        z: d.paperOffsetZ,
      }),
    ],
  }),
  bottom: new Subtraction({
    name: 'Bottom Container',
    models: [
      new RectangularPrism({
        name: 'Outer',
        origin: ['center', 'center', 'bottom'],
        lengthX: d.bottomOuterLengthXY,
        lengthY: d.bottomOuterLengthXY,
        lengthZ: d.bottomOuterLengthZ,
      }),
      new RectangularPrism({
        name: 'Inner',
        origin: ['center', 'center', 'bottom'],
        lengthX: d.bottomInnerLengthXY,
        lengthY: d.bottomInnerLengthXY,
        lengthZ: d.bottomInnerLengthZ,
        transforms: [
          new Translation({ z: d.bottomInnerOffsetZ }),
        ],
      }),
    ],
  }),
  top: new Subtraction({
    name: 'Top Container',
    models: [
      new RectangularPrism({
        name: 'Outer',
        origin: ['center', 'center', 'bottom'],
        lengthX: d.topOuterLengthXY,
        lengthY: d.topOuterLengthXY,
        lengthZ: d.topOuterLengthZ,
      }),
      new RectangularPrism({
        name: 'Inner',
        origin: ['center', 'center', 'bottom'],
        lengthX: d.topInnerLengthXY,
        lengthY: d.topInnerLengthXY,
        lengthZ: d.topInnerLengthZ,
        transforms: [
          new Translation({ z: d.topInnerOffsetZ }),
        ],
      }),
      new RectangularPrism({
        name: 'Hole',
        origin: ['center', 'center', 'bottom'],
        lengthX: d.topHoleLengthXY,
        lengthY: d.topHoleLengthXY,
        lengthZ: d.topHoleLengthZ,
      }),
    ],
    transforms: [
      // new Rotation({ x: 180 }, 'self'),
    ],
  }),
};
