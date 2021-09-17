import _ from 'lodash';

type WidgetOptions = {
  lengthX: number
  lengthY: number
  lengthXY: number
  lengthZ: number
  squareLengthX: number
  squareLengthY: number
  squareLengthXY: number
  circleRadius: number
  circleDiameter: number
  leftXMargin: number
  rightXMargin: number
  centerXMargin: number
  frontYMargin: number
  backYMargin: number
}

const definitions = {
  lengthX: [
    'leftXMargin + squareLengthX + centerMargin + circleDiameter + rightXMargin',
    ['hasLengthXY', 'lengthXY'],
  ],
  holeLengthY:
    'squareLengthY MAX circleDiameter',
  lengthY: [
    'frontYMargin + holeLengthY + bottomYMargin',
    ['hasLengthXY', 'lengthXY'],
  ],
  squareLengthX: [
    ['hasSquareLengthXY', 'squareLengthXY'],
  ],
  squareLengthY: [
    ['hasSquareLengthXY', 'squareLengthXY'],
  ],
  circleDiameter:
    '2 * circleRadius',
  holeDistance: [
    'squareLengthX / 2 + centerXMarin + circleRadius',
  ],
};

const parseOptions = <Options extends Record<string, number>>(options: Options) => {
  type OptionFlags = { [Property in keyof Options as `has${Capitalize<string & Property>}`]: boolean };

  const allOptions = {
    ...options,
    ...(
      _(options)
        .mapKeys((value, key) => `has${_.startCase(key)}`)
        .mapValues((value) => value !== null)
        .value()
    ) as OptionFlags,
  };

  // TODO: parse definitions with equation engine
  // TODO: loop through definitions

  return allOptions;
};

const bacon: WidgetOptions = {
  lengthX: 2,
  lengthY: 2,
  lengthXY: 2,
  lengthZ: 2,
  squareLengthX: 2,
  squareLengthY: 2,
  squareLengthXY: 2,
  circleRadius: 2,
  circleDiameter: 2,
  leftXMargin: 2,
  rightXMargin: 2,
  centerXMargin: 2,
  frontYMargin: 2,
  backYMargin: 2,
};

const stuff = parseOptions(bacon);

// class Widget {
//   constructor(options: WidgetOptions) {
//     const {
//       lengthX,
//       lengthY,
//       lengthZ,
//       leftXMargin,
//       centerMargin,
//       rightXMargin,
//       squareLengthX,
//       squareLengthY,
//       circleDiameter,
//     } = parseOptions(options);
//   }
// }
