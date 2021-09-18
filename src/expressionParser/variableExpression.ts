import { Expression, ExpressionParams, VariablesMap } from './expression';

export type VariableLiteral = string;

type VariableExpressionParams = ExpressionParams & {
  variableLiteral: VariableLiteral;
};

export class VariableExpression extends Expression {
  name: VariableLiteral;

  constructor(params: VariableExpressionParams) {
    const { variableLiteral } = params;
    super(params);
    this.name = variableLiteral;
  }

  compute(variables: VariablesMap) {
    return variables[this.name];
  }

  getVariableNames() {
    return [this.name];
  }

  serialize() {
    return `${this.name}`;
  }

  simplify() {
    return this;
  }
}
