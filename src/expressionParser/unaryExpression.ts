import { Expression, ExpressionParams } from './expression';
import { VariablesMap } from './statement';

export type UnaryOperator = '+' | '-';

type UnaryExpressionParams = Omit<ExpressionParams, 'input'> & {
  input?: string;
  operator: UnaryOperator;
  expression: Expression;
}

export class UnaryExpression extends Expression {
  operator: UnaryOperator;
  expression: Expression;

  constructor(params: UnaryExpressionParams) {
    const { input, operator, expression } = params;

    super({
      input: input !== undefined
        ? input
        : `${operator}(${expression.input})`,
    });
    this.operator = operator;
    this.expression = expression;
  }

  compute(variables: VariablesMap) {
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
      operator: this.operator,
      expression: this.expression.simplify(),
    });
  }
}
