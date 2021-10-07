import { parseExpression } from './parseExpression';

const variableNames = ['a', 'b', 'c', 'd', 'g'];

[
  '',
  '++',
  '+-',
  '1',
  '+1',
  '-1',
  '1 + 2',
  '1 - 2',
  '1 * 2',
  '1 / 2',
  '(a + b) * g',
  'a + b - c / d * g',
]
  .map((input) => parseExpression(input, variableNames))
  .map((parsedExpression) => {
    const simplifiedExpression = parsedExpression.simplify();

    return {
      parsedExpression,
      serialized: parsedExpression.serialize(),
      simplifiedExpression,
      simplifiedSerialized: simplifiedExpression.serialize(),
    };
  })
  .forEach(({
    parsedExpression,
    serialized,
    simplifiedExpression,
    simplifiedSerialized,
  }) => {
    /* eslint-disable no-console */
    console.log(`"${parsedExpression.input}"`);
    console.log('PARSED', JSON.stringify(parsedExpression, null, 2));
    console.log('SIMPLIFIED', JSON.stringify(simplifiedExpression, null, 2));
    console.log('SERIALIZED', serialized);
    console.log('SIMPLIFIED_SERIALIZED', simplifiedSerialized);
    console.log();
    /* eslint-enable no-console */
  });
