import _ from 'lodash';
import { Statement, VariableLiterals, VariablesMap } from './statement';
import { Expression } from './expression';
import { BinaryExpression } from './binaryExpression';
import { ConstantExpression } from './constantExpression';
import { parseExpression } from './parseExpression';
import { UnaryExpression } from './unaryExpression';
import { VariableExpression } from './variableExpression';
import { ErrorExpression } from './errorExpression';

type EquationParams<VariableNames extends VariableLiterals> = {
  leftExpression: Expression<VariableNames>;
  rightExpression: Expression<VariableNames>;
}

export class Equation<VariableNames extends VariableLiterals> implements Statement<VariableNames> {
  leftExpression: Expression<VariableNames>;
  rightExpression: Expression<VariableNames>;

  constructor({ leftExpression, rightExpression }: EquationParams<VariableNames>) {
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  compute(variables: VariablesMap<VariableNames>): number {
    throw Error('Not implemented. Did you mean to convert to a VariableEquation first?');
  }

  getDuplicateVariableNames() {
    return _(this.getVariableNames())
      .countBy(_.identity)
      .toPairs()
      .filter(([, count]) => count > 1)
      .map(([variableName]) => variableName)
      .value();
  }

  getVariableNames() {
    return [
      ...this.leftExpression.getVariableNames(),
      ...this.rightExpression.getVariableNames(),
    ];
  }

  hasDuplicateVariables() {
    return this.getDuplicateVariableNames().length > 0;
  }

  hasErrorExpression() {
    return (
      this.leftExpression instanceof ErrorExpression
      || this.rightExpression instanceof ErrorExpression
    );
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
        leftExpression: parseExpression('0', []),
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
          rightExpression: parseExpression(`${this.leftExpression.getUnit()}`, []),
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

  toInputString() {
    return `${this.leftExpression.input} = ${this.rightExpression.input}`;
  }

  toString() {
    return `${this.leftExpression.toString()} = ${this.rightExpression.toString()}`;
  }

  swap() {
    return new Equation({
      leftExpression: this.rightExpression,
      rightExpression: this.leftExpression,
    });
  }
}
