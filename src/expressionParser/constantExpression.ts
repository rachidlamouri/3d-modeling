import { Expression, ExpressionParams } from './expression';

export type ConstantLiteral = string;

type ConstantExpressionParams = ExpressionParams & {
  constantLiteral: ConstantLiteral;
}

export class ConstantExpression extends Expression {
  value: number;

  constructor(params: ConstantExpressionParams) {
    const { constantLiteral } = params;
    super(params);
    this.value = parseFloat(constantLiteral);
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

  serialize() {
    return `${this.value}`;
  }

  compute() {
    return this.value;
  }
}
