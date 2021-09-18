import { Expression } from './expression.js';
import { UnaryExpression } from './unaryExpression.js';
import { ConstantExpression } from './constantExpression.js';

export class BinaryExpression extends Expression {
  constructor(properties) {
    const { leftExpression, operator, rightExpression } = properties;
    super(properties);
    this.leftExpression = leftExpression;
    this.operator = operator;
    this.rightExpression = rightExpression;
  }

  getVariableNames() {
    return [
      ...this.leftExpression.getVariableNames(),
      ...this.rightExpression.getVariableNames(),
    ];
  }

  simplify() {
    const isAddition = this.operator === '+';
    const isSubtraction = this.operator === '-';
    const isMultiplication = this.operator === '*';
    const isDivision = this.operator === '/';

    const simplifiedLeftExpression = this.leftExpression.simplify();
    const simplifiedRightExpression = this.rightExpression.simplify();

    const isLeftZero = (simplifiedLeftExpression instanceof ConstantExpression) && simplifiedLeftExpression.isZero();
    const isRightZero = (simplifiedRightExpression instanceof ConstantExpression) && simplifiedRightExpression.isZero();

    const isLeftOne = (simplifiedLeftExpression instanceof ConstantExpression) && simplifiedLeftExpression.isOne();
    const isRightOne = (simplifiedRightExpression instanceof ConstantExpression) && simplifiedRightExpression.isOne();

    const isLeftNegative = (simplifiedLeftExpression instanceof UnaryExpression) && simplifiedLeftExpression.isNegative(); // eslint-disable-line max-len
    const isRightNegative = (simplifiedRightExpression instanceof UnaryExpression) && simplifiedRightExpression.isNegative(); // eslint-disable-line max-len

    if ((isAddition || isSubtraction) && isLeftZero) {
      return new UnaryExpression({
        operator: this.operator,
        expression: simplifiedRightExpression,
      })
        .simplify();
    }

    if ((isAddition || isSubtraction) && isRightZero) {
      return simplifiedLeftExpression;
    }

    if (isSubtraction && isRightNegative) {
      return new BinaryExpression({
        leftExpression: simplifiedLeftExpression,
        operator: '+',
        rightExpression: simplifiedRightExpression.expression,
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isLeftNegative && isRightNegative) {
      return new BinaryExpression({
        leftExpression: simplifiedLeftExpression.invert().simplify(),
        operator: this.operator,
        rightExpression: simplifiedRightExpression.invert().simplify(),
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isLeftNegative) {
      return new UnaryExpression({
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: simplifiedLeftExpression.invert().simplify(),
          operator: this.operator,
          rightExpression: simplifiedRightExpression,
        })
          .simplify(),
      });
    }

    if ((isMultiplication || isDivision) && isRightNegative) {
      return new UnaryExpression({
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: simplifiedLeftExpression,
          operator: this.operator,
          rightExpression: simplifiedRightExpression.invert().simplify(),
        })
          .simplify(),
      });
    }

    if ((isMultiplication || isDivision) && isRightOne) {
      return simplifiedLeftExpression;
    }

    if (isMultiplication && isLeftOne) {
      return simplifiedRightExpression;
    }

    return new BinaryExpression({
      leftExpression: simplifiedLeftExpression,
      operator: this.operator,
      rightExpression: simplifiedRightExpression,
    });
  }

  serialize() {
    return `(${this.leftExpression.serialize()} ${this.operator} ${this.rightExpression.serialize()})`;
  }

  compute(variables) {
    const leftValue = this.leftExpression.compute(variables);
    const rightValue = this.rightExpression.compute(variables);

    switch (this.operator) {
      case '+': return leftValue + rightValue;
      case '-': return leftValue - rightValue;
      case '/': return leftValue / rightValue;
      default: return leftValue * rightValue;
    }
  }
}
