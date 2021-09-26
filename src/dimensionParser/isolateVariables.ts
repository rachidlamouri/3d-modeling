import { ConstantExpression } from '../expressionParser/constantExpression';
import { VariableLiterals } from '../expressionParser/statement';
import { Equation } from '../expressionParser/equation';
import { VariableEquation, VariableEquationSystem } from '../expressionParser/variableEquation';
import { VariableExpression } from '../expressionParser/variableExpression';

const splitLeftExpressions = <DimensionNames extends VariableLiterals>(
  equations: Equation<DimensionNames>[],
  equationSystem: VariableEquationSystem<DimensionNames> = {},
): VariableEquationSystem<DimensionNames> => {
  if (equations.length === 0) {
    return equationSystem;
  }

  const nextEquations: Equation<DimensionNames>[] = [];
  equations.flatMap((equation) => equation.splitLeftExpression())
    .forEach((resultingEquation) => {
      const { leftExpression } = resultingEquation;

      if ((leftExpression instanceof ConstantExpression) && leftExpression.isZero()) {
        return;
      }

      if (leftExpression instanceof VariableExpression) {
        const variableEquation = new VariableEquation<DimensionNames>(resultingEquation);
        equationSystem[variableEquation.variableName] = variableEquation; // eslint-disable-line no-param-reassign
        return;
      }

      nextEquations.push(resultingEquation);
    });

  return splitLeftExpressions(nextEquations, equationSystem);
};

export const isolateVariables = <DimensionNames extends VariableLiterals>
  (equation: VariableEquation<DimensionNames>): VariableEquationSystem<DimensionNames> => {
  const firstEquation = equation.splitLeftVariableExpression().swap();
  return splitLeftExpressions([firstEquation]);
};
