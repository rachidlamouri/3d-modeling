import { expect } from 'chai';
import { VariableExpression } from '../../expressionParser/variableExpression';

describe('expressionParser/variableExpression', () => {
  const variableNames = ['var1'] as const;
  const variableExpression = new VariableExpression<typeof variableNames>({
    input: '',
    variableLiteral: 'var1',
  });

  describe('compute', () => {
    it('returns the value from the map', () => {
      expect(variableExpression.compute({ var1: 12.34 })).to.eq(12.34);
    });
  });

  describe('getVariableNames', () => {
    it('returns the variable name', () => {
      expect(variableExpression.getVariableNames()).to.eql(['var1']);
    });
  });

  describe('simplify', () => {
    it('returns itself', () => {
      expect(variableExpression.simplify()).to.eq(variableExpression);
    });
  });

  describe('toString', () => {
    it('returns the name of the variable', () => {
      expect(variableExpression.toString()).to.eq('var1');
    });
  });
});
