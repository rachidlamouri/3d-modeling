/* eslint-disable no-underscore-dangle */

import { CommonTokenStream, CharStreams } from 'antlr4ts';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { DimensionScriptLexer } from './compiled/src/expressionParser/DimensionScriptLexer';
import { DimensionScriptParser, ExpressionContext, InputContext } from './compiled/src/expressionParser/DimensionScriptParser';
import { DimensionScriptVisitor } from './compiled/src/expressionParser/DimensionScriptVisitor';
import { Expression } from './expression';
import { BinaryExpression, BinaryOperator } from './binaryExpression';
import { UnaryExpression, UnaryOperator } from './unaryExpression';
import { VariableExpression, VariableLiteral } from './variableExpression';
import { ConstantExpression, ConstantLiteral } from './constantExpression';
import { ErrorExpression } from './errorExpression';

type AggregateResult = [hasError: boolean, expression: Expression];

class ExpressionVisitor
  extends AbstractParseTreeVisitor<AggregateResult>
  implements DimensionScriptVisitor<AggregateResult> {
  // eslint-disable-next-line class-methods-use-this
  defaultResult(): AggregateResult {
    throw Error('Cannot infer a default expression. Investigate why "visitInput" was not called instead.');
  }

  visitInput(context: InputContext): AggregateResult {
    const [hasError, parsedExpression] = this.visitExpression(context._singleExpression);
    const resultExpression = (hasError && !(parsedExpression instanceof ErrorExpression))
      ? new ErrorExpression({
        input: parsedExpression.input,
        expression: parsedExpression,
      })
      : parsedExpression;

    return [hasError, resultExpression];
  }

  visitExpression(context: ExpressionContext): AggregateResult {
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
        return [
          false,
          new VariableExpression({
            input,
            variableLiteral: context._variableLiteral.text as VariableLiteral,
          }),
        ];
      }
      case '_constantLiteral' in context: {
        return [
          false,
          new ConstantExpression({
            input,
            constantLiteral: context._constantLiteral.text as ConstantLiteral,
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

export const parseExpression = (dimensionScript: string) => {
  const lexer = new DimensionScriptLexer(CharStreams.fromString(dimensionScript));
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new DimensionScriptParser(tokenStream);
  const tree = parser.input();
  const expressionVisitor = new ExpressionVisitor();
  const [, parsedExpression] = expressionVisitor.visit(tree);
  return parsedExpression;
};
