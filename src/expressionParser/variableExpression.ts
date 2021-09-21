import { Expression, ExpressionParams } from './expression';
import { VariablesMap } from './statement';

export type VariableLiteral = string;

type VariableExpressionParams = Omit<ExpressionParams, 'input'> & {
  input?: string;
  variableLiteral: VariableLiteral;
};

export class VariableExpression extends Expression {
  name: VariableLiteral;

  constructor(params: VariableExpressionParams) {
    const { input, variableLiteral } = params;
    super({
      input: input !== undefined
        ? input
        : variableLiteral,
    });
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
