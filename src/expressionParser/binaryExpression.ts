import { Expression, ExpressionParams } from './expression';
import { UnaryExpression } from './unaryExpression';
import { ConstantExpression } from './constantExpression';
import { VariableLiterals, VariablesMap } from './statement';

export type BinaryOperator = '*' | '/' | '+' | '-';

type BinaryExpressionParams<VariableNames extends VariableLiterals> = Omit<ExpressionParams, 'input'> & {
  input?: string;
  leftExpression: Expression<VariableNames>;
  operator: BinaryOperator;
  rightExpression: Expression<VariableNames>;
}

export class BinaryExpression<VariableNames extends VariableLiterals> extends Expression<VariableNames> {
  leftExpression: Expression<VariableNames>;
  operator: BinaryOperator;
  rightExpression: Expression<VariableNames>;

  constructor(params: BinaryExpressionParams<VariableNames>) {
    const {
      input,
      leftExpression,
      operator,
      rightExpression,
    } = params;

    super({
      input: input !== undefined
        ? input
        : `(${leftExpression.input}) - (${rightExpression.input})`,
    });
    this.leftExpression = leftExpression;
    this.operator = operator;
    this.rightExpression = rightExpression;
  }

  compute(variables: VariablesMap<VariableNames>) {
    const leftValue = this.leftExpression.compute(variables);
    const rightValue = this.rightExpression.compute(variables);

    switch (this.operator) {
      case '+': return leftValue + rightValue;
      case '-': return leftValue - rightValue;
      case '/': return leftValue / rightValue;
      default: return leftValue * rightValue;
    }
  }

  getInverseOperator(): BinaryOperator {
    return {
      '*': '/',
      '/': '*',
      '+': '-',
      '-': '+',
    }[this.operator] as BinaryOperator;
  }

  getVariableNames() {
    return [
      ...this.leftExpression.getVariableNames(),
      ...this.rightExpression.getVariableNames(),
    ];
  }

  serialize() {
    return `(${this.leftExpression.serialize()} ${this.operator} ${this.rightExpression.serialize()})`;
  }

  simplify(): Expression<VariableNames> {
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

    if ((this.operator === '+' || this.operator === '-') && isLeftZero) {
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
      const invertedSimplifiedLeftExpression = simplifiedLeftExpression.invert().simplify();
      const invertedSimplifiedRightExpression = simplifiedRightExpression.invert().simplify();

      return new BinaryExpression({
        leftExpression: invertedSimplifiedLeftExpression,
        operator: this.operator,
        rightExpression: invertedSimplifiedRightExpression,
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isLeftNegative) {
      const invertedSimplifiedLeftExpression = simplifiedLeftExpression.invert().simplify();
      return new UnaryExpression({
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: invertedSimplifiedLeftExpression,
          operator: this.operator,
          rightExpression: simplifiedRightExpression,
        })
          .simplify(),
      });
    }

    if ((isMultiplication || isDivision) && isRightNegative) {
      const invertedSimplifiedRightExpression = simplifiedRightExpression.invert().simplify();
      return new UnaryExpression({
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: simplifiedLeftExpression,
          operator: this.operator,
          rightExpression: invertedSimplifiedRightExpression,
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
      input: this.input,
      leftExpression: simplifiedLeftExpression,
      operator: this.operator,
      rightExpression: simplifiedRightExpression,
    });
  }
}
