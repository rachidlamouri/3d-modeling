/* eslint-disable no-unused-expressions */
// // widget
// const myNames = ['panda', 'banana', 'bacon'] as const;
// type p = typeof myNames;
// type q = p[number];

// type jkl<T extends string> = { [key in T]: boolean };

// const aThing = <T extends readonly string[]>(a: T) => {
//   const b = Object.fromEntries(a.map((name) => [name, false])) as jkl<T[number]>;
//   return b;
// };

// const u = aThing<typeof myNames>(myNames);
// u.panda;
// u.potato;

// type MyNames = typeof myNames[number];

// // utility

// const utlity1 = (names: readonly string[]) => {
//   type nhya = { [key: typeof names[number]]: boolean };

//   const a: nhya = Object.fromEntries(names.map((name) => [name, false]));
//   return a;
// };

// const stuff = utlity1(myNames);
// // eslint-disable-next-line no-unused-expressions
// Object.keys(stuff);

// type IDK<T> = { [key in T]: boolean };

// const utlity2 = <T extends string>(names: readonly T[]) => {
//   const a = Object.fromEntries(names.map((name) => [name, false])) as IDK<T>;
//   return a;
// };

// const stuff2 = utlity2<typeof myNames[number]>(myNames);

// stuff2.potato;
// stuff2.bacon;
// const g = Object.keys(stuff2);

import { parseDimensions, DimensionDefinitions } from './parseDimensions';
import { entries, fromEntries } from './utils';

type Dimensions<DimensionName extends string> = { [Name in DimensionName]: number };
type InputDimensions<DimensionName extends string> = Partial<Dimensions<DimensionName>>;
type WorkingDimensions<DimensionName extends string> =
  { [Name in keyof Dimensions<DimensionName>]: number | null}

const initializeAllDimensions = <DimensionName extends string>(
  dimensionNames: readonly DimensionName[],
  inputDimensions: InputDimensions<DimensionName>,
): WorkingDimensions<DimensionName> => {
  const defaultEntries = dimensionNames.map((name) => [name, null]);
  const defaultDimensions = Object.fromEntries(defaultEntries);

  return {
    ...defaultDimensions,
    ...inputDimensions,
  };
};

type InputDimensionParser<DimensionName extends string> =
  (inputDimensions: InputDimensions<DimensionName>) => Dimensions<DimensionName>;

const hasDimension = <DimensionName extends string>(
  dimensions: WorkingDimensions<DimensionName>,
  dimensionName: DimensionName,
) => (dimensions[dimensionName] !== null);

const hasUnknownDimensions = <DimensionName extends string>(
  dimensions: WorkingDimensions<DimensionName>,
) => Object.values(dimensions).some((value) => value === null);

export const buildParseInputDimensions = <
  DimensionNames extends readonly string[],
  DimensionNamesSubset extends DimensionNames[number],
>(
    dimensionNames: DimensionNames,
    definitions: Pick<DimensionDefinitions<DimensionNames>, DimensionNamesSubset>,
  ): InputDimensionParser<DimensionNames[number]> => {
  type DimensionName = DimensionNames[number];
  const equationSystems = parseDimensions<DimensionNames, DimensionNamesSubset>(dimensionNames, definitions);

  const parseOptions = (inputDimensions: InputDimensions<DimensionName>) => {
    const dimensions = initializeAllDimensions(dimensionNames, inputDimensions);

    while (hasUnknownDimensions(dimensions)) {
      entries(equationSystems)
        .forEach(([dimensionName, equations]) => {
          const hasValue = hasDimension<DimensionName>(dimensions, dimensionName);

          equations.forEach((equation) => {
            const requiredDimensionsNames = equation.rightExpression.getVariableNames();
            const hasRequiredDimensions = requiredDimensionsNames.every((name) => hasDimension(dimensions, name));

            if (!hasValue && hasRequiredDimensions) {
              const variables = fromEntries(
                requiredDimensionsNames.map((name) => [name, dimensions[name] as number]),
              );

              const value = equation.rightExpression.compute(variables);
              dimensions[dimensionName] = value;
            }
          });
        });
    }

    return dimensions as Dimensions<DimensionName>;
  };

  return parseOptions;
};
