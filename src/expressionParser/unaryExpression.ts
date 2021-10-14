import { Expression, ExpressionParams } from './expression';
import { VariableLiterals, VariablesMap } from './statement';

export type UnaryOperator = '+' | '-';

type UnaryExpressionParams<VariableNames extends VariableLiterals> = Omit<ExpressionParams, 'input'> & {
  input?: string;
  operator: UnaryOperator;
  expression: Expression<VariableNames>;
}

export class UnaryExpression<VariableNames extends VariableLiterals> extends Expression<VariableNames> {
  operator: UnaryOperator;
  expression: Expression<VariableNames>;

  constructor(params: UnaryExpressionParams<VariableNames>) {
    const { input, operator, expression } = params;

    super({
      input: input !== undefined
        ? input
        : `${operator}(${expression.input})`,
    });
    this.operator = operator;
    this.expression = expression;
  }

  compute(variables: VariablesMap<VariableNames>) {
    return this.getUnit() * this.expression.compute(variables);
  }

  getUnit() {
    return this.operator === '+' ? 1 : -1;
  }

  getVariableNames() {
    return this.expression.getVariableNames();
  }

  invert() {
    const operator = this.operator === '+' ? '-' : '+';

    return new UnaryExpression({
      operator,
      expression: this.expression,
    });
  }

  isNegative() {
    return this.operator === '-';
  }

  simplify(): Expression<VariableNames> {
    if (this.operator === '+') {
      return this.expression.simplify();
    }

    if (this.isNegative() && (this.expression instanceof UnaryExpression) && this.expression.isNegative()) {
      return this.expression.expression.simplify();
    }

    return new UnaryExpression({
      input: this.input,
      operator: this.operator,
      expression: this.expression.simplify(),
    });
  }

  toString() {
    return `(${this.operator}${this.expression.toString()})`;
  }
}
