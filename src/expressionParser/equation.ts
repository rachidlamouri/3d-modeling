import { Statement, VariablesMap } from './statement';
import { Expression } from './expression';
import { BinaryExpression } from './binaryExpression';
import { ConstantExpression } from './constantExpression';
import { parseExpression } from './parseExpression';
import { UnaryExpression } from './unaryExpression';
import { VariableExpression } from './variableExpression';

type EquationParams = {
  leftExpression: Expression;
  rightExpression: Expression;
}

export class Equation implements Statement {
  leftExpression: Expression;
  rightExpression: Expression;

  constructor({ leftExpression, rightExpression }: EquationParams) {
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  compute(variables: VariablesMap): number {
    throw Error('Not implemented. Did you mean to convert to a VariableEquation first?');
  }

  getVariableNames() {
    return [
      ...this.leftExpression.getVariableNames(),
      ...this.rightExpression.getVariableNames(),
    ];
  }

  serialize() {
    return `${this.leftExpression.serialize()} = ${this.rightExpression.serialize()}`;
  }

  simplify() {
    return new Equation({
      leftExpression: this.leftExpression.simplify(),
      rightExpression: this.rightExpression.simplify(),
    });
  }

  splitLeftExpression() {
    if (this.leftExpression instanceof ConstantExpression || this.leftExpression instanceof VariableExpression) {
      return [new Equation({
        leftExpression: parseExpression('0'),
        rightExpression: new BinaryExpression({
          leftExpression: this.rightExpression,
          operator: '-',
          rightExpression: this.leftExpression,
        }),
      })];
    }

    if (this.leftExpression instanceof UnaryExpression) {
      return [new Equation({
        leftExpression: this.leftExpression.expression,
        rightExpression: new BinaryExpression({
          leftExpression: this.rightExpression,
          operator: '/',
          rightExpression: parseExpression(`${this.leftExpression.getUnit()}`),
        }),
      })];
    }

    if (this.leftExpression instanceof BinaryExpression) {
      const expressionA = this.leftExpression.leftExpression;
      const inverseLeftOperator = this.leftExpression.getInverseOperator();
      const expressionB = this.leftExpression.rightExpression;
      const expressionC = this.rightExpression;

      const equationA = new Equation({
        leftExpression: expressionA,
        rightExpression: new BinaryExpression({
          leftExpression: expressionC,
          operator: inverseLeftOperator,
          rightExpression: expressionB,
        }),
      });

      let equationB;
      if (this.leftExpression.operator === '-') {
        equationB = new Equation({
          leftExpression: new UnaryExpression({
            operator: '-',
            expression: expressionB,
          }),
          rightExpression: new BinaryExpression({
            leftExpression: expressionC,
            operator: '-',
            rightExpression: expressionA,
          }),
        });
      } else if (this.leftExpression.operator === '/') {
        equationB = new Equation({
          leftExpression: expressionB,
          rightExpression: new BinaryExpression({
            leftExpression: expressionA,
            operator: '/',
            rightExpression: expressionC,
          }),
        });
      } else {
        equationB = new Equation({
          leftExpression: expressionB,
          rightExpression: new BinaryExpression({
            leftExpression: expressionC,
            operator: inverseLeftOperator,
            rightExpression: expressionA,
          }),
        });
      }

      return [
        equationA,
        equationB,
      ];
    }

    throw Error(`Unhandled leftExpression "${this.leftExpression.constructor.name}"`);
  }

  swap() {
    return new Equation({
      leftExpression: this.rightExpression,
      rightExpression: this.leftExpression,
    });
  }
}
