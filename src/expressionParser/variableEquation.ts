import { Equation } from './equation';
import { VariableExpression } from './variableExpression';
import { VariableLiterals, VariablesMap } from './statement';

export class VariableEquation<VariableNames extends VariableLiterals> extends Equation<VariableNames> {
  leftExpression: VariableExpression<VariableNames>;

  constructor(equation: Equation<VariableNames>) {
    if (!(equation.leftExpression instanceof VariableExpression)) {
      throw Error('leftExpression must be VariableExpression');
    }

    super(equation);

    this.leftExpression = equation.leftExpression;
  }

  compute(variables: VariablesMap<VariableNames>) {
    return this.rightExpression.compute(variables);
  }

  hasDuplicateVariables() {
    return !this.isTautology() && super.hasDuplicateVariables();
  }

  isTautology() {
    const rightVariableNames = this.rightExpression.getVariableNames();
    return rightVariableNames.length === 1 && rightVariableNames[0] === this.variableName;
  }

  splitLeftVariableExpression(): Equation<VariableNames> {
    const [equation] = super.splitLeftExpression();
    return equation;
  }

  get variableName() {
    const [variableName] = this.leftExpression.getVariableNames();
    return variableName;
  }
}

export type VariableEquationSystem<VariableNames extends VariableLiterals> =
  Partial<Record<VariableNames[number], VariableEquation<VariableNames>>>;

export type VariableEquationSystems<VariableNames extends VariableLiterals> =
  Record<VariableNames[number], VariableEquation<VariableNames>[]>;
