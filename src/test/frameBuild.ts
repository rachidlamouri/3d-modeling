import { parseModel } from '../modelParser/jscad';
import { Frame } from './thing';

const imageParams = [
  {
    filename: 'image.jpg',
    pixelStartX: 0,
    pixelStartY: 0,
    pixelLengthX: 160,
    pixelLengthY: 160,
  },
  {
    filename: 'image1.jpg',
    pixelStartX: 0,
    pixelStartY: 0,
    pixelLengthX: 200,
    pixelLengthY: 200,
  },
  {
    filename: 'image2.jpg',
    pixelStartX: 0,
    pixelStartY: 0,
    pixelLengthX: 200,
    pixelLengthY: 200,
  },
  {
    filename: 'image3.jpg',
    pixelStartX: 0,
    pixelStartY: 0,
    pixelLengthX: 200,
    pixelLengthY: 200,
  },
  {
    filename: 'image4.jpg',
    pixelStartX: 0,
    pixelStartY: 0,
    pixelLengthX: 200,
    pixelLengthY: 200,
  },
];

export const main = () => (
  parseModel(new Frame(imageParams[0]))
);
