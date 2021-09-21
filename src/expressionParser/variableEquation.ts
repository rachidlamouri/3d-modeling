import { Equation } from './equation';
import { VariableExpression, VariableLiteral } from './variableExpression';
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

  splitLeftVariableExpression(): Equation {
    const [equation] = super.splitLeftExpression();
    return equation;
  }

  get variableName() {
    const [variableName] = this.leftExpression.getVariableNames();
    return variableName;
  }
}

export type VariableEquationSystem = Record<VariableLiteral, VariableEquation>;
