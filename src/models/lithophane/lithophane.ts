import fs from 'fs';
import _ from 'lodash';
import jpeg from 'jpeg-js';
import {
  ModelCollection3D,
  ExtrudedPolygon,
  Point2D,
  Vector3DObject,
  Vector3D,
  Rotation,
  Translation,
} from '../../modeling';

type LithophaneSliceParams = {
  maxHeight: number;
  offsetY: number;
  sliceLengthY: number;
  fullLengthX: number;
  points: Point2D[];
  translation: Partial<Vector3DObject>;
};

class LithophaneSlice extends ExtrudedPolygon {
  constructor({
    fullLengthX,
    offsetY,
    sliceLengthY,
    maxHeight,
    points,
    translation,
  }: LithophaneSliceParams) {
    super({
      boundingBox: new Vector3D(fullLengthX, maxHeight, sliceLengthY),
      points,
      lengthZ: sliceLengthY,
      transforms: [
        new Rotation({ x: 90 }, 'self'),
        new Translation({
          x: fullLengthX / 2 + (translation.x ?? 0),
          y: -((sliceLengthY / 2) + (offsetY * sliceLengthY)) + (translation.y ?? 0),
          z: maxHeight / 2 + (translation.z ?? 0),
        }),
      ],
    });
  }
}

export type LithophaneParams = {
  filename: string;
  pixelStartX: number;
  pixelStartY: number;
  pixelLengthX: number;
  pixelLengthY: number;
  lengthX: number;
  lengthY: number;
  minLengthZ: number;
  maxLengthZ: number;
};

export class Lithophane extends ModelCollection3D {
  constructor({
    filename,
    pixelStartX,
    pixelStartY,
    pixelLengthX,
    pixelLengthY,
    lengthX,
    lengthY,
    minLengthZ,
    maxLengthZ,
  }: LithophaneParams) {
    if (!fs.existsSync(filename)) {
      throw Error(`File "${filename}" does not exist`);
    }

    const jpegData = fs.readFileSync(filename);
    const image = jpeg.decode(jpegData, { useTArray: true });

    const normalizedMinValue = minLengthZ / maxLengthZ;
    pixelLengthX = Math.min(pixelLengthX, image.width - pixelStartX); // eslint-disable-line no-param-reassign
    pixelLengthY = Math.min(pixelLengthY, image.height - pixelStartY); // eslint-disable-line no-param-reassign
    const lengthPerPixelX = lengthX / pixelLengthX;
    const lengthPerPixelY = lengthY / pixelLengthY;
    const totalSelectedPixels = pixelLengthX * pixelLengthY;

    const rgbaPixels = _.chunk(image.data, 4);
    const rgbPixels = rgbaPixels.map((rgbaPixel) => rgbaPixel.slice(0, 3));
    const normalizedPixels = rgbPixels.map((rgbPixel) => _.mean(rgbPixel) / 255);
    const negatedPixels = normalizedPixels.map((normalizedPixel) => Math.max(1 - normalizedPixel, normalizedMinValue));
    const pixelRows = _.chunk(negatedPixels, image.width)
      .slice(pixelStartY, pixelStartY + pixelLengthY)
      .map((row) => row.slice(pixelStartX, pixelStartX + pixelLengthX));

    const models = pixelRows.map((rowPixels, row) => {
      const points: Point2D[] = [
        [0, 0],
      ];

      rowPixels.forEach((pixelValue, column) => {
        const pixelNumber = row * pixelLengthX + column;
        const percentProcessed = pixelNumber / totalSelectedPixels;
        process.stdout.write(`\rProcessing "${filename}" ${image.width}x${image.height}: ${(percentProcessed * 100).toFixed(2)}`);

        const lastPoint = _.last(points) as Point2D;
        if (lastPoint[1] !== pixelValue) {
          points.push([column, pixelValue]);
        }

        points.push([(column + 1), pixelValue]);
      });

      if (row === rowPixels.length - 1) {
        process.stdout.write('\n');
      }

      points.push([pixelLengthX, 0]);
      points.reverse();

      return points;
    })
      .map((points) => points.map(([x, z]) => [x * lengthPerPixelX, z * maxLengthZ]) as [number, number][])
      .map((scaledPoints, index) => new LithophaneSlice({
        fullLengthX: lengthX,
        offsetY: index,
        sliceLengthY: lengthPerPixelY,
        maxHeight: maxLengthZ,
        points: scaledPoints,
        translation: {
          x: -lengthX / 2,
          y: lengthY / 2,
        },
      }));

    super(models);
  }
}
