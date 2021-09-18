import { Expression, ExpressionParams, VariablesMap } from './expression';

export type UnaryOperator = '+' | '-';

type UnaryExpressionParams = ExpressionParams & {
  operator: UnaryOperator;
  expression: Expression;
}

export class UnaryExpression extends Expression {
  operator: UnaryOperator;
  expression: Expression;

  constructor(params: UnaryExpressionParams) {
    const { operator, expression } = params;

    super(params);
    this.operator = operator;
    this.expression = expression;
  }

  compute(variables: VariablesMap) {
    const value = this.expression.compute(variables);

    return this.operator === '+'
      ? value
      : -value;
  }

  getVariableNames() {
    return this.expression.getVariableNames();
  }

  invert() {
    const operator = this.operator === '+' ? '-' : '+';

    return new UnaryExpression({
      input: `${operator}${this.expression.input}`,
      operator,
      expression: this.expression,
    });
  }

  isNegative() {
    return this.operator === '-';
  }

  serialize() {
    return `(${this.operator}${this.expression.serialize()})`;
  }

  simplify(): Expression {
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
}
