import { expect } from 'chai';
import { ConstantExpression } from '../../expressionParser/constantExpression';

describe('expressionParser/constantExpression', () => {
  describe('compute', () => {
    it('returns the value', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '',
        value: 7.82,
      });
      expect(expression.compute()).to.eq(7.82);
    });
  });

  describe('getVariableNames', () => {
    it('returns an empty array', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '',
        value: 0,
      });
      expect(expression.getVariableNames()).to.eql([]);
    });
  });

  describe('isZero', () => {
    it('returns true when the value is zero', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '',
        value: 0,
      });
      expect(expression.isZero()).to.eq(true);
    });

    it('returns false when the value is not zero', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '',
        value: 1,
      });
      expect(expression.isZero()).to.eq(false);
    });
  });

  describe('isOne', () => {
    it('returns true when the value is one', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '',
        value: 1,
      });
      expect(expression.isOne()).to.eq(true);
    });

    it('returns false when the value is not one', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '',
        value: 0,
      });
      expect(expression.isOne()).to.eq(false);
    });
  });

  describe('simplify', () => {
    it('returns itself', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '',
        value: 0,
      });
      expect(expression.simplify()).to.eq(expression);
    });
  });

  describe('toString', () => {
    it('returns the input literal for integers', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '12',
        value: 12,
      });
      expect(expression.toString()).to.eq('12');
    });

    it('returns the input literal for decimals', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '12.34',
        value: 12.34,
      });
      expect(expression.toString()).to.eq('12.34');
    });

    it('returns the input literal for fractions', () => {
      const expression = new ConstantExpression({
        input: '',
        constantLiteral: '.12',
        value: 0.12,
      });
      expect(expression.toString()).to.eq('.12');
    });
  });
});
