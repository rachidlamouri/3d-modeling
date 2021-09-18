import { parseExpression } from './parseExpression.js';

// eslint-disable-next-line no-console
console.log(JSON.stringify(parseExpression('a + b - c / d * g').serialize(), null, 2));
