import {
  Subtraction,
  CompoundModel3D,
  Cylinder,
  Translation,
  Union,
} from '../../modeling';
import { ComplexRectangularPrism } from '../../modeling/complexRectangularPrism';

const cardLengthX = 85.6;
const cardLengthY = 53.98;

const chipLengthX = 21;
const chipLengthY = 11;
const chipLengthZ = 0.2;
const chipToleranceXY = 1;

const baseToChipThickness = 0.6;
const edgeToChipThickenss = 4;

const chipCoverLengthX = chipLengthX + chipToleranceXY;
const chipCoverLengthY = chipLengthY + chipToleranceXY;
const chipCoverLengthZ = 2;
const chipCoverToleranceXY = 1;
const chipCoverToleranceZ = 0.6;
const chipCoverDecorationLengthZ = 0.6;

const chipHoleLengthX = chipCoverLengthX + chipCoverToleranceXY;
const chipHoleLengthY = chipCoverLengthY + chipCoverToleranceXY;
const chipHoleLengthZ = chipCoverLengthZ + chipCoverToleranceZ;

const cardLengthZ = baseToChipThickness + chipLengthZ + chipHoleLengthZ;

const cardCornerRadius = 3.18;

class ChipCover extends CompoundModel3D {
  constructor() {
    super(
      new Subtraction({
        models: [
          new ComplexRectangularPrism({
            name: 'Chip Base',
            lengthX: chipCoverLengthX,
            lengthY: chipCoverLengthY,
            lengthZ: chipCoverLengthZ,
            cornerRadius: cardCornerRadius,
          }),
          new Union({
            models: [
              new Cylinder({
                name: 'Center Punch',
                axis: 'z',
                axialLength: chipCoverDecorationLengthZ,
                origin: 'bottom',
                radius: 2,
              }),
              new ComplexRectangularPrism({
                lengthX: 4,
                lengthY: 1,
                lengthZ: chipCoverDecorationLengthZ,
                cornerRadius: 0.5,
                transforms: [new Translation({ x: -6 })],
              }),
              new ComplexRectangularPrism({
                lengthX: 4,
                lengthY: 1,
                lengthZ: chipCoverDecorationLengthZ,
                cornerRadius: 0.5,
                transforms: [new Translation({ x: 6 })],
              }),
            ],
            transforms: [
              new Translation({
                z: chipCoverLengthZ - chipCoverDecorationLengthZ,
              }),
            ],
          }),
        ],
      }),
    );
  }
}

class Card extends CompoundModel3D {
  constructor() {
    super(
      new Subtraction({
        models: [
          new ComplexRectangularPrism({
            name: 'Base Rectangle',
            lengthX: cardLengthX,
            lengthY: cardLengthY,
            lengthZ: cardLengthZ,
            cornerRadius: cardCornerRadius,
          }),
          new ComplexRectangularPrism({
            name: 'Chip Hole',
            lengthX: chipHoleLengthX,
            lengthY: chipHoleLengthY,
            lengthZ: chipHoleLengthZ,
            cornerRadius: cardCornerRadius,
            transforms: [
              new Translation({
                x: cardLengthX / 2 - chipLengthX / 2 - edgeToChipThickenss,
                z: baseToChipThickness,
              }),
            ],
          }),
        ],
      }),
    );
  }
}

export default {
  card: new Card(),
  chip: new ChipCover(),
};
