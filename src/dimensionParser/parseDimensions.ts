import { Equation } from '../expressionParser/equation';
import { parseExpression } from '../expressionParser/parseExpression';
import { VariableEquation } from '../expressionParser/variableEquation';
import { VariableExpression, VariableLiteral } from '../expressionParser/variableExpression';
import { isolateVariables } from './isolateVariables';

type DimensionScript = string;

type DimensionDefinition = DimensionScript;

type DimensionDefinitions = {
  [dimensionName: string]: DimensionDefinition;
};

export const parseDimensions = (definitions: DimensionDefinitions) => (
  Object.entries(definitions)
    .map(([variableName, dimensionScript]) => ({
      variableName,
      expression: parseExpression(dimensionScript),
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
    .map((variableEquation) => isolateVariables(variableEquation))
    .reduce(
      (equationSets: Record<VariableLiteral, VariableEquation[]>, equationSystem) => {
        Object.entries(equationSystem)
          .forEach(([variableName, variableEquation]) => {
            if (!(variableName in equationSets)) {
              equationSets[variableName] = []; // eslint-disable-line no-param-reassign
            }

            equationSets[variableName].push(variableEquation);
          });

        return equationSets;
      },
      {},
    )
);
