import { parseModel } from '../modelParser/jscad';
import { Image } from './image';

export const main = () => (
  parseModel(new Image({
    filename: 'image.jpg',
    pixelStartX: 0,
    pixelStartY: 0,
    pixelLengthX: 160,
    pixelLengthY: 160,
    lengthX: 40,
    lengthY: 40,
    minLengthZ: 0.1,
    maxLengthZ: 2,
  }))
);
