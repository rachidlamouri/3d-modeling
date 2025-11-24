import {
  Subtraction,
  CompoundModel3D,
  Cylinder,
  Translation,
  Union,
} from '../../modeling';
import { ComplexRectangularPrism } from '../../modeling/complexRectangularPrism';
import { Text3D } from '../../modeling/text3D';

const layerHeight = 0.3;

// standard card length x and y
const cardLengthX = 85.6;
const cardLengthY = 53.98;

const chipLengthX = 21;
const chipLengthY = 11;
const chipLengthZ = 0.2;
const chipToleranceXY = 1;

const baseToChipThickness = 2 * layerHeight;
const edgeToChipThickenss = 4;

const chipCoverLengthX = chipLengthX + chipToleranceXY;
const chipCoverLengthY = chipLengthY + chipToleranceXY;
const chipCoverLengthZ = 2;
const chipCoverToleranceXY = 1;
const chipCoverToleranceZ = 2 * layerHeight;
const chipCoverDecorationLengthZ = 2 * layerHeight;

const chipHoleLengthX = chipCoverLengthX + chipCoverToleranceXY;
const chipHoleLengthY = chipCoverLengthY + chipCoverToleranceXY;
const chipHoleLengthZ = chipLengthZ + chipCoverLengthZ + chipCoverToleranceZ;

const rawCardLengthZ = baseToChipThickness + chipHoleLengthZ;
const cardLengthZ = Math.ceil(rawCardLengthZ / layerHeight) * layerHeight;

// standard card corner radius
const cardCornerRadius = 3.18;

const letteringHeight = 2 * layerHeight;

class ChipCover extends CompoundModel3D {
  constructor() {
    super(new Subtraction({
      models: [
        new ComplexRectangularPrism({
          name: 'Chip Base',
          lengthX: chipCoverLengthX,
          lengthY: chipCoverLengthY,
          lengthZ: chipCoverLengthZ,
          cornerRadius: cardCornerRadius,
        }),
        new Union({
          name: 'Chip Cover Decoration',
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
            new Translation({ z: chipCoverLengthZ - chipCoverDecorationLengthZ }),
          ],
        }),
      ],
    }));
  }
}

type CardParams = {
  name: string,
  date: string,
  brand: string,
}

class Card extends CompoundModel3D {
  constructor({ name, date, brand }: CardParams) {
    super(
      new Subtraction({
        models: [
          new Union({
            name: 'Base Card with Lettering',
            models: [
              new ComplexRectangularPrism({
                name: 'Base Rectangle',
                lengthX: cardLengthX,
                lengthY: cardLengthY,
                lengthZ: cardLengthZ,
                cornerRadius: cardCornerRadius,
              }),
              new Text3D({
                lengthZ: letteringHeight,
                strokeWidth: 0.4,
                text: name,
                fontSize: 3,
                transforms: [
                  new Translation({ z: cardLengthZ }),
                ],
              }),
              new Text3D({
                lengthZ: letteringHeight,
                strokeWidth: 0.4,
                text: date,
                letterSpacing: 1,
                fontSize: 2,
                transforms: [
                  new Translation({ y: -10, z: cardLengthZ }),
                ],
              }),
              new Text3D({
                lengthZ: letteringHeight,
                strokeWidth: 0.4,
                text: brand,
                letterSpacing: 1,
                fontSize: 2,
                transforms: [
                  new Translation({ y: 10, z: cardLengthZ }),
                ],
              }),
             new ComplexRectangularPrism({
            name: 'Chip Hole',
            lengthX: chipHoleLengthX,
            lengthY: chipHoleLengthY,
            lengthZ: 50,
            cornerRadius: cardCornerRadius,
            transforms: [
              new Translation({ x: cardLengthX / 2 - chipLengthX / 2 - edgeToChipThickenss, z: baseToChipThickness }),
            ],
          }),],
          }),


          new Cylinder({
            name: 'TEMP',
            origin: 'bottom',
            axis: 'z',
            diameter: 2,
            axialLength: 20,
          }),
        ],
      }),
    );
  }
}

export default {
  card: new Card({

  }),
  chip: new ChipCover(),
};
