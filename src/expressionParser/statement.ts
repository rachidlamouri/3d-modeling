export type VariablesMap = Record<string, number>;

export interface Statement {
  compute(variables: VariablesMap): number;
  getVariableNames(): string[];
  serialize(): string;
  simplify(): Statement;
}
