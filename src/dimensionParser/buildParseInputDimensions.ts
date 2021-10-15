import { VariableLiterals } from '../expressionParser/statement';
import { parseDimensions, DimensionDefinitions } from './parseDimensions';
import { entries, fromEntries } from './utils';

export type Dimensions<DimensionNames extends VariableLiterals> = { [Name in DimensionNames[number]]: number };

export type InputDimensions<DimensionNames extends VariableLiterals> = Partial<Dimensions<DimensionNames>>;

type WorkingDimensions<DimensionNames extends VariableLiterals> =
  { [Name in keyof Dimensions<DimensionNames>]: number | null}

type InputDimensionParser<DimensionNames extends VariableLiterals> =
  (inputDimensions: InputDimensions<DimensionNames>) => Dimensions<DimensionNames>;

const initializeAllDimensions = <DimensionNames extends VariableLiterals>(
  dimensionNames: DimensionNames,
  inputDimensions: InputDimensions<DimensionNames>,
): WorkingDimensions<DimensionNames> => {
  const defaultEntries = dimensionNames.map((name) => [name, null]);
  const defaultDimensions = Object.fromEntries(defaultEntries);

  return {
    ...defaultDimensions,
    ...inputDimensions,
  };
};

const hasUnknownDimensions = <DimensionNames extends VariableLiterals>(
  dimensions: WorkingDimensions<DimensionNames>,
) => Object.values(dimensions).some((value) => value === null);

const hasDimension = <DimensionNames extends VariableLiterals>(
  dimensions: WorkingDimensions<DimensionNames>,
  dimensionName: DimensionNames[number],
) => (dimensions[dimensionName] !== null);

export const buildParseInputDimensions = <
  DimensionNames extends VariableLiterals,
  DimensionNamesSubset extends DimensionNames[number],
>(
    dimensionNames: DimensionNames,
    definitions: Pick<DimensionDefinitions<DimensionNames>, DimensionNamesSubset>,
  ): InputDimensionParser<DimensionNames> => {
  const equationSystems = parseDimensions<DimensionNames, DimensionNamesSubset>(dimensionNames, definitions);

  const parseOptions = (inputDimensions: InputDimensions<DimensionNames>) => {
    const dimensions = initializeAllDimensions(dimensionNames, inputDimensions);

    while (hasUnknownDimensions(dimensions)) {
      entries(equationSystems)
        .forEach(([dimensionName, equations]) => {
          const hasValue = hasDimension<DimensionNames>(dimensions, dimensionName);

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

    return dimensions as Dimensions<DimensionNames>;
  };

  return parseOptions;
};
