import {
  Model3D,
  RectangularPrism,
  Translation,
  Union,
} from '../../modeling';

type Pick = <T>(leftValue: T, rightValue: T) => T;
const symmetrical = (fn: (pick: Pick) => Model3D) => [0, 1].map((index) => {
  const pick = <T>(leftValue: T, rightValue: T) => (index === 0 ? leftValue : rightValue);
  return fn(pick);
});

const headLengthXZ = 4;
const headLengthY = 6;

const earLengthXY = 1;
const earLengthZ = 2;

const eyeLengthXYZ = 0.5;

const bodyLengthX = 8;
const bodyLengthY = 14;
const bodyLengthZ = 8;

const tailLengthX = 2;
const tailLengthY = 10;
const tailLengthZ = 1;

export default {
  example: new Union({
    name: 'Rat',
    models: [
      new Union({
        name: 'Head Assembly',
        models: [
          new RectangularPrism({
            name: 'Head',
            origin: ['center', 'back', 'bottom'],
            lengthX: headLengthXZ,
            lengthY: headLengthY,
            lengthZ: headLengthXZ,
          }),
          ...symmetrical((pick) => (
            new RectangularPrism({
              name: 'Ear',
              origin: ['center', 'back', 'bottom'],
              lengthX: earLengthXY,
              lengthY: earLengthXY,
              lengthZ: earLengthZ,
              transforms: [
                new Translation({
                  x: pick(-1, 1) * (headLengthXZ / 2 - earLengthXY / 2),
                  z: headLengthXZ,
                }),
              ],
            })
          )),
          ...symmetrical((pick) => (
            new RectangularPrism({
              name: 'Eyes',
              origin: ['center', 'back', 'bottom'],
              lengthX: eyeLengthXYZ,
              lengthY: eyeLengthXYZ,
              lengthZ: eyeLengthXYZ,
              transforms: [
                new Translation({
                  x: pick(-1, 1) * (headLengthXZ / 2),
                  y: headLengthY / 3,
                  z: (2 / 3) * headLengthXZ,
                }),
              ],
            })
          )),
        ],
        transforms: [
          new Translation({
            y: bodyLengthY / 2,
            z: headLengthXZ,
          }),
        ],
      }),
      new RectangularPrism({
        name: 'Body',
        origin: ['center', 'center', 'bottom'],
        lengthX: bodyLengthX,
        lengthY: bodyLengthY,
        lengthZ: bodyLengthZ,
      }),
      new RectangularPrism({
        name: 'Tail',
        origin: ['center', 'front', 'bottom'],
        lengthX: tailLengthX,
        lengthY: tailLengthY,
        lengthZ: tailLengthZ,
        transforms: [
          new Translation({ y: -bodyLengthY / 2 }),
        ],
      }),
    ],
  }),
};
