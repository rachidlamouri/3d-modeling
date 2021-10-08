import { Expression, ExpressionParams } from './expression';
import { VariableLiterals } from './statement';

type NullableExpression<VariableNames extends VariableLiterals> = Expression<VariableNames> | null;
type ErrorExpressionParams<VariableNames extends VariableLiterals> = ExpressionParams & {
  expression: NullableExpression<VariableNames>;
}

export class ErrorExpression<VariableNames extends VariableLiterals> extends Expression<VariableNames> {
  expression: NullableExpression<VariableNames>;

  constructor(params: ErrorExpressionParams<VariableNames>) {
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

  toString() {
    const toStringdExpression = this.expression === null ? this.input : this.expression.toString();
    return `(ErrorExpression: "${toStringdExpression}")`;
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
