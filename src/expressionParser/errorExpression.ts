import { Expression, ExpressionParams } from './expression';

type NullableExpression = Expression | null;
type ErrorExpressionParams = ExpressionParams & {
  expression: NullableExpression;
}

export class ErrorExpression extends Expression {
  expression: NullableExpression;

  constructor(params: ErrorExpressionParams) {
    super(params);

    this.expression = params.expression;
  }

  compute(): number {
    throw Error(`Cannot compute ErrorExpression: "${this.input}"`);
  }

  // eslint-disable-next-line class-methods-use-this
  getVariableNames() {
    return [];
  }

  serialize() {
    const serializedExpression = this.expression === null ? this.input : this.expression.serialize();
    return `(ErrorExpression: "${serializedExpression}")`;
  }

  simplify() {
    if (this.expression === null) {
      return this;
    }

    return new ErrorExpression({
      input: this.input,
      expression: this.expression.simplify(),
    });
  }
}
