import _ from 'lodash';
import { isolateVariables } from './dimensionParser/isolateVariables';
import { DimensionDefinitions, parseDimensions } from './dimensionParser/parseDimensions';
import { buildParseInputDimensions } from './dimensionParser/buildParseInputDimensions';
import { VariableEquation } from './expressionParser/variableEquation';

const dimensionNames = [
  'lengthX',
  'lengthY',
  'lengthZ',
  'circleRadius',
  'circleDiameter',
  'xMargin',
  'leftXMargin',
  'rightXMargin',
  'yMargin',
  'backYMargin',
  'frontYMargin',
] as const;

const dimensionDefinitions = {
  leftXMargin: 'xMargin',
  rightXMargin: 'xMargin',
  backYMargin: 'yMargin',
  frontYMargin: 'yMargin',
  lengthX:
    'circleDiameter + 2 * xMargin',
  lengthY:
    'circleDiameter + 2 * yMargin',
  circleDiameter:
    '2 * circleRadius',
};

const parseInputDimensions = buildParseInputDimensions<
  typeof dimensionNames,
  keyof typeof dimensionDefinitions
>(dimensionNames, dimensionDefinitions);

const dims = parseInputDimensions({
  lengthX: 10,
  lengthY: 12,
  lengthZ: 2,
  circleDiameter: 5,
});

console.log('DIMS!', dims);

// eslint-disable-next-line no-unused-expressions

// eslint-disable-next-line no-unused-expressions

// type WidgetOptions = {
//   lengthX: number
//   lengthY: number
//   lengthZ: number
//   circleRadius: number
//   circleDiameter: number
//   xMargin: number
//   leftXMargin: number
//   rightXMargin: number
//   yMargin: number
//   backYMargin: number
//   frontYMargin: number
// }

// const parsedDimensions = parseDimensions(dimensionDefinitions);

// const output = Object.fromEntries(
//   Object.entries(parsedDimensions)
//     .map(([variableName, equations]) => [
//       variableName,
//       equations.map((equation) => equation.simplify().serialize()),
//     ]),
// );

// console.log(JSON.stringify(output, null, 2));

// const parseOptions = <Options extends Record<string, number>>(options: Options) => {
//   type OptionFlags = { [Property in keyof Options as `has${Capitalize<string & Property>}`]: boolean };

//   const allOptions = {
//     ...options,
//     ...(
//       _(options)
//         .mapKeys((value, key) => `has${_.startCase(key)}`)
//         .mapValues((value) => value !== null)
//         .value()
//     ) as OptionFlags,
//   };

//   // TODO: parse definitions with equation engine
//   // TODO: loop through definitions

//   return allOptions;
// };

// const widgetOptions: WidgetOptions = {
//   lengthX: 2,
//   lengthY: 2,
//   lengthXY: 2,
//   lengthZ: 2,
//   circleRadius: 2,
//   circleDiameter: 2,
//   leftXMargin: 2,
//   rightXMargin: 2,
//   frontYMargin: 2,
//   backYMargin: 2,
// };

// const stuff = parseOptions(widgetOptions);

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
