grammar DimensionScript;

input: singleExpression=expression EOF;

expression:
  '(' parenthesizedExpression=expression ')'
  | leftExpression=expression operatorLiteral=('*' | '/') rightExpression=expression
  | leftExpression=expression operatorLiteral=('+' | '-') rightExpression=expression
  | operatorLiteral=('+' | '-') singleExpression=expression
  | variableLiteral=LABEL
  | constantLiteral=NUMBER
  ;

LABEL: [a-z] [a-zA-Z0-9]* ;

NUMBER:
  DIGIT* '.' DIGIT+
  | DIGIT+
  ;

DIGIT: [0-9];

WS : [ \t\r\n]+ -> skip ;
