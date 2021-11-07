import {
  Cylinder,
  RectangularPrism,
  Subtraction,
  Translation,
  Union,
} from '../../../modeling';

export default {
  union: new Union({
    models: [
      new Cylinder({
        origin: 'bottom',
        diameter: 10,
        lengthZ: 4,
        transforms: [
          new Translation({ x: 2 }),
        ],
      }),
      new Cylinder({
        origin: 'bottom',
        diameter: 10,
        lengthZ: 4,
        transforms: [
          new Translation({ x: -2 }),
        ],
      }),
    ],
  }),
  subtraction: new Subtraction({
    models: [
      new RectangularPrism({
        origin: ['center', 'center', 'bottom'],
        lengthX: 20,
        lengthY: 20,
        lengthZ: 2,
      }),
      new Cylinder({
        origin: 'bottom',
        diameter: 10,
        lengthZ: 2,
      }),
    ],
  }),
};
