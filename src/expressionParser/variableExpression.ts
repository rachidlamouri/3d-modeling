import { Expression, ExpressionParams } from './expression';
import { VariablesMap, VariableLiterals } from './statement';

type VariableExpressionParams<VariableNames extends VariableLiterals> = Omit<ExpressionParams, 'input'> & {
  input?: string;
  variableLiteral: VariableNames[number];
};

export class VariableExpression<VariableNames extends VariableLiterals> extends Expression<VariableNames> {
  name: VariableNames[number];

  constructor(params: VariableExpressionParams<VariableNames>) {
    const { input, variableLiteral } = params;
    super({
      input: input !== undefined
        ? input
        : variableLiteral,
    });
    this.name = variableLiteral;
  }

  compute(variables: VariablesMap<VariableNames>) {
    return variables[this.name];
  }

  getVariableNames() {
    return [this.name];
  }

  simplify() {
    return this;
  }

  toString() {
    return `${this.name}`;
  }
}
