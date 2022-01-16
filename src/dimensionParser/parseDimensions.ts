import _ from 'lodash';
import { Equation } from '../expressionParser/equation';
import { DimensionScript, parseExpression } from '../expressionParser/parseExpression';
import { VariableEquation, VariableEquationSystems } from '../expressionParser/variableEquation';
import { VariableExpression } from '../expressionParser/variableExpression';
import { VariableLiterals } from '../expressionParser/statement';
import { isolateVariables } from './isolateVariables';
import { entries } from './utils';
import { AggregateError } from '../utils/error';

type DimensionDefinition = DimensionScript;

export type DimensionDefinitions<DimensionNames extends VariableLiterals> = {
  [Name in DimensionNames[number]]: DimensionDefinition;
};

export type PartialDimensionDefinitions<DimensionNames extends VariableLiterals>
  = Partial<DimensionDefinitions<DimensionNames>>;

export const parsePartialDimensions = <DimensionNames extends VariableLiterals>(
  dimensionNames: DimensionNames,
  definitions: PartialDimensionDefinitions<DimensionNames>,
): Partial<VariableEquationSystems<DimensionNames>> => (
    _(entries<DimensionNames[number], DimensionDefinition>(definitions))
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
      .tap((equations) => {
        const errors: Error[] = [];
        equations.forEach((equation) => {
          if (equation.hasDuplicateVariables()) {
            const duplicateVariableNames = equation.getDuplicateVariableNames().join(', ');
            errors.push(new Error(`Definition \`${equation.toInputString()}\` has duplicate variable(s) "${duplicateVariableNames}"`));
          }

          if (equation.hasErrorExpression()) {
            errors.push(Error(`Definition \`${equation.toInputString()}\` has a parse error \`${equation.toString()}\``));
          }
        });

        if (errors.length > 0) {
          throw new AggregateError(errors);
        }
      })
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
        {} as Partial<VariableEquationSystems<DimensionNames>>,
      )
  );

export const parseDimensions = <DimensionNames extends VariableLiterals>(
  dimensionNames: DimensionNames,
  definitions: DimensionDefinitions<DimensionNames>,
): VariableEquationSystems<DimensionNames> => (
    parsePartialDimensions(dimensionNames, definitions) as VariableEquationSystems<DimensionNames>
  );
