import { Statement, VariableLiterals, VariablesMap } from './statement';

export type ExpressionParams = {
  input: string;
}

export abstract class Expression<VariableNames extends VariableLiterals> implements Statement<VariableNames> {
  input: string;

  constructor({ input }: ExpressionParams) {
    this.input = input;
  }

  abstract compute(variables: VariablesMap<VariableNames>): number;
  abstract getVariableNames(): VariableNames[number][];
  abstract toString(): string;
  abstract simplify(): Expression<VariableNames>;
}
