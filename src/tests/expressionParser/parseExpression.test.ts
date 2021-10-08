import { expect } from 'chai';
import { BinaryExpression } from '../../expressionParser/binaryExpression';
import { ConstantExpression } from '../../expressionParser/constantExpression';
import { Expression } from '../../expressionParser/expression';
import { parseExpression } from '../../expressionParser/parseExpression';
import { UnaryExpression } from '../../expressionParser/unaryExpression';
import { VariableExpression } from '../../expressionParser/variableExpression';

describe('expressionParser/parseExpression', () => {
  describe('constant expressions', () => {
    it('returns a ConstantExpression for an integer expression', () => {
      const result = parseExpression('1234567890', []);
      expect(result).to.be.an.instanceof(ConstantExpression);
    });

    it('returns a ConstantExpression for a decimal expression', () => {
      const result = parseExpression('1.23', []);
      expect(result).to.be.an.instanceof(ConstantExpression);
    });

    it('returns a ConstantExpression for a fraction expression', () => {
      const result = parseExpression('.123', []);
      expect(result).to.be.an.instanceof(ConstantExpression);
    });
  });

  context('with a variable expression', () => {
    it('returns a VariableExpression', () => {
      const result = parseExpression('abc', ['abc']);
      expect(result).to.be.an.instanceof(VariableExpression);
    });
  });

  describe('unary expressions', () => {
    it('returns a UnaryExpression for a positive unary expression', () => {
      const result = parseExpression('+1', []);
      expect(result).to.be.an.instanceof(UnaryExpression);
    });

    it('returns a UnaryExpression for a negative unary expression', () => {
      const result = parseExpression('-1', []);
      expect(result).to.be.an.instanceof(UnaryExpression);
    });
  });

  describe('binary expressions', () => {
    it('returns a BinaryExpression for an addition expression', () => {
      const result = parseExpression('1 + 2', []);
      expect(result).to.be.an.instanceof(BinaryExpression);
    });

    it('returns a BinaryExpression for a subtraction expression', () => {
      const result = parseExpression('1 - 2', []);
      expect(result).to.be.an.instanceof(BinaryExpression);
    });

    it('returns a BinaryExpression for a multiplication expression', () => {
      const result = parseExpression('1 * 2', []);
      expect(result).to.be.an.instanceof(BinaryExpression);
    });

    it('returns a BinaryExpression for a division expression', () => {
      const result = parseExpression('1 / 2', []);
      expect(result).to.be.an.instanceof(BinaryExpression);
    });
  });

  context('with a mixed expression', () => {
    it('respects PEMDAS', () => {
      const result = parseExpression('1 + 2 / 3 * (-4) + ((5 + 7) / 8) * 9', []);
      expect(result).to.be.an.instanceof(Expression);
      expect(result.toString()).to.equal('((1 + ((2 / 3) * (-4))) + (((5 + 7) / 8) * 9))');
    });
  });

  describe('error expressions', () => {
    xit('returns an ErrorExpression for a blank expression');

    xit('returns an ErrorExpression for an unregistered variable name');

    xit('returns an ErrorExpression for a PascalCase variable name');

    xit('returns an ErrorExpression for a snake_case variable name');

    xit('returns an ErrorExpression for a kebab-case variable name');

    xit('returns an ErrorExpression for an invalid unary expressions expression');

    xit('returns an ErrorExpression for an invalid binary expressions left expression');

    xit('returns an ErrorExpression for an invalid binary expressions right expression');
  });
});
