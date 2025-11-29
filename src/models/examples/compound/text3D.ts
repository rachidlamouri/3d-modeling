import { Text3D } from '../../../modeling/text3D';
import { hersheySimplex } from '../../../vector-font/hersheySimplex';

const text = Object.keys(hersheySimplex.characters).join('');
export default {
  uppercase: new Text3D({
    text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    strokeWidth: 10,
    fontSize: 5,
    lengthZ: 10,
  }),
  lowercase: new Text3D({
    text: 'abcdefghijklmnopqrstuvwxyz',
    strokeWidth: 10,
    fontSize: 5,
    lengthZ: 10,
  }),
  numbers: new Text3D({
    text: '0123456789',
    strokeWidth: 10,
    fontSize: 5,
    lengthZ: 10,
  }),
  punctuation: new Text3D({
    text: `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`,
    strokeWidth: 10,
    fontSize: 5,
    lengthZ: 10,
  }),
  all: new Text3D({
    text,
    strokeWidth: 10,
    fontSize: 5,
    lengthZ: 10,
  }),
};
