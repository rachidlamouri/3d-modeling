import { parseModel } from '../modelParser/jscad';
import { Frame } from './thing';

export const main = () => (
  parseModel(new Frame({
    filename: 'image.jpg',
    pixelStartX: 0,
    pixelStartY: 0,
    pixelLengthX: 160,
    pixelLengthY: 160,
    minLengthZ: 0.1,
    maxLengthZ: 2,
  }))
);
