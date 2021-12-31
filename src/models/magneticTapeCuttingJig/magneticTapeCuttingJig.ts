import { buildParseInputDimensions } from '../../dimensionParser';
import {
  CompoundModel3D,
  Cylinder,
  RectangularPrism,
  Subtraction,
  Translation,
  Union,
} from '../../modeling';

const dimensionNames = [
  'supportMagnetDiameter',
  'supportMagnetRadius',
  'supportMagnetLengthZ',
  'supportMagnetRadiusAllowance',
  'supportMagnetDiameterAllowance',
  'supportMagnetLengthZAllowance',

  'supportMagnetHoleRadius',
  'supportMagnetHoleDiameter',
  'supportMagnetHoleLengthZ',

  'magneticTapeCutoffLengthX',
  'magneticTapeExcessLengthX',
  'magneticTapeLengthY',
  'magneticTapeLengthXEndAllowance',
  'magneticTapeLengthYTolerance',

  'magneticTapeHoleLengthX',
  'magneticTapeHoleLengthY',
  'magneticTapeHoleLengthZ',

  'bladeLengthX',
  'bladeLengthXTolerance',
  'bladeHoleLengthYAllowance',

  'bladeHoleLengthX',
  'bladeHoleLengthY',

  'magneticBarrierLengthZ',
  'baseLengthZ',
  'smallestWallLengthXY',
  'wallLengthX',
  'wallLengthY',
  'wallLengthZ',

  'outerLengthX',
  'outerLengthY',
  'outerLengthZ',

  'tableProtectionLengthZ',
  'bladeHoleLengthZ',
  'bladeHoleOffsetX',
  'bladeHoleOffsetZ',

  'supportMagnetWallOffsetXY',
  'leftSupportMagnetOffsetX',
  'rightSupportMagnetOffsetX',
  'frontSupportMagnetOffsetY',
  'backSupportMagnetOffsetY',

  'magneticTapeOffsetZ',

  'firstCutJigLengthX',
  'firstCutJigLengthY',
  'firstCutJigLengthZ',
  'firstCutJigOffsetX',
  'firstCutJigOffsetZ',
  'firstCutJigMagnetOffsetZ',

  // For grabbing the FirstCutJig
  'firsCutJigHoldLengthX',
  'firsCutJigHoldLengthY',
  'firsCutJigHoldLengthZ',
  'firsCutJigHoldOffsetX',
] as const;

const mmPerInch = 25.4;
const inchesToMm = (inches: number) => inches * mmPerInch;

const parseInputDimensions = buildParseInputDimensions(dimensionNames, {
  supportMagnetDiameter: '10',
  supportMagnetRadius: 'supportMagnetDiameter / 2',
  supportMagnetLengthZ: '3',
  supportMagnetRadiusAllowance: '.4',
  supportMagnetDiameterAllowance: 'supportMagnetRadiusAllowance * 2',
  supportMagnetLengthZAllowance: '.5',

  supportMagnetHoleRadius: 'supportMagnetRadius + supportMagnetRadiusAllowance',
  supportMagnetHoleDiameter: '2 * supportMagnetHoleRadius',
  supportMagnetHoleLengthZ: 'supportMagnetLengthZ + supportMagnetLengthZAllowance',

  magneticTapeCutoffLengthX: `${inchesToMm(2)}`,
  magneticTapeExcessLengthX: `${inchesToMm(1)}`,
  magneticTapeLengthY: `${inchesToMm(1)}`,
  magneticTapeLengthXEndAllowance: '.4', // only one side is closed off
  magneticTapeLengthYTolerance: '1',

  magneticTapeHoleLengthX: 'magneticTapeLengthXEndAllowance + magneticTapeCutoffLengthX + magneticTapeExcessLengthX',
  magneticTapeHoleLengthY: 'magneticTapeLengthY + magneticTapeLengthYTolerance',
  magneticTapeHoleLengthZ: '8',

  bladeLengthX: '.6',
  bladeLengthXTolerance: '.2',
  bladeHoleLengthYAllowance: '8',

  bladeHoleLengthX: 'bladeLengthX + bladeLengthXTolerance',
  bladeHoleLengthY: 'magneticTapeHoleLengthY + bladeHoleLengthYAllowance',

  magneticBarrierLengthZ: '.6',
  baseLengthZ: 'supportMagnetHoleLengthZ + magneticBarrierLengthZ',
  smallestWallLengthXY: '.8',
  wallLengthX: 'smallestWallLengthXY',
  wallLengthY: '(bladeHoleLengthY / 2) + smallestWallLengthXY - (magneticTapeHoleLengthY / 2)',
  wallLengthZ: 'magneticTapeHoleLengthZ',

  outerLengthX: 'wallLengthX + magneticTapeHoleLengthX',
  outerLengthY: 'bladeHoleLengthY + 2 * smallestWallLengthXY',
  outerLengthZ: 'baseLengthZ + wallLengthZ',

  tableProtectionLengthZ: '.6',
  bladeHoleLengthZ: 'outerLengthZ - tableProtectionLengthZ',
  bladeHoleOffsetX: 'magneticTapeLengthXEndAllowance + magneticTapeCutoffLengthX',
  bladeHoleOffsetZ: 'tableProtectionLengthZ',

  supportMagnetWallOffsetXY: '1',
  leftSupportMagnetOffsetX: 'supportMagnetHoleRadius + wallLengthX + supportMagnetWallOffsetXY',
  rightSupportMagnetOffsetX: 'supportMagnetHoleRadius +  bladeHoleOffsetX - supportMagnetWallOffsetXY - supportMagnetHoleDiameter',
  frontSupportMagnetOffsetY: '(outerLengthY / 2) - supportMagnetHoleRadius - wallLengthY - supportMagnetWallOffsetXY',
  backSupportMagnetOffsetY: '-frontSupportMagnetOffsetY',

  magneticTapeOffsetZ: 'baseLengthZ',

  firstCutJigLengthX: 'magneticTapeCutoffLengthX - 2 * supportMagnetWallOffsetXY - supportMagnetHoleDiameter',
  firstCutJigLengthY: 'magneticTapeLengthY',
  firstCutJigLengthZ: 'magneticBarrierLengthZ + supportMagnetHoleLengthZ',
  firstCutJigOffsetX: 'wallLengthX + magneticTapeLengthXEndAllowance',
  firstCutJigOffsetZ: 'magneticTapeOffsetZ',
  firstCutJigMagnetOffsetZ: 'magneticBarrierLengthZ',

  firsCutJigHoldLengthX: '10',
  firsCutJigHoldLengthY: 'firstCutJigLengthY',
  firsCutJigHoldLengthZ: 'wallLengthZ',
  firsCutJigHoldOffsetX: 'firstCutJigLengthX - firsCutJigHoldLengthX',
});

const d = parseInputDimensions({});

type SupportMagnetHoleParams = {
  name: string;
  xType: 'left' | 'right';
  yType: 'front' | 'back';
}

class SupportMagnetHole extends Cylinder {
  constructor({ name, xType, yType }: SupportMagnetHoleParams) {
    const xOffset = xType === 'left' ? d.leftSupportMagnetOffsetX : d.rightSupportMagnetOffsetX;
    const yOffset = yType === 'front' ? d.frontSupportMagnetOffsetY : d.backSupportMagnetOffsetY;

    super({
      name,
      axis: 'z',
      origin: 'bottom',
      diameter: d.supportMagnetHoleDiameter,
      axialLength: d.supportMagnetHoleLengthZ,
      transforms: [
        new Translation({
          x: xOffset,
          y: yOffset,
        }),
      ],
    });
  }
}

class MagneticTapeCuttingJig extends CompoundModel3D {
  constructor() {
    super(
      new Subtraction({
        name: 'MagneticTapeCuttingJig',
        models: [
          new RectangularPrism({
            name: 'OuterBlock',
            origin: ['left', 'center', 'bottom'],
            lengthX: d.outerLengthX,
            lengthY: d.outerLengthY,
            lengthZ: d.outerLengthZ,
          }),
          new RectangularPrism({
            name: 'MagneticTapeHole',
            origin: ['left', 'center', 'bottom'],
            lengthX: d.magneticTapeHoleLengthX,
            lengthY: d.magneticTapeHoleLengthY,
            lengthZ: d.magneticTapeHoleLengthZ,
            transforms: [
              new Translation({
                x: d.wallLengthX,
                z: d.magneticTapeOffsetZ,
              }),
            ],
          }),
          new RectangularPrism({
            name: 'BladeHole',
            origin: ['left', 'center', 'bottom'],
            lengthX: d.bladeHoleLengthX,
            lengthY: d.bladeHoleLengthY,
            lengthZ: d.bladeHoleLengthZ,
            transforms: [
              new Translation({
                x: d.bladeHoleOffsetX,
                z: d.bladeHoleOffsetZ,
              }),
            ],
          }),
          new SupportMagnetHole({
            name: 'LeftFrontSupportMagnetHole',
            xType: 'left',
            yType: 'front',
          }),
          new SupportMagnetHole({
            name: 'LeftBackSupportMagnetHole',
            xType: 'left',
            yType: 'back',
          }),
          new SupportMagnetHole({
            name: 'RightFrontSupportMagnetHole',
            xType: 'right',
            yType: 'front',
          }),
          new SupportMagnetHole({
            name: 'RightBackSupportMagnetHole',
            xType: 'right',
            yType: 'back',
          }),
        ],
      }),
    );
  }
}

class FirstCutJig extends CompoundModel3D {
  constructor() {
    super(
      new Union({
        name: 'FirstCutJig',
        models: [
          new Subtraction({
            name: 'FirstCutJig',
            models: [
              new RectangularPrism({
                name: 'OuterBlock',
                origin: ['left', 'center', 'bottom'],
                lengthX: d.firstCutJigLengthX,
                lengthY: d.firstCutJigLengthY,
                lengthZ: d.firstCutJigLengthZ,
              }),
              new Union({
                name: 'SupportMagnetHoles',
                models: [
                  new SupportMagnetHole({
                    name: 'FrontSupportMagnetHole',
                    xType: 'left',
                    yType: 'front',
                  }),
                  new SupportMagnetHole({
                    name: 'BackSupportMagnetHole',
                    xType: 'left',
                    yType: 'back',
                  }),
                ],
                transforms: [
                  new Translation({
                    z: d.firstCutJigMagnetOffsetZ,
                  }),
                ],
              }),
            ],
          }),
          new RectangularPrism({
            name: 'Hold',
            origin: ['left', 'center', 'bottom'],
            lengthX: d.firsCutJigHoldLengthX,
            lengthY: d.firsCutJigHoldLengthY,
            lengthZ: d.firsCutJigHoldLengthZ,
            transforms: [
              new Translation({ x: d.firsCutJigHoldOffsetX }),
            ],
          }),
        ],
        transforms: [
          new Translation({
            x: d.firstCutJigOffsetX,
            z: d.firstCutJigOffsetZ,
          }),
        ],
      }),
    );
  }
}

export default {
  magneticTapeCuttingJig: new MagneticTapeCuttingJig(),
  firstCutJig: new FirstCutJig(),
};
