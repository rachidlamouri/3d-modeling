import { expect } from 'chai';
import { BinaryExpression } from '../../expressionParser/binaryExpression';
import { ConstantExpression } from '../../expressionParser/constantExpression';
import { ErrorExpression, ErrorVariableExpression } from '../../expressionParser/errorExpression';
import { Expression } from '../../expressionParser/expression';
import { parseExpression } from '../../expressionParser/parseExpression';
import { UnaryExpression } from '../../expressionParser/unaryExpression';
import { VariableExpression } from '../../expressionParser/variableExpression';

describe('expressionParser/parseExpression', () => {
  describe('constant expressions', () => {
    context('with an integer expression', () => {
      let result: Expression<never>;

      before(() => {
        result = parseExpression('1234567890', []);
      });

      it('returns a ConstantExpression', () => {
        expect(result).to.be.instanceof(ConstantExpression);
      });

      it('saves the text value', () => {
        expect(result.toString()).to.eq('1234567890');
      });

      it('saves the numeric value', () => {
        expect(result.compute({})).to.eq(1234567890);
      });
    });

    context('with a decimal expression', () => {
      let result: Expression<never>;

      before(() => {
        result = parseExpression('1.23', []) as ConstantExpression;
      });

      it('returns a ConstantExpression', () => {
        expect(result).to.be.instanceof(ConstantExpression);
      });

      it('saves the text value', () => {
        expect(result.toString()).to.eq('1.23');
      });

      it('saves the numeric value', () => {
        expect(result.compute({})).to.eq(1.23);
      });
    });

    context('with a fraction expression', () => {
      let result: Expression<never>;

      before(() => {
        result = parseExpression('.123', []) as ConstantExpression;
      });

      it('returns a ConstantExpression', () => {
        expect(result).to.be.instanceof(ConstantExpression);
      });

      it('saves the text value', () => {
        expect(result.toString()).to.eq('.123');
      });

      it('saves the numeric value', () => {
        expect(result.compute({})).to.eq(0.123);
      });
    });
  });

  describe('variable expression', () => {
    context('with an all lowercase variable', () => {
      const variableNames = ['abc'] as const;
      let result: Expression<typeof variableNames>;

      before(() => {
        result = parseExpression('abc', variableNames);
      });

      it('returns a VariableExpression', () => {
        expect(result).to.be.instanceof(VariableExpression);
      });

      it('saves the variableName', () => {
        expect(result.getVariableNames()).to.eql(['abc']);
      });
    });

    context('with a camelCase variable', () => {
      const variableNames = ['abcDef'] as const;
      let result: Expression<typeof variableNames>;

      before(() => {
        result = parseExpression('abcDef', variableNames);
      });

      it('returns a VariableExpression', () => {
        expect(result).to.be.instanceof(VariableExpression);
      });

      it('saves the variableName', () => {
        expect(result.getVariableNames()).to.eql(['abcDef']);
      });
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
      const variableNames = ['abc', 'def', 'ghi'] as const;
      const result = parseExpression('1 + 2 / abc * (-3) + ((4 + def) / 5) * ghi', variableNames);
      expect(result).to.be.an.instanceof(Expression);
      expect(result.toString()).to.equal('((1 + ((2 / abc) * (-3))) + (((4 + def) / 5) * ghi))');
    });
  });

  describe('error expressions', () => {
    it('returns an ErrorExpression for blank input', () => {
      const result = parseExpression('', []);
      expect(result).to.be.instanceof(ErrorExpression);
    });

    it('returns an ErrorExpression for an unregistered variable name', () => {
      const result = parseExpression('abc', []);
      expect(result).to.be.instanceof(ErrorVariableExpression);
    });

    it('returns an ErrorExpression for a PascalCase variable name', () => {
      const variableNames = ['AbcDef'] as const;
      const result = parseExpression('AbcDef', variableNames);
      expect(result).to.be.instanceof(ErrorExpression);
    });

    it('returns an ErrorExpression for a snake_case variable name', () => {
      const variableNames = ['abc_def'] as const;
      const result = parseExpression('abc_def', variableNames);
      expect(result, result.constructor.name).to.be.instanceof(ErrorExpression);
    });

    context('with an invalid unary expression', () => {
      let result: Expression<never>;

      before(() => {
        result = parseExpression('+', []);
      });

      it('returns an ErrorExpression', () => {
        expect(result).to.be.instanceof(ErrorExpression);
      });

      it('saves the UnaryExpression in the ErrorExpression', () => {
        expect((result as ErrorExpression<never>).expression).to.be.instanceof(UnaryExpression);
      });

      it('saves the actual ErrorExpression within the UnaryExpression', () => {
        const unaryExpression = (result as ErrorExpression<never>).expression as UnaryExpression<never>;
        expect(unaryExpression.expression).to.be.instanceof(ErrorExpression);
      });
    });

    context('with a binary expression with invalid left and right expressions', () => {
      let result: Expression<never>;

      before(() => {
        result = parseExpression('(🙂) * (🙂)', []);
      });

      it('returns an ErrorExpression', () => {
        expect(result).to.be.instanceof(ErrorExpression);
      });

      it('saves the BinaryExpression in the ErrorExpression', () => {
        expect((result as ErrorExpression<never>).expression).to.be.instanceof(BinaryExpression);
      });

      it('saves an actual ErrorExpression within the BinaryExpressions leftExpression', () => {
        const binaryExpression = (result as ErrorExpression<never>).expression as BinaryExpression<never>;
        expect(binaryExpression.leftExpression).to.be.instanceof(ErrorExpression);
      });

      it('saves an actual ErrorExpression within the BinaryExpressions rightExpression', () => {
        const binaryExpression = (result as ErrorExpression<never>).expression as BinaryExpression<never>;
        expect(binaryExpression.rightExpression).to.be.instanceof(ErrorExpression);
      });
    });
  });
});
