import { Expression, ExpressionParams } from './expression';
import { UnaryExpression, UnaryOperator } from './unaryExpression';
import { ConstantExpression } from './constantExpression';
import { VariableLiterals, VariablesMap } from './statement';

export type BinaryOperator = '*' | '/' | '+' | '-';

type BinaryExpressionParams<VariableNames extends VariableLiterals> = Omit<ExpressionParams, 'input'> & {
  input?: string;
  leftExpression: Expression<VariableNames>;
  operator: BinaryOperator;
  rightExpression: Expression<VariableNames>;
}

const isAdditionOrSubtraction = (operator: BinaryOperator): operator is UnaryOperator => operator === '+' || operator === '-';
const isExpressionNegative = <VariableNames extends VariableLiterals>
  (expression: Expression<VariableNames>): expression is UnaryExpression<VariableNames> => (
    (expression instanceof UnaryExpression) && expression.isNegative()
  );

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
        : `(${leftExpression.input}) ${operator} (${rightExpression.input})`,
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

  simplify(): Expression<VariableNames> {
    const isSubtraction = this.operator === '-';
    const isMultiplication = this.operator === '*';
    const isDivision = this.operator === '/';

    const isLeftZero = (this.leftExpression instanceof ConstantExpression) && this.leftExpression.isZero();
    const isRightZero = (this.rightExpression instanceof ConstantExpression) && this.rightExpression.isZero();

    const isLeftOne = (this.leftExpression instanceof ConstantExpression) && this.leftExpression.isOne();
    const isRightOne = (this.rightExpression instanceof ConstantExpression) && this.rightExpression.isOne();

    if (isAdditionOrSubtraction(this.operator) && isLeftZero) {
      return new UnaryExpression({
        input: this.input,
        operator: this.operator,
        expression: this.rightExpression,
      })
        .simplify();
    }

    if (isAdditionOrSubtraction(this.operator) && isRightZero) {
      return this.leftExpression.simplify();
    }

    if (isSubtraction && isExpressionNegative(this.rightExpression)) {
      return new BinaryExpression({
        input: this.input,
        leftExpression: this.leftExpression,
        operator: '+',
        rightExpression: this.rightExpression.expression,
      })
        .simplify();
    }

    if (
      (isMultiplication || isDivision)
      && isExpressionNegative(this.leftExpression)
      && isExpressionNegative(this.rightExpression)
    ) {
      return new BinaryExpression({
        input: this.input,
        leftExpression: this.leftExpression.invert(),
        operator: this.operator,
        rightExpression: this.rightExpression.invert(),
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isExpressionNegative(this.leftExpression)) {
      return new UnaryExpression({
        input: this.input,
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: this.leftExpression.invert(),
          operator: this.operator,
          rightExpression: this.rightExpression,
        }),
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isExpressionNegative(this.rightExpression)) {
      return new UnaryExpression({
        input: this.input,
        operator: '-',
        expression: new BinaryExpression({
          leftExpression: this.leftExpression,
          operator: this.operator,
          rightExpression: this.rightExpression.invert(),
        }),
      })
        .simplify();
    }

    if ((isMultiplication || isDivision) && isRightOne) {
      return this.leftExpression.simplify();
    }

    if (isMultiplication && isLeftOne) {
      return this.rightExpression.simplify();
    }

    return new BinaryExpression({
      input: this.input,
      leftExpression: this.leftExpression.simplify(),
      operator: this.operator,
      rightExpression: this.rightExpression.simplify(),
    });
  }

  toString() {
    return `(${this.leftExpression.toString()} ${this.operator} ${this.rightExpression.toString()})`;
  }
}
