import sinon from 'sinon';
import { expect } from 'chai';
import { getMockExpressionClasses } from './baseMockExpression';
import { ErrorExpression } from '../../expressionParser/errorExpression';

const {
  MockExpression,
  MockSimplifiedExpression,
} = getMockExpressionClasses<never>();

describe('expressionParser/errorExpression', () => {
  describe('compute', () => {
    it('throws an error', () => {
      const expression = new ErrorExpression({
        input: 'MOCK_INPUT',
        expression: null,
      });

      expect(() => expression.compute()).to.throw('Cannot compute ErrorExpression: "MOCK_INPUT"');
    });
  });

  describe('getVariableNames', () => {
    it('returns an empty list', () => {
      const expression = new ErrorExpression({
        input: '',
        expression: null,
      });

      expect(expression.getVariableNames()).to.eql([]);
    });
  });

  describe('simplify', () => {
    it('returns itself when it is not wrapping a valid expression', () => {
      const expression = new ErrorExpression({
        input: '',
        expression: null,
      });

      expect(expression.simplify()).to.eq(expression);
    });

    it('returns a simplified error expression when it wraps a valid expression', () => {
      const mockExpression = new MockExpression();
      const mockSimplifiedExpression = new MockSimplifiedExpression();
      sinon.stub(mockExpression, 'simplify').returns(mockSimplifiedExpression);

      const expression = new ErrorExpression({
        input: 'MOCK_INPUT',
        expression: mockExpression,
      });

      expect(expression.simplify()).to.eql(new ErrorExpression({
        input: 'MOCK_INPUT',
        expression: mockSimplifiedExpression,
      }));
    });
  });

  describe('toString', () => {
    it('returns the raw input when it is not wrapping a valid expression', () => {
      const expression = new ErrorExpression({
        input: 'MOCK_INPUT',
        expression: null,
      });

      expect(expression.toString()).to.eq('[ErrorExpression: "MOCK_INPUT"]');
    });

    it('returns the stringified inner expression when it wraps a valid expression', () => {
      const mockExpression = new MockExpression();
      sinon.stub(mockExpression, 'toString').returns('mockExpression');

      const expression = new ErrorExpression({
        input: '',
        expression: mockExpression,
      });

      expect(expression.toString()).to.eq('[ErrorExpression: "mockExpression"]');
    });
  });
});
