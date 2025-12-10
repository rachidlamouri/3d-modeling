import {
  Subtraction,
  CompoundModel3D,
  Cylinder,
  Translation,
  Union,
  Rotation,
  RectangularPrism,
  Model3D,
  Transform3D,
} from '../../modeling';
import { ComplexRectangularPrism } from '../../modeling/complexRectangularPrism';
import { Text3D, Text3DDimensions } from '../../modeling/text3D';

const nozzleDiameter = 0.4;
const layerHeight = 0.3;

// standard card length x and y
const cardLengthX = 85.6;
const cardLengthY = 53.98;

const chipLengthX = 21;
const chipLengthY = 11;
const chipLengthZ = 0.2;
const chipToleranceXY = 1;

const baseToChipThickness = 2 * layerHeight;
const edgeToChipThickness = 4;

const chipCoverLengthX = chipLengthX + chipToleranceXY;
const chipCoverLengthY = chipLengthY + chipToleranceXY;
const chipCoverLengthZ = 2;
const chipCoverToleranceXY = 0.1;
const chipCoverToleranceZ = 0.1;
const chipCoverDecorationLengthZ = 2 * layerHeight;

const chipHoleLengthX = chipCoverLengthX + chipCoverToleranceXY;
const chipHoleLengthY = chipCoverLengthY + chipCoverToleranceXY;
const chipHoleLengthZ = chipLengthZ + chipCoverLengthZ + chipCoverToleranceZ;

const rawCardLengthZ = baseToChipThickness + chipHoleLengthZ;
const cardLengthZ = Math.ceil(rawCardLengthZ / layerHeight) * layerHeight;

// standard card corner radius
const cardCornerRadius = 3.18;

const letteringStrokeWidth = 1.5 * nozzleDiameter;
const letteringHeight = 2 * layerHeight;
const edgeToLetteringThickness = 4;

class ChipCover extends CompoundModel3D {
  constructor() {
    const arrowDimensions = new Text3DDimensions({
      // caret renders as an upwards arrow for some reason
      text: '^',
      fontSize: 28,
      strokeWidth: 2,
      lengthZ: chipCoverDecorationLengthZ,
      letterSpacing: 0,
    });

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
            name: 'Chip Cover Decoration',
            models: [
              new Text3D({
                name: 'Arrow',
                precomputedDimensions: arrowDimensions,
                transforms: [
                  new Translation({
                    x: -arrowDimensions.lengthX / 2,
                    y: -arrowDimensions.lengthY / 2,
                    z: chipCoverLengthZ - chipCoverDecorationLengthZ,
                  }),
                  new Rotation({ z: -90 }, 'origin'),
                ],
              }),
              // new Cylinder({
              //   name: 'Center Punch',
              //   axis: 'z',
              //   axialLength: chipCoverDecorationLengthZ,
              //   origin: 'bottom',
              //   radius: 2,
              // }),
              // new ComplexRectangularPrism({
              //   lengthX: 4,
              //   lengthY: 1,
              //   lengthZ: chipCoverDecorationLengthZ,
              //   cornerRadius: 0.5,
              //   transforms: [new Translation({ x: -6 })],
              // }),
              // new ComplexRectangularPrism({
              //   lengthX: 4,
              //   lengthY: 1,
              //   lengthZ: chipCoverDecorationLengthZ,
              //   cornerRadius: 0.5,
              //   transforms: [new Translation({ x: 6 })],
              // }),
            ],
            transforms: [
              new Translation({
                // z: chipCoverLengthZ - chipCoverDecorationLengthZ,
              }),
            ],
          }),
        ],
      }),
    );
  }
}

type CardParams = {
  name: string;
  date: string;
  brand: string;
};

class Card extends CompoundModel3D {
  constructor({ name, date, brand }: CardParams) {
    const letterSpacing = -0.1;
    const debugText = false;

    const nameDimensions = new Text3DDimensions({
      text: name,
      fontSize: 6,
      strokeWidth: letteringStrokeWidth,
      lengthZ: letteringHeight,
      letterSpacing,
    });
    const nameOffsetX =
      cardLengthX / 2 - nameDimensions.lengthX - edgeToLetteringThickness;
    const nameOffsetY = -(cardLengthY / 2 - edgeToLetteringThickness);

    const dateDimensions = new Text3DDimensions({
      text: date,
      fontSize: 5,
      strokeWidth: letteringStrokeWidth,
      lengthZ: letteringHeight,
      letterSpacing: 0,
    });
    const dateOffsetX = nameOffsetX - dateDimensions.lengthX - 8;
    const dateOffsetY = nameOffsetY;

    const brandDimensions = new Text3DDimensions({
      text: brand,
      fontSize: 5,
      strokeWidth: letteringStrokeWidth,
      lengthZ: letteringHeight,
      letterSpacing,
    });

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
                name: 'Name Text',
                precomputedDimensions: nameDimensions,
                transforms: [
                  new Translation({
                    x: nameOffsetX,
                    y: nameOffsetY,
                    z: cardLengthZ,
                  }),
                ],
                debug: debugText,
              }),
              new Text3D({
                name: 'Date Text',
                precomputedDimensions: dateDimensions,
                transforms: [
                  new Translation({
                    x: dateOffsetX,
                    y: dateOffsetY,
                    z: cardLengthZ,
                  }),
                ],
                debug: debugText,
              }),
              new Text3D({
                name: 'Brand Text',
                precomputedDimensions: brandDimensions,
                transforms: [
                  new Translation({
                    x:
                      cardLengthX / 2 -
                      brandDimensions.lengthX -
                      edgeToLetteringThickness,
                    y:
                      cardLengthY / 2 -
                      brandDimensions.lengthY -
                      edgeToLetteringThickness,
                    z: cardLengthZ,
                  }),
                ],
                debug: debugText,
              }),
            ],
          }),

          new ComplexRectangularPrism({
            name: 'Right Chip Hole',
            lengthX: chipHoleLengthX,
            lengthY: chipHoleLengthY,
            lengthZ: 50,
            cornerRadius: cardCornerRadius,
            transforms: [
              new Translation({
                x: cardLengthX / 2 - chipLengthX / 2 - edgeToChipThickness,
                z: baseToChipThickness,
              }),
            ],
          }),
          new ComplexRectangularPrism({
            name: 'Left Chip Hole',
            lengthX: chipHoleLengthX,
            lengthY: chipHoleLengthY,
            lengthZ: 50,
            cornerRadius: cardCornerRadius,
            transforms: [
              new Translation({
                x: -(cardLengthX / 2 - chipLengthX / 2 - edgeToChipThickness),
                z: baseToChipThickness,
              }),
            ],
          }),

          // new Cylinder({
          //   name: 'TEMP',
          //   origin: 'bottom',
          //   axis: 'z',
          //   diameter: 2,
          //   axialLength: 20,
          // }),
        ],
      }),
    );
  }
}

type HollowRectangularPrismParams = {
  outerLengthX: number;
  outerLengthY: number;
  outerLengthZ: number;
  wallThickness: number;
  baseThickness?: number;
  transforms?: Transform3D[];
};

class HollowRectangularPrism extends Subtraction {
  constructor({
    outerLengthX,
    outerLengthY,
    outerLengthZ,
    wallThickness,
    baseThickness = 2 * layerHeight,
    transforms = [],
  }: HollowRectangularPrismParams) {
    super(
      new Subtraction({
        models: [
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: outerLengthX,
            lengthY: outerLengthY,
            lengthZ: outerLengthZ,
          }),
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: outerLengthX - 2 * wallThickness,
            lengthY: outerLengthY - 2 * wallThickness,
            lengthZ: outerLengthZ - baseThickness,
            transforms: [
              new Translation({
                z: baseThickness,
              }),
            ],
          }),
        ],
        transforms,
      }),
    );
  }
}

class BoxAndLid {
  lid: Model3D;
  box: Model3D;

  constructor() {
    const outerLengthX = cardLengthX + 5;
    const outerLengthY = cardLengthY + 5;
    const outerLengthZ = cardLengthZ + 5;
    const wallThickness = 2 * nozzleDiameter;
    const lidXYTolerance = 0.5;
    const boxZThickness = 2 * layerHeight;
    const lidZThickness = 4 * layerHeight;

    const lidLengthX = outerLengthX + 2 * wallThickness + lidXYTolerance;
    const lidLengthY = outerLengthY + 2 * wallThickness + lidXYTolerance;
    const lidLengthZ = outerLengthZ - boxZThickness + lidZThickness;

    const box = new HollowRectangularPrism({
      outerLengthX,
      outerLengthY,
      outerLengthZ,
      wallThickness,
      baseThickness: boxZThickness,
    });

    const text1 = 'For Anna';
    const text2 = 'With Love';

    const text1Dimensions = new Text3DDimensions({
      text: text1,
      fontSize: 16,
      strokeWidth: 2,
      lengthZ: 20,
      letterSpacing: 0,
    });

    const text2Dimensions = new Text3DDimensions({
      text: text2,
      fontSize: 14,
      strokeWidth: 2,
      lengthZ: 20,
      letterSpacing: 0,
    });

    const lid = new Subtraction({
      models: [
        new HollowRectangularPrism({
          outerLengthX: lidLengthX,
          outerLengthY: lidLengthY,
          outerLengthZ: lidLengthZ,
          wallThickness,
          baseThickness: lidZThickness,
          transforms: [new Rotation({ x: 180 }, 'origin')],
        }),
        new Union({
          models: [
            new Text3D({
              precomputedDimensions: text1Dimensions,
              transforms: [
                new Translation({
                  x: -text1Dimensions.lengthX / 2,
                }),
              ],
            }),
            new Text3D({
              precomputedDimensions: text2Dimensions,
              transforms: [
                new Translation({
                  x: -text2Dimensions.lengthX / 2,
                  y: -text1Dimensions.lengthY,
                }),
              ],
            }),
          ],
          transforms: [
            new Translation({
              z: -lidZThickness / 2,
            }),
          ],
        }),
      ],
      transforms: [new Rotation({ x: 180 }, 'origin')],
    });

    this.box = box;
    this.lid = lid;
  }
}

const card = new Card({
  name: 'Anna Kalton',
  date: '06/26',
  brand: 'Detritus Rx',
});

const boxAndLid = new BoxAndLid();

export default {
  lid: boxAndLid.lid,
  box: boxAndLid.box,
  card,
  chipCover: new ChipCover(),
  lettering: new Subtraction({
    models: [
      card,
      new RectangularPrism({
        origin: ['center', 'center', 'bottom'],
        lengthX: cardLengthX,
        lengthY: cardLengthY,
        lengthZ: 0.9 * cardLengthZ,
      }),
    ],
    transforms: [
      new Translation({
        z: 0.9 * cardLengthZ,
      }),
    ],
  }),
  chipHole: new Subtraction({
    models: [
      card,
      new RectangularPrism({
        origin: ['center', 'center', 'bottom'],
        lengthX: cardLengthX,
        lengthY: cardLengthY,
        lengthZ: 200,
        transforms: [
          new Translation({
            x: edgeToChipThickness + chipHoleLengthX + edgeToChipThickness,
          }),
        ],
      }),
      new RectangularPrism({
        origin: ['center', 'center', 'bottom'],
        lengthX: cardLengthX,
        lengthY: cardLengthY,
        lengthZ: 200,
        transforms: [
          new Translation({
            y: cardLengthY / 2 + chipHoleLengthY / 2 + edgeToChipThickness,
          }),
        ],
      }),
      new RectangularPrism({
        origin: ['center', 'center', 'bottom'],
        lengthX: cardLengthX,
        lengthY: cardLengthY,
        lengthZ: 200,
        transforms: [
          new Translation({
            y: -(cardLengthY / 2 + chipHoleLengthY / 2 + edgeToChipThickness),
          }),
        ],
      }),
    ],
  }),
};
