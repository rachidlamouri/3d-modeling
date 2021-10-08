import sinon from 'sinon';
import { expect } from 'chai';
import { getMockExpressionClasses } from './baseMockExpression';
import { BinaryExpression } from '../../expressionParser/binaryExpression';
import { ConstantExpression } from '../../expressionParser/constantExpression';
import { UnaryExpression } from '../../expressionParser/unaryExpression';

const variableNames = ['var1', 'var2', 'var3'] as const;
type VariableNames = typeof variableNames;

const {
  MockExpression,
  MockSimplifiedExpression,
  MockLeftExpression,
  MockSimplifiedLeftExpression,
  MockLeftSubexpression,
  MockSimplifiedLeftSubexpression,
  MockRightExpression,
  MockSimplifiedRightExpression,
  MockRightSubexpression,
  MockSimplifiedRightSubexpression,
} = getMockExpressionClasses<VariableNames>();

const zeroLiteralExpression = new ConstantExpression({
  input: '0',
  constantLiteral: '0',
  value: 0,
});

const oneLiteralExpression = new ConstantExpression({
  input: '1',
  constantLiteral: '1',
  value: 1,
});

describe('expressionParser/binaryExpression', () => {
  describe('compute', () => {
    const leftExpression = new MockLeftExpression();
    const rightExpression = new MockRightExpression();

    const vars = {
      var1: 1,
      var2: 2,
      var3: 3,
    };

    sinon.stub(leftExpression, 'compute').withArgs(vars).returns(7);
    sinon.stub(rightExpression, 'compute').withArgs(vars).returns(5);

    it('returns the sum of the left and right expression for an addition expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '+',
        rightExpression,
      });

      expect(expression.compute(vars)).to.eq(12);
    });

    it('returns the difference of the left and right expression for a subtraction expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '-',
        rightExpression,
      });

      expect(expression.compute(vars)).to.eq(2);
    });

    it('returns the product of the left and right expression for a multiplication expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '*',
        rightExpression,
      });

      expect(expression.compute(vars)).to.eq(35);
    });

    it('returns the quotient of the left and right expression for a division expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '/',
        rightExpression,
      });

      expect(expression.compute(vars)).to.eq(1.4);
    });
  });

  describe('getInverseOperator', () => {
    it('returns "-" for an addition expression', () => {
      const expression = new BinaryExpression({
        leftExpression: new MockLeftExpression(),
        operator: '+',
        rightExpression: new MockRightExpression(),
      });

      expect(expression.getInverseOperator()).to.eq('-');
    });

    it('returns "+" for a subtraction expression', () => {
      const expression = new BinaryExpression({
        leftExpression: new MockLeftExpression(),
        operator: '-',
        rightExpression: new MockRightExpression(),
      });

      expect(expression.getInverseOperator()).to.eq('+');
    });

    it('returns "/" for a multiplication expression', () => {
      const expression = new BinaryExpression({
        leftExpression: new MockLeftExpression(),
        operator: '*',
        rightExpression: new MockRightExpression(),
      });

      expect(expression.getInverseOperator()).to.eq('/');
    });

    it('returns "*" for a division expression', () => {
      const expression = new BinaryExpression({
        leftExpression: new MockLeftExpression(),
        operator: '/',
        rightExpression: new MockRightExpression(),
      });

      expect(expression.getInverseOperator()).to.eq('*');
    });
  });

  describe('getVariableNames', () => {
    it('returns the combined variable names of the left and right expression', () => {
      const leftExpression = new MockLeftExpression();
      const rightExpression = new MockRightExpression();

      sinon.stub(leftExpression, 'getVariableNames').returns(['var3']);
      sinon.stub(rightExpression, 'getVariableNames').returns(['var1', 'var2']);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '+',
        rightExpression,
      });

      expect(expression.getVariableNames()).to.eql(['var3', 'var1', 'var2']);
    });
  });

  describe('simplify', () => {
    it('returns a binary expression with simplified subexpressions by default', () => {
      const leftExpression = new MockLeftExpression();
      const rightExpression = new MockRightExpression();

      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      const simplifiedRightExpression = new MockSimplifiedRightExpression();

      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);
      sinon.stub(rightExpression, 'simplify').returns(simplifiedRightExpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '+',
        rightExpression,
      });

      expect(expression.simplify()).to.eql(new BinaryExpression({
        input: '(mockLeftExpression) + (mockRightExpression)',
        leftExpression: simplifiedLeftExpression,
        operator: '+',
        rightExpression: simplifiedRightExpression,
      }));
    });

    it('omits the 0 for (0 + rightExpression)', () => {
      const simplifiedRightExpression = new MockSimplifiedRightExpression();
      const rightExpression = new MockRightExpression();
      sinon.stub(rightExpression, 'simplify').returns(simplifiedRightExpression);

      const expression = new BinaryExpression({
        leftExpression: zeroLiteralExpression,
        operator: '+',
        rightExpression,
      });

      expect(expression.simplify()).to.eql(simplifiedRightExpression);
    });

    it('omits the 0 for (0 - rightExpression)', () => {
      const simplifiedRightExpression = new MockSimplifiedRightExpression();
      const rightExpression = new MockRightExpression();
      sinon.stub(rightExpression, 'simplify').returns(simplifiedRightExpression);

      const expression = new BinaryExpression({
        leftExpression: zeroLiteralExpression,
        operator: '-',
        rightExpression,
      });

      expect(expression.simplify()).to.eql(new UnaryExpression({
        input: '(0) - (mockRightExpression)',
        operator: '-',
        expression: simplifiedRightExpression,
      }));
    });

    it('omits the 0 for (leftExpression + 0)', () => {
      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      const leftExpression = new MockLeftExpression();
      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '+',
        rightExpression: zeroLiteralExpression,
      });

      expect(expression.simplify()).to.eq(simplifiedLeftExpression);
    });

    it('omits the 0 for (leftExpression - 0)', () => {
      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      const leftExpression = new MockLeftExpression();
      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '-',
        rightExpression: zeroLiteralExpression,
      });

      expect(expression.simplify()).to.eq(simplifiedLeftExpression);
    });

    it('cancels the negatives for (leftExpression - (-rightExpression))', () => {
      const leftExpression = new MockLeftExpression();
      const rightSubexpression = new MockRightSubexpression();

      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      const simplifiedRightSubexpression = new MockSimplifiedRightSubexpression();

      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);
      sinon.stub(rightSubexpression, 'simplify').returns(simplifiedRightSubexpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '-',
        rightExpression: new UnaryExpression({
          operator: '-',
          expression: rightSubexpression,
        }),
      });

      expect(expression.simplify()).to.eql(new BinaryExpression({
        input: '(mockLeftExpression) - (-(mockRightSubexpression))',
        leftExpression: simplifiedLeftExpression,
        operator: '+',
        rightExpression: simplifiedRightSubexpression,
      }));
    });

    it('cancels the negatives for ((-leftExpression) * (-rightExpression))', () => {
      const leftSubexpression = new MockLeftSubexpression();
      const rightSubexpression = new MockRightSubexpression();

      const simplifiedLeftSubexpression = new MockSimplifiedLeftSubexpression();
      const simplifiedRightSubexpression = new MockSimplifiedRightSubexpression();

      sinon.stub(leftSubexpression, 'simplify').returns(simplifiedLeftSubexpression);
      sinon.stub(rightSubexpression, 'simplify').returns(simplifiedRightSubexpression);

      const expression = new BinaryExpression({
        leftExpression: new UnaryExpression({
          operator: '-',
          expression: leftSubexpression,
        }),
        operator: '*',
        rightExpression: new UnaryExpression({
          operator: '-',
          expression: rightSubexpression,
        }),
      });

      expect(expression.simplify()).to.eql(new BinaryExpression({
        input: '(-(mockLeftSubexpression)) * (-(mockRightSubexpression))',
        leftExpression: simplifiedLeftSubexpression,
        operator: '*',
        rightExpression: simplifiedRightSubexpression,
      }));
    });

    it('cancels the negatives for ((-leftExpression) / (-rightExpression))', () => {
      const leftSubexpression = new MockLeftSubexpression();
      const rightSubexpression = new MockRightSubexpression();

      const simplifiedLeftSubexpression = new MockSimplifiedLeftSubexpression();
      const simplifiedRightSubexpression = new MockSimplifiedRightSubexpression();

      sinon.stub(leftSubexpression, 'simplify').returns(simplifiedLeftSubexpression);
      sinon.stub(rightSubexpression, 'simplify').returns(simplifiedRightSubexpression);

      const expression = new BinaryExpression({
        leftExpression: new UnaryExpression({
          operator: '-',
          expression: leftSubexpression,
        }),
        operator: '/',
        rightExpression: new UnaryExpression({
          operator: '-',
          expression: rightSubexpression,
        }),
      });

      expect(expression.simplify()).to.eql(new BinaryExpression({
        input: '(-(mockLeftSubexpression)) / (-(mockRightSubexpression))',
        leftExpression: simplifiedLeftSubexpression,
        operator: '/',
        rightExpression: simplifiedRightSubexpression,
      }));
    });

    it('factors the -1 for ((-leftExpression) * rightExpression)', () => {
      const leftSubexpression = new MockLeftSubexpression();
      const rightExpression = new MockRightExpression();

      const simplifiedLeftSubexpression = new MockSimplifiedLeftSubexpression();
      const simplifiedRightExpression = new MockSimplifiedRightExpression();

      sinon.stub(leftSubexpression, 'simplify').returns(simplifiedLeftSubexpression);
      sinon.stub(rightExpression, 'simplify').returns(simplifiedRightExpression);

      const expression = new BinaryExpression({
        leftExpression: new UnaryExpression({
          operator: '-',
          expression: leftSubexpression,
        }),
        operator: '*',
        rightExpression,
      });

      expect(expression.simplify()).to.eql(new UnaryExpression({
        input: '(-(mockLeftSubexpression)) * (mockRightExpression)',
        operator: '-',
        expression: new BinaryExpression({
          input: '(+(mockLeftSubexpression)) * (mockRightExpression)',
          leftExpression: simplifiedLeftSubexpression,
          operator: '*',
          rightExpression: simplifiedRightExpression,
        }),
      }));
    });

    it('factors the -1 for ((-leftExpression) / rightExpression)', () => {
      const leftSubexpression = new MockLeftSubexpression();
      const rightExpression = new MockRightExpression();

      const simplifiedLeftSubexpression = new MockSimplifiedLeftSubexpression();
      const simplifiedRightExpression = new MockSimplifiedRightExpression();

      sinon.stub(leftSubexpression, 'simplify').returns(simplifiedLeftSubexpression);
      sinon.stub(rightExpression, 'simplify').returns(simplifiedRightExpression);

      const expression = new BinaryExpression({
        leftExpression: new UnaryExpression({
          operator: '-',
          expression: leftSubexpression,
        }),
        operator: '/',
        rightExpression,
      });

      expect(expression.simplify()).to.eql(new UnaryExpression({
        input: '(-(mockLeftSubexpression)) / (mockRightExpression)',
        operator: '-',
        expression: new BinaryExpression({
          input: '(+(mockLeftSubexpression)) / (mockRightExpression)',
          leftExpression: simplifiedLeftSubexpression,
          operator: '/',
          rightExpression: simplifiedRightExpression,
        }),
      }));
    });

    it('factors the -1 for (leftExpression * (-rightExpression))', () => {
      const leftExpression = new MockLeftExpression();
      const rightSubexpression = new MockRightSubexpression();

      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      const simplifiedRightSubexpression = new MockSimplifiedRightSubexpression();

      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);
      sinon.stub(rightSubexpression, 'simplify').returns(simplifiedRightSubexpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '*',
        rightExpression: new UnaryExpression({
          operator: '-',
          expression: rightSubexpression,
        }),
      });

      expect(expression.simplify()).to.eql(new UnaryExpression({
        input: '(mockLeftExpression) * (-(mockRightSubexpression))',
        operator: '-',
        expression: new BinaryExpression({
          input: '(mockLeftExpression) * (+(mockRightSubexpression))',
          leftExpression: simplifiedLeftExpression,
          operator: '*',
          rightExpression: simplifiedRightSubexpression,
        }),
      }));
    });

    it('factors the -1 for (leftExpression / (-rightExpression))', () => {
      const leftExpression = new MockLeftExpression();
      const rightSubexpression = new MockRightSubexpression();

      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      const simplifiedRightSubexpression = new MockSimplifiedRightSubexpression();

      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);
      sinon.stub(rightSubexpression, 'simplify').returns(simplifiedRightSubexpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '/',
        rightExpression: new UnaryExpression({
          operator: '-',
          expression: rightSubexpression,
        }),
      });

      expect(expression.simplify()).to.eql(new UnaryExpression({
        input: '(mockLeftExpression) / (-(mockRightSubexpression))',
        operator: '-',
        expression: new BinaryExpression({
          input: '(mockLeftExpression) / (+(mockRightSubexpression))',
          leftExpression: simplifiedLeftExpression,
          operator: '/',
          rightExpression: simplifiedRightSubexpression,
        }),
      }));
    });

    it('omits the 1 for (leftExpression * 1)', () => {
      const leftExpression = new MockLeftExpression();
      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '*',
        rightExpression: oneLiteralExpression,
      });

      expect(expression.simplify()).to.eq(simplifiedLeftExpression);
    });

    it('omits the 1 for (leftExpression / 1)', () => {
      const leftExpression = new MockLeftExpression();
      const simplifiedLeftExpression = new MockSimplifiedLeftExpression();
      sinon.stub(leftExpression, 'simplify').returns(simplifiedLeftExpression);

      const expression = new BinaryExpression({
        leftExpression,
        operator: '/',
        rightExpression: oneLiteralExpression,
      });

      expect(expression.simplify()).to.eq(simplifiedLeftExpression);
    });

    it('omits the 1 for (1 * rightExpression)', () => {
      const rightExpression = new MockLeftExpression();
      const simplifiedRightExpression = new MockSimplifiedRightExpression();
      sinon.stub(rightExpression, 'simplify').returns(simplifiedRightExpression);

      const expression = new BinaryExpression({
        leftExpression: oneLiteralExpression,
        operator: '*',
        rightExpression,
      });

      expect(expression.simplify()).to.eq(simplifiedRightExpression);
    });
  });

  describe('toString', () => {
    const leftExpression = new MockLeftExpression();
    const rightExpression = new MockRightExpression();
    sinon.stub(leftExpression, 'toString').returns('leftMock');
    sinon.stub(rightExpression, 'toString').returns('rightMock');

    it('returns the operator and the stringified expressions for an addition expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '+',
        rightExpression,
      });

      expect(expression.toString()).to.eq('(leftMock + rightMock)');
    });

    it('returns the operator and the stringified expressions for a subtraction expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '-',
        rightExpression,
      });

      expect(expression.toString()).to.eq('(leftMock - rightMock)');
    });

    it('returns the operator and the stringified expressions for a multiplication expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '*',
        rightExpression,
      });

      expect(expression.toString()).to.eq('(leftMock * rightMock)');
    });

    it('returns the operator and the stringified expressions for a division expression', () => {
      const expression = new BinaryExpression({
        leftExpression,
        operator: '/',
        rightExpression,
      });

      expect(expression.toString()).to.eq('(leftMock / rightMock)');
    });
  });
});
