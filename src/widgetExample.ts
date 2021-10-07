import * as jscad from '@jscad/modeling';
import { Widget } from './widget';

const {
  transforms: { translate },
  booleans: { union },
} = jscad;

export const main = () => {
  const widgets = [
    new Widget({
      // margins should be computed
      lengthX: 10,
      lengthY: 12,
      lengthZ: 2,
      circleDiameter: 5,
    }).model,
    new Widget({
      // circle should be computed
      lengthX: 10,
      xMargin: 1,
      lengthY: 12,
      lengthZ: 2,
    }).model,
    new Widget({
      // circle should be computed
      lengthX: 10,
      yMargin: 2,
      lengthY: 20,
      lengthZ: 5,
    }).model,
  ];

  return union(...widgets.map((model, index) => translate([20 * index, 0, 0], model)));
};
