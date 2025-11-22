import { CompoundModel3D } from './compoundModel3D';
import { Cylinder } from './cylinder';
import { RectangularPrism } from './rectangularPrism';
import { Rotation } from './rotation';
import { Subtraction } from './subtraction';
import { Transform3D } from './transform3D';
import { Translation } from './translation';
import { Union } from './union';

type CornerParams = {
  radius: number;
  lengthZ: number;
  transforms : Transform3D[],
}

class Corner extends CompoundModel3D {
  constructor({ radius, lengthZ, transforms }: CornerParams) {
    const lengthXY = 2 * radius;

    super(
      new Subtraction({
        models: [
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: lengthXY,
            lengthY: lengthXY,
            lengthZ,
          }),
          new Cylinder({
            origin: 'bottom',
            axis: 'z',
            axialLength: lengthZ,
            radius,
          }),
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: lengthXY,
            lengthY: lengthXY / 2,
            lengthZ,
            transforms: [
              new Translation({ y: -lengthXY / 4 }),
            ],
          }),
          new RectangularPrism({
            origin: ['center', 'center', 'bottom'],
            lengthX: lengthXY / 2,
            lengthY: lengthXY,
            lengthZ,
            transforms: [
              new Translation({ x: -lengthXY / 4 }),
            ],
          }),
        ],
        transforms: [
          new Translation({
            x: -lengthXY / 4,
            y: -lengthXY / 4,
          }),
          ...transforms,
        ],
      }),
    );
  }
}

export type RectangularPrismCornersParams = {
  name?: string,
  lengthX: number,
  lengthY: number,
  lengthZ: number,
  cornerRadius: number,
}

export class RectangularPrismCorners extends CompoundModel3D {
  constructor({
    name, lengthX, lengthY, lengthZ, cornerRadius,
  }: RectangularPrismCornersParams) {
    const translationX = lengthX / 2 - cornerRadius / 2;
    const translationY = lengthY / 2 - cornerRadius / 2;

    super(
      new Union({
        name,
        models: [
          new Corner({
            radius: cornerRadius,
            lengthZ,
            transforms: [
              new Translation({
                x: translationX,
                y: translationY,
              })],
          }),
          new Corner({
            radius: cornerRadius,
            lengthZ,
            transforms: [
              new Rotation({ z: 90 }, 'origin'),
              new Translation({
                x: -translationX,
                y: translationY,
              }),
            ],
          }),
          new Corner({
            radius: cornerRadius,
            lengthZ,
            transforms: [
              new Rotation({ z: 180 }, 'origin'),
              new Translation({
                x: -translationX,
                y: -translationY,
              }),
            ],
          }),
          new Corner({
            radius: cornerRadius,
            lengthZ,
            transforms: [
              new Rotation({ z: 270 }, 'origin'),
              new Translation({
                x: translationX,
                y: -translationY,
              }),
            ],
          }),
        ],
      }),
    );
  }
}
