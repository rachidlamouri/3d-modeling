import { Statement, VariablesMap } from './statement';
import { Expression } from './expression';

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
}
