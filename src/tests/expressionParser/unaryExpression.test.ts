import sinon from 'sinon';
import { expect } from 'chai';
import { UnaryExpression } from '../../expressionParser/unaryExpression';
import { getMockExpressionClasses } from './baseMockExpression';

const variableNames = ['var1', 'var2'] as const;
type VariableNames = typeof variableNames;

const {
  MockExpression,
  MockSimplifiedExpression,
} = getMockExpressionClasses<VariableNames>();

describe('expressionParser/unaryExpression', () => {
  describe('compute', () => {
    it('returns the positive computed inner expression for a positive UnaryExpression', () => {
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'compute').returns(7);
      const expression = new UnaryExpression({
        operator: '+',
        expression: mockExpression,
      });

      expect(expression.compute({ var1: 10, var2: 20 })).to.eq(7);
    });

    it('returns the negative computed inner expression for a negative UnaryExpression', () => {
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'compute').returns(7);
      const expression = new UnaryExpression({
        operator: '-',
        expression: mockExpression,
      });

      expect(expression.compute({ var1: 10, var2: 20 })).to.eq(-7);
    });
  });

  describe('getUnit', () => {
    it('returns 1 for a positive unary expression', () => {
      const expression = new UnaryExpression({
        operator: '+',
        expression: new MockExpression(),
      });

      expect(expression.getUnit()).to.eq(1);
    });

    it('returns -1 for a negative unary expression', () => {
      const expression = new UnaryExpression({
        operator: '-',
        expression: new MockExpression(),
      });

      expect(expression.getUnit()).to.eq(-1);
    });
  });

  describe('getVariableNames', () => {
    it('returns the variable names from the inner expression', () => {
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'getVariableNames').returns(['var2']);
      const expression = new UnaryExpression({
        operator: '+',
        expression: mockExpression,
      });

      expect(expression.getVariableNames()).to.eql(['var2']);
    });
  });

  describe('invert', () => {
    it('returns a negative unary expression for a positive unary expression', () => {
      const mockExpression = new MockExpression();
      const expression = new UnaryExpression({
        operator: '+',
        expression: mockExpression,
      });

      expect(expression.invert()).to.eql(new UnaryExpression({
        operator: '-',
        expression: mockExpression,
      }));
    });

    it('returns a positive unary expression for a negative unary expression', () => {
      const mockExpression = new MockExpression();
      const expression = new UnaryExpression({
        operator: '-',
        expression: mockExpression,
      });

      expect(expression.invert()).to.eql(new UnaryExpression({
        operator: '+',
        expression: mockExpression,
      }));
    });
  });

  describe('isNegative', () => {
    it('returns false for a positive unary expression', () => {
      const expression = new UnaryExpression({
        operator: '+',
        expression: new MockExpression(),
      });

      expect(expression.isNegative()).to.be.false;
    });

    it('returns true for a negative unary expression', () => {
      const expression = new UnaryExpression({
        operator: '-',
        expression: new MockExpression(),
      });

      expect(expression.isNegative()).to.be.true;
    });
  });

  describe('simplify', () => {
    it('returns the simplified inner expression for a postive unary expression', () => {
      const mockExpression = new MockExpression();
      const simplifiedMockExpression = new MockSimplifiedExpression();
      sinon.stub(mockExpression, 'simplify').returns(simplifiedMockExpression);
      const expression = new UnaryExpression({
        operator: '+',
        expression: mockExpression,
      });

      expect(expression.simplify()).to.eq(simplifiedMockExpression);
    });

    it('returns the simplified inner inner expression for a negated negated unary expression', () => {
      const simplifiedMockExpression = new MockSimplifiedExpression();
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'simplify').returns(simplifiedMockExpression);
      const expression = new UnaryExpression({
        operator: '-',
        expression: new UnaryExpression({
          operator: '-',
          expression: mockExpression,
        }),
      });

      expect(expression.simplify()).to.eq(simplifiedMockExpression);
    });

    it('returns a simplified unary expression for a negative unary expression', () => {
      const simplifiedMockExpression = new MockSimplifiedExpression();
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'simplify').returns(simplifiedMockExpression);
      const expression = new UnaryExpression({
        operator: '-',
        expression: mockExpression,
      });

      expect(expression.simplify()).to.eql(new UnaryExpression({
        input: '-(mockExpression)',
        operator: '-',
        expression: simplifiedMockExpression,
      }));
    });
  });

  describe('toString', () => {
    it('returns the operator and the stringified inner expression for a positive unary expression', () => {
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'toString').returns('mock');
      const expression = new UnaryExpression({
        operator: '+',
        expression: mockExpression,
      });

      expect(expression.toString()).to.eq('(+mock)');
    });

    it('returns the operator and the stringified inner expression for a negative unary expression', () => {
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'toString').returns('mock');
      const expression = new UnaryExpression({
        operator: '-',
        expression: mockExpression,
      });

      expect(expression.toString()).to.eq('(-mock)');
    });
  });
});
