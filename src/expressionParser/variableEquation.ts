import { Equation } from './equation';
import { VariableExpression } from './variableExpression';
import { VariablesMap } from './statement';

export class VariableEquation extends Equation {
  leftExpression: VariableExpression;

  constructor(equation: Equation) {
    if (!(equation.leftExpression instanceof VariableExpression)) {
      throw Error('leftExpression must be VariableExpression');
    }

    super(equation);

    this.leftExpression = equation.leftExpression;
  }

  compute(variables: VariablesMap) {
    return this.rightExpression.compute(variables);
  }
}
