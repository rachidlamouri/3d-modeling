import { ConstantExpression } from '../expressionParser/constantExpression';
import { Equation } from '../expressionParser/equation';
import { VariableEquation, VariableEquationSystem } from '../expressionParser/variableEquation';
import { VariableExpression } from '../expressionParser/variableExpression';

const splitLeftExpressions = (
  equations: Equation[],
  equationSystem: VariableEquationSystem = {},
): VariableEquationSystem => {
  if (equations.length === 0) {
    return equationSystem;
  }

  const nextEquations: Equation[] = [];
  equations.flatMap((equation) => equation.splitLeftExpression())
    .forEach((resultingEquation) => {
      const { leftExpression } = resultingEquation;

      if ((leftExpression instanceof ConstantExpression) && leftExpression.isZero()) {
        return;
      }

      if (leftExpression instanceof VariableExpression) {
        const variableEquation = new VariableEquation(resultingEquation);
        equationSystem[variableEquation.variableName] = variableEquation; // eslint-disable-line no-param-reassign
        return;
      }

      nextEquations.push(resultingEquation);
    });

  return splitLeftExpressions(nextEquations, equationSystem);
};

export const isolateVariables = (equation: VariableEquation): VariableEquationSystem => {
  const firstEquation = equation.splitLeftVariableExpression().swap();
  return splitLeftExpressions([firstEquation]);
};
