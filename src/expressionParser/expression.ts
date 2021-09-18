export type ExpressionParams = {
  input: string;
}

export type VariablesMap = Record<string, number>;

export abstract class Expression {
  type: string;
  input: string;

  constructor({ input }: ExpressionParams) {
    this.type = this.constructor.name;
    this.input = input;
  }

  abstract compute(variables: VariablesMap): number;

  abstract getVariableNames(): string[]

  abstract serialize(): string;

  abstract simplify(): Expression
}
