export type VariableLiteral = string;

export type VariableLiterals = readonly VariableLiteral[];

export type VariablesMap<VariableNames extends VariableLiterals> = Record<VariableNames[number], number>;

export interface Statement<VariableNames extends VariableLiterals> {
  compute(variables: VariablesMap<VariableNames>): number;
  getVariableNames(): VariableNames[number][];
  toString(): string;
  simplify(): Statement<VariableNames>;
}
