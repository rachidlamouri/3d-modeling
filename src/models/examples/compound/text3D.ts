import assert from 'assert';
import { Text3D, Text3DDimensions } from '../../../modeling/text3D';
import { hersheySimplex } from '../../../vector-font/hersheySimplex';

const fontSizeMm = 10;
const strokeWidthMm = 0.8;
const lengthZMm = 2;
const letterSpacingMm = 1;

const uppercaseText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseText = 'abcdefghijklmnopqrstuvwxyz';
const numberText = '0123456789';
const punctuationText = ` !"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;

const characterSet = new Set([
  ...uppercaseText.split(''),
  ...lowercaseText.split(''),
  ...numberText.split(''),
  ...punctuationText.split(''),
]);

const allText = Object.keys(hersheySimplex.characters).join('');

allText.split('').forEach((character) => {
  assert.strictEqual(
    characterSet.has(character),
    true,
    `Character "${character}" is missing from the character set`,
  );
});

export default {
  fontSize: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      // this character has the highest ascender and lowest descender
      text: '#',
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
  }),
  debugBox: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      text: 'aB#ge',
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
    debug: true,
  }),
  space: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      text: 'abc def',
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
  }),
  uppercase: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
  }),
  lowercase: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      text: 'abcdefghijklmnopqrstuvwxyz',
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
  }),
  numbers: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      text: '0123456789',
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
  }),
  punctuation: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      text: `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`,
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
  }),
  all: new Text3D({
    precomputedDimensions: new Text3DDimensions({
      text: allText,
      fontSize: fontSizeMm,
      strokeWidth: strokeWidthMm,
      letterSpacing: letterSpacingMm,
      lengthZ: lengthZMm,
    }),
  }),
};
