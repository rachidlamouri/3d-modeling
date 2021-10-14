import { Expression, ExpressionParams } from './expression';

export type ConstantLiteral = string;

type ConstantExpressionParams = ExpressionParams & {
  constantLiteral: ConstantLiteral;
  value: number;
}

export class ConstantExpression extends Expression<never> {
  constantLiteral: ConstantLiteral;
  value: number;

  constructor(params: ConstantExpressionParams) {
    const { constantLiteral, value } = params;
    super(params);

    this.constantLiteral = constantLiteral;
    this.value = value;
  }

  compute() {
    return this.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getVariableNames() {
    return [];
  }

  isZero() {
    return this.value === 0;
  }

  isOne() {
    return this.value === 1;
  }

  simplify() {
    return this;
  }

  toString() {
    return `${this.constantLiteral}`;
  }
}
