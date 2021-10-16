import { expect } from 'chai';
import { AggregateParseInputDimensionError, buildParseInputDimensions } from '../../dimensionParser/buildParseInputDimensions';
import { AggregateError } from '../../utils/error';

describe('dimensionParser/buildInputDimensionParser', () => {
  describe('buildParseInputDimensions', () => {
    context('with valid dimension definitions', () => {
      it('returns a function', () => {
        expect(buildParseInputDimensions([], {})).to.be.a('function');
      });
    });

    context('with invalid dimension definitions', () => {
      let aggregateError: AggregateError;

      before(() => {
        const variableNames = [
          'var1',
          'var2',
          'var3',
          'var4',
          'var5',
          'var6',
        ] as const;

        try {
          buildParseInputDimensions(
            variableNames,
            {
              var1: 'abc',
              var2: 'var1 + var4 + var2 + var1',
              var4: '++',
              var5: 'var3 + var1 + var3 + var1',
            },
          );
        } catch (e) {
          aggregateError = e as AggregateError;
        }
      });

      it('throws an error', () => {
        expect(aggregateError).to.be.instanceof(AggregateError);
      });

      it('reports all unparseable definitions and definitions with duplicate variables', () => {
        expect(aggregateError.messages).to.eql([
          'Definition `var1 = abc` has a parse error `var1 = [ErrorVariableExpression: "abc"]`',
          'Definition `var2 = var1+var4+var2+var1` has duplicate variable(s) "var2, var1"',
          'Definition `var4 = ++` has a parse error `var4 = [ErrorExpression: "(+(+[ErrorExpression: ""]))"]`',
          'Definition `var5 = var3+var1+var3+var1` has duplicate variable(s) "var3, var1"',
        ]);
      });

      it('does not report tautologies', () => {
        expect(aggregateError.message).to.not.match(/`var3 =|`var6 =/);
      });
    });
  });

  describe('parseInputDimensions', () => {
    type ParsedInput = Record<string, number>;

    context('when it can derive all dimensions', () => {
      let result: ParsedInput;

      before(() => {
        result = buildParseInputDimensions(
          [
            'var1',
            'var2',
            'var3',
            'var4',
          ] as const,
          {
            var2: 'var4 + var3',
            var4: 'var1 / 2',
          },
        )({
          var1: 4,
          var2: 10,
        });
      });

      it('returns all dimensions', () => {
        expect(result).to.eql({
          var1: 4,
          var2: 10,
          var3: 10 - (4 / 2),
          var4: 4 / 2,
        });
      });
    });

    context('when it can\'t derive all dimensions', () => {
      const variableNames = [
        'var1',
        'var2',
        'var3',
        'var4',
        'var5',
        'var6',
      ] as const;
      let error: AggregateParseInputDimensionError<typeof variableNames>;

      before(() => {
        try {
          buildParseInputDimensions(
            variableNames,
            {
              var2: 'var1 + var4',
              var4: 'var1 + var3 + var5',
              var5: 'var1 / 3',
            },
          )({
            var1: 12,
          });
        } catch (e) {
          error = e as AggregateParseInputDimensionError<typeof variableNames>;
        }
      });

      it('throws an error', () => {
        expect(error).to.be.instanceof(AggregateParseInputDimensionError);
      });

      it('reports the values of solved variables', () => {
        expect(error.workingDimensions).to.eql({
          var1: { input: 12, computed: 12 },
          var2: { input: null, computed: null },
          var3: { input: null, computed: null },
          var4: { input: null, computed: null },
          var5: { input: null, computed: 4 },
          var6: { input: null, computed: null },
        });
      });

      it('reports equations that cannot be derived', () => {
        expect(error.messages).to.eql([
          'Unable to solve `var2 = (var1 + var4)`',
          'Unable to solve `var3 = ((var4 - var5) - var1)`',
          'Unable to solve `var4 = (var2 - var1)`',
          'Unable to solve `var4 = ((var1 + var3) + var5)`',
          'Unable to solve `var6 = var6`',
        ]);
      });
    });

    context('when a derived dimension conflicts with an input dimension', () => {
      it('throws an error with the input and derived value', () => {
        const testFn = () => {
          buildParseInputDimensions(
            [
              'var1',
              'var2',
              'var3',
            ] as const,
            {
              var1: 'var2 + var3',
            },
          )({
            var1: 10,
            var2: 5,
            var3: 4,
          });
        };

        expect(testFn).to.throw('"var2" has mismatched input value "5" and computed value "6"');
      });
    });

    context('when a derived dimension conflicts with a previously derived dimension', () => {
      it('throws an error with the input and derived value', () => {
        const testFn = () => {
          buildParseInputDimensions(
            [
              'var1',
              'var2',
              'var3',
            ] as const,
            {
              var1: 'var3',
              var2: 'var3',
            },
          )({
            var1: 5,
            var2: 4,
          });
        };

        expect(testFn).to.throw('"var3" has mismatched computed values "5" and "4"');
      });
    });

    context('when a derived dimension conflicts with an input dimension and a previously derived dimension', () => {
      it('throws an error with the input and derived value', () => {
        const testFn = () => {
          buildParseInputDimensions(
            [
              'var1',
              'var2',
              'var3',
            ] as const,
            {
              var1: 'var3',
              var2: 'var3',
            },
          )({
            var1: 5,
            var2: 4,
            var3: 5,
          });
        };

        expect(testFn).to.throw('"var3" has mismatched input value "5" and computed values "5" and "4"');
      });
    });
  });
});
