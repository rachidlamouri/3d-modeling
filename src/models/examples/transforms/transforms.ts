import {
  RectangularPrism,
  Rotation,
  Translation,
} from '../../../modeling';

export default {
  translate: new RectangularPrism({
    origin: ['left', 'back', 'bottom'],
    lengthX: 10.2,
    lengthY: 10,
    lengthZ: 8,
    transforms: [
      new Translation({ x: 1, y: 2, z: 3 }),
    ],
  }),
  selfRotate: new RectangularPrism({
    origin: ['center', 'center', 'bottom'],
    lengthX: 10,
    lengthY: 10,
    lengthZ: 4,
    transforms: [
      new Translation({ x: 20 }),
      new Rotation({ z: 45 }, 'self'),
    ],
  }),
  originRotate: new RectangularPrism({
    origin: ['center', 'center', 'center'],
    lengthX: 10,
    lengthY: 10,
    lengthZ: 4,
    transforms: [
      new Translation({ z: 30 }),
      new Rotation({ y: 45 }, 'origin'),
    ],
  }),
  multipleTransforms: new RectangularPrism({
    origin: ['center', 'center', 'center'],
    lengthX: 12,
    lengthY: 10,
    lengthZ: 4,
    transforms: [
      new Translation({ y: 30 }),
      new Rotation({ z: -90 }, 'origin'),
      new Translation({ x: 30 }),
      new Rotation({ x: 90 }, 'self'),
    ],
  }),
};
