import fs from 'fs';
import * as jscad from '@jscad/modeling';
import _ from 'lodash';
import jpeg from 'jpeg-js';

const jpegData = fs.readFileSync('image.jpg');
const image = jpeg.decode(jpegData, { useTArray: true });

const mmPerPixel = 0.1;
const minHeight = 0.1;
const totalPixels = image.width * image.height;
const pixels = _.chunk(image.data, 4)
  .map((pixel) => _.mean(pixel.slice(0, 3)) / 255)
  .map((value) => Math.abs(1 - value) + minHeight);
const pixelRows = _.chunk(pixels, image.width);

const {
  primitives: { polygon },
  transforms: { translate },
  extrusions: { extrudeLinear },
} = jscad;

export const main = () => {
  const layers = pixelRows.map((rowPixels, row) => {
    const points: [number, number][] = [
      [0, 0],
    ];

    rowPixels.forEach((pixelValue, column) => {
      const pixelNumber = row * image.width + column;
      const percentProcessed = pixelNumber / totalPixels;

      process.stdout.write(`\r${percentProcessed.toFixed(2)}`);

      const lastPoint = _.last(points);
      if (lastPoint !== undefined && lastPoint[1] !== pixelValue) {
        points.push([column * mmPerPixel, pixelValue]);
      }

      points.push([(column + 1) * mmPerPixel, pixelValue]);
    });

    points.push([image.width * mmPerPixel, 0]);
    points.reverse();

    return translate(
      [0, 0, row * mmPerPixel],
      extrudeLinear(
        { height: mmPerPixel },
        polygon({ points }),
      ),
    );
  });

  process.stdout.write('\n');

  return layers;
};
