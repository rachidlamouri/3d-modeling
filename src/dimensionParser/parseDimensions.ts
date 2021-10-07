import { Equation } from '../expressionParser/equation';
import { DimensionScript, parseExpression } from '../expressionParser/parseExpression';
import { VariableEquation, VariableEquationSystems } from '../expressionParser/variableEquation';
import { VariableExpression } from '../expressionParser/variableExpression';
import { VariableLiterals } from '../expressionParser/statement';
import { isolateVariables } from './isolateVariables';
import { entries } from './utils';

type DimensionDefinition = DimensionScript;

export type DimensionDefinitions<DimensionNames extends VariableLiterals> = {
  [Name in DimensionNames[number]]: DimensionDefinition;
};

export type PartialDimensionDefinitions<DimensionNames extends VariableLiterals>
  = Partial<DimensionDefinitions<DimensionNames>>;

export const buildDimensionDefinitions = <DimensionNames extends VariableLiterals>
  (
    dimensionNames: readonly DimensionNames[number][],
    partialDefinitions: PartialDimensionDefinitions<DimensionNames>,
  ): DimensionDefinitions<DimensionNames> => {
  const definitionEntries = dimensionNames.map((name) => [name, partialDefinitions[name] ?? name]);
  return Object.fromEntries(definitionEntries);
};

export const parseDimensions = <
  DimensionNames extends VariableLiterals,
  DimensionNamesSubset extends DimensionNames[number],
>(
    dimensionNames: DimensionNames,
    definitions: Pick<DimensionDefinitions<DimensionNames>, DimensionNamesSubset>,
  ) => (
    entries<DimensionNamesSubset, DimensionDefinition>(definitions)
      .map(([variableName, dimensionScript]) => ({
        variableName,
        expression: parseExpression(dimensionScript, dimensionNames),
      }))
      .map(({ variableName, expression }) => (
        new Equation({
          leftExpression: new VariableExpression({
            variableLiteral: variableName,
          }),
          rightExpression: expression,
        })
      ))
      .map((equation) => new VariableEquation(equation))
      .map((variableEquation) => isolateVariables<DimensionNames>(variableEquation))
      .reduce(
        (variableEquationSystems, variableEquationSystem) => {
          entries<DimensionNames[number], VariableEquation<DimensionNames>>(variableEquationSystem)
            .forEach(([variableName, variableEquation]) => {
              const equations = variableEquationSystems[variableName] ?? [] as VariableEquation<DimensionNames>[];
              equations.push(variableEquation);
              variableEquationSystems[variableName] = equations; // eslint-disable-line no-param-reassign
            });

          return variableEquationSystems;
        },
        {} as VariableEquationSystems<DimensionNames>,
      )
  );
