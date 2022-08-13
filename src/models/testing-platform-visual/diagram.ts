import { degToRad } from '@jscad/modeling/src/utils';
import _ from 'lodash';
import {
  Cylinder, Translation, Union,
} from '../../modeling';

// parameters
const distanceFromCenter = 5;
const diameter = 4;
const axialLength = 1;
const numberOfLayers = 3;
const distanceBetweenLayers = 20;
const distanceBetweenColumns = 50;
const numberOfColumns = 5;

const angle72 = degToRad(72);
const angle54 = degToRad(54);

const A = {
  x: 0,
  y: -distanceFromCenter,
};
const B = {
  x: distanceFromCenter * Math.sin(angle72),
  y: -distanceFromCenter * Math.cos(angle72),
};
const C = {
  x: distanceFromCenter * Math.cos(angle54),
  y: distanceFromCenter * Math.sin(angle54),
};
const D = {
  x: -C.x,
  y: C.y,
};
const E = {
  x: -B.x,
  y: B.y,
};

const createGroup = (height: number) => new Union({
  models: [A, B, C, D, E].map((vector) => new Cylinder({
    origin: 'bottom',
    axis: 'z',
    diameter,
    axialLength,
    transforms: [
      new Translation(vector),
    ],
  })) as [Cylinder, ...Cylinder[]],
  transforms: [
    new Translation({ z: height }),
  ],
});

const createColumn = (x: number) => new Union({
  models: _.range(numberOfLayers).map((index) => createGroup(index * distanceBetweenLayers)) as [Union, ...Union[]],
  transforms: [
    new Translation({ x }),
  ],
});

export default {
  diagram: new Union({
    models: _.range(numberOfColumns)
      .map((index) => createColumn(index * distanceBetweenColumns)) as [Union, ...Union[]],
  }),
};
