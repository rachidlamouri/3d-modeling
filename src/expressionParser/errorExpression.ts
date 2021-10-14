import { Expression, ExpressionParams } from './expression';
import { VariableLiterals } from './statement';
import { VariableExpression } from './variableExpression';

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
    throw Error(`Cannot compute ${this.constructor.name}: "${this.input}"`);
  }

  // eslint-disable-next-line class-methods-use-this
  getVariableNames() {
    return [];
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

  toString() {
    const toStringdExpression = this.expression === null ? this.input : this.expression.toString();
    return `[${this.constructor.name}: "${toStringdExpression}"]`;
  }
}

type ErrorVariableExpressionParams<VariableNames extends VariableLiterals> = ExpressionParams & {
  expression: VariableExpression<VariableNames>;
}

export class ErrorVariableExpression<VariableNames extends VariableLiterals> extends ErrorExpression<VariableNames> {
  // eslint-disable-next-line no-useless-constructor
  constructor(params: ErrorVariableExpressionParams<VariableNames>) {
    super(params);
  }
}
