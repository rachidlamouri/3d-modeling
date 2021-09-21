import { Statement, VariablesMap } from './statement';

export type ExpressionParams = {
  input: string;
}

export abstract class Expression implements Statement {
  input: string;

  constructor({ input }: ExpressionParams) {
    this.input = input;
  }

  abstract compute(variables: VariablesMap): number;
  abstract getVariableNames(): string[];
  abstract serialize(): string;
  abstract simplify(): Expression;
}
