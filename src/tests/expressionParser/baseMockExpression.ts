import { Expression } from '../../expressionParser/expression';
import { VariableLiterals, VariablesMap } from '../../expressionParser/statement';

class BaseMockExpression<VariableNames extends VariableLiterals> extends Expression<VariableNames> {
  constructor(input: string) {
    super({ input });
  }

  /* eslint-disable class-methods-use-this */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compute(variables: VariablesMap<VariableNames>): number {
    throw new Error('Method not implemented.');
  }

  getVariableNames(): VariableNames[number][] {
    throw new Error('Method not implemented.');
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }

  simplify(): Expression<VariableNames> {
    throw new Error('Method not implemented.');
  }
  /* eslint-enable class-methods-use-this */
}

export const getMockExpressionClasses = <VariableNames extends VariableLiterals>() => ({
  MockExpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockExpression'); }
  },
  MockSimplifiedExpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockSimplifiedExpression'); }
  },
  MockLeftExpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockLeftExpression'); }
  },
  MockSimplifiedLeftExpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockSimplifiedLeftExpression'); }
  },
  MockLeftSubexpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockLeftSubexpression'); }
  },
  MockSimplifiedLeftSubexpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockSimplifiedLeftSubexpression'); }
  },
  MockRightExpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockRightExpression'); }
  },
  MockSimplifiedRightExpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockSimplifiedRightExpression'); }
  },
  MockRightSubexpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockRightSubexpression'); }
  },
  MockSimplifiedRightSubexpression: class extends BaseMockExpression<VariableNames> {
    constructor() { super('mockSimplifiedRightSubexpression'); }
  },
});
