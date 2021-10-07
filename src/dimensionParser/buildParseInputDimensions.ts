import { VariableLiterals, VariableLiteral } from '../expressionParser/statement';
import { parseDimensions, DimensionDefinitions } from './parseDimensions';
import { entries, fromEntries } from './utils';

type Dimensions<DimensionName extends VariableLiteral> = { [Name in DimensionName]: number };

export type InputDimensions<DimensionNames extends VariableLiterals> = Partial<Dimensions<DimensionNames[number]>>;

type WorkingDimensions<DimensionName extends VariableLiteral> =
  { [Name in keyof Dimensions<DimensionName>]: number | null}

type InputDimensionParser<DimensionNames extends VariableLiterals> =
  (inputDimensions: InputDimensions<DimensionNames>) => Dimensions<DimensionNames[number]>;

const initializeAllDimensions = <DimensionNames extends VariableLiterals>(
  dimensionNames: DimensionNames,
  inputDimensions: InputDimensions<DimensionNames>,
): WorkingDimensions<DimensionNames[number]> => {
  const defaultEntries = dimensionNames.map((name) => [name, null]);
  const defaultDimensions = Object.fromEntries(defaultEntries);

  return {
    ...defaultDimensions,
    ...inputDimensions,
  };
};

const hasUnknownDimensions = <DimensionName extends VariableLiteral>(
  dimensions: WorkingDimensions<DimensionName>,
) => Object.values(dimensions).some((value) => value === null);

const hasDimension = <DimensionName extends VariableLiteral>(
  dimensions: WorkingDimensions<DimensionName>,
  dimensionName: DimensionName,
) => (dimensions[dimensionName] !== null);

export const buildParseInputDimensions = <
  DimensionNames extends VariableLiterals,
  DimensionNamesSubset extends DimensionNames[number],
>(
    dimensionNames: DimensionNames,
    definitions: Pick<DimensionDefinitions<DimensionNames>, DimensionNamesSubset>,
  ): InputDimensionParser<DimensionNames> => {
  type DimensionName = DimensionNames[number];
  const equationSystems = parseDimensions<DimensionNames, DimensionNamesSubset>(dimensionNames, definitions);

  const parseOptions = (inputDimensions: InputDimensions<DimensionNames>) => {
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
