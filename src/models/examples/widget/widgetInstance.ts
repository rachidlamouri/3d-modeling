import { Widget } from './widget';

export default {
  exampleA: new Widget({
    // margins should be computed
    lengthX: 10,
    lengthY: 12,
    lengthZ: 2,
    circleDiameter: 5,
  }),
  exampleB: new Widget({
    // circle should be computed
    lengthX: 10,
    xMargin: 1,
    lengthY: 12,
    lengthZ: 2,
  }),
  exampleC: new Widget({
    // circle should be computed
    lengthX: 10,
    yMargin: 2,
    lengthY: 20,
    lengthZ: 5,
  }),
};
