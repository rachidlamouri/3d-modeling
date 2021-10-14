/* eslint-disable no-underscore-dangle */

import { CommonTokenStream, CharStreams } from 'antlr4ts';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { DimensionScriptLexer } from './compiled/DimensionScriptLexer';
import { DimensionScriptParser, ExpressionContext, InputContext } from './compiled/DimensionScriptParser';
import { DimensionScriptVisitor } from './compiled/DimensionScriptVisitor';
import { VariableLiteral, VariableLiterals } from './statement';
import { Expression } from './expression';
import { BinaryExpression, BinaryOperator } from './binaryExpression';
import { UnaryExpression, UnaryOperator } from './unaryExpression';
import { VariableExpression } from './variableExpression';
import { ConstantExpression, ConstantLiteral } from './constantExpression';
import { ErrorExpression, ErrorVariableExpression } from './errorExpression';

export type DimensionScript = string;

type AggregateResult<VariableNames extends VariableLiterals>
  = [hasError: boolean, expression: Expression<VariableNames>];

class ExpressionVisitor<VariableNames extends VariableLiterals>
  extends AbstractParseTreeVisitor<AggregateResult<VariableNames>>
  implements DimensionScriptVisitor<AggregateResult<VariableNames>> {
  #variableNames: VariableNames;

  constructor(variableNames: VariableNames) {
    super();
    this.#variableNames = variableNames;
  }

  // eslint-disable-next-line class-methods-use-this
  defaultResult(): AggregateResult<VariableNames> {
    throw Error('Cannot infer a default expression. Investigate why "visitInput" was not called instead.');
  }

  visitInput(context: InputContext): AggregateResult<VariableNames> {
    const [hasError, parsedExpression] = this.visitExpression(context._singleExpression);
    const resultExpression = (hasError && !(parsedExpression instanceof ErrorExpression))
      ? new ErrorExpression({
        input: parsedExpression.input,
        expression: parsedExpression,
      })
      : parsedExpression;

    return [hasError, resultExpression];
  }

  visitExpression(context: ExpressionContext): AggregateResult<VariableNames> {
    const input = context.text;

    switch (true) {
      case '_parenthesizedExpression' in context: {
        return this.visitExpression(context._parenthesizedExpression);
      }
      case '_leftExpression' in context: {
        const [hasLeftError, leftExpression] = this.visitExpression(context._leftExpression);
        const [hasRightError, rightExpression] = this.visitExpression(context._rightExpression);
        return [
          hasLeftError || hasRightError,
          new BinaryExpression({
            input,
            leftExpression,
            operator: context._operatorLiteral.text as BinaryOperator,
            rightExpression,
          }),
        ];
      }
      case '_singleExpression' in context: {
        const [hasError, expression] = this.visitExpression(context._singleExpression);
        return [
          hasError,
          new UnaryExpression({
            input,
            operator: context._operatorLiteral.text as UnaryOperator,
            expression,
          }),
        ];
      }
      case '_variableLiteral' in context: {
        const variableLiteral = context._variableLiteral.text as VariableLiteral;

        const variableExpression = new VariableExpression({
          input,
          variableLiteral,
        });

        const hasError = !this.#variableNames.includes(variableLiteral);
        const expression = hasError
          ? new ErrorVariableExpression({
            input,
            expression: variableExpression,
          })
          : variableExpression;

        return [hasError, expression];
      }
      case '_constantLiteral' in context: {
        const constantLiteral = context._constantLiteral.text as ConstantLiteral;

        return [
          false,
          new ConstantExpression({
            input,
            constantLiteral,
            value: parseFloat(constantLiteral),
          }),
        ];
      }
      default: {
        return [
          true,
          new ErrorExpression({ input, expression: null }),
        ];
      }
    }
  }
}

export const parseExpression = <VariableNames extends VariableLiterals>
  (dimensionScript: DimensionScript, variableNames: VariableNames) => {
  const lexer = new DimensionScriptLexer(CharStreams.fromString(dimensionScript));
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new DimensionScriptParser(tokenStream);
  const tree = parser.input();
  const expressionVisitor = new ExpressionVisitor(variableNames);
  const [, parsedExpression] = expressionVisitor.visit(tree);
  return parsedExpression;
};
