/* eslint import/no-extraneous-dependencies: "warn" */

import _ from 'lodash';
import antlr4 from 'antlr4';
import Lexer from './compiled/src/expressionParser/dimensionScriptLexer.js';
import Parser from './compiled/src/expressionParser/dimensionScriptParser.js';
import { BinaryExpression } from './binaryExpression.js';
import { ConstantExpression } from './constantExpression.js';
import { UnaryExpression } from './unaryExpression.js';
import { VariableExpression } from './variableExpression.js';

class Visitor {
  visitChildren(context) {
    if (context.parenthesizedExpressionNode !== null) {
      return context.parenthesizedExpressionNode.accept(this);
    }

    const properties = _([
      ['leftExpressionNode', 'leftExpression', true],
      ['rightExpressionNode', 'rightExpression', true],
      ['unaryExpressionNode', 'expression', true],
      ['operatorNode', 'operator', false],
      ['variableNameNode', 'variableName', false],
      ['constantNode', 'constantValue', false],
    ])
      .map(([nodeName, parsedNodeName, isExpression]) => {
        const node = context[nodeName];
        if (!node) {
          return null;
        }

        const key = parsedNodeName;
        const value = isExpression ? node.accept(this) : node.text;
        return [key, value];
      })
      .reject(_.isNull)
      .fromPairs()
      .value();

    const [, ExpressionClass] = [
      ['constantValue', ConstantExpression],
      ['variableName', VariableExpression],
      ['leftExpression', BinaryExpression],
      ['expression', UnaryExpression],
    ]
      .find(([propertyName]) => propertyName in properties);

    return new ExpressionClass({
      input: context.getText(),
      ...properties,
    });
  }
}

export const parseExpression = (expressionString) => {
  const chars = new antlr4.InputStream(expressionString);
  const lexer = new Lexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new Parser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.input();

  const parsedExpression = tree.accept(new Visitor());
  return parsedExpression;
};
