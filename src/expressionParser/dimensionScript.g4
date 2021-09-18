grammar dimensionScript;

input: parenthesizedExpressionNode=expression EOF;

expression:
  '(' parenthesizedExpressionNode=expression ')'
  | leftExpressionNode=expression operatorNode=('*' | '/') rightExpressionNode=expression
  | leftExpressionNode=expression operatorNode=('+' | '-') rightExpressionNode=expression
  | operatorNode=('+' | '-') unaryExpressionNode=expression
  | variableNameNode=LABEL
  | constantNode=NUMBER
  ;

LABEL: [a-z]+ ([A-z]|[0-9])* ;

NUMBER:
  DIGIT* '.' DIGIT+
  | DIGIT+
  ;

DIGIT: [0-9];

WS : [ \t\r\n]+ -> skip ;
