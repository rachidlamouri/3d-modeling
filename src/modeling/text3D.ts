import { hersheySimplex, Vector2 } from '../vector-font/hersheySimplex';
import { CompoundModel3D } from './compoundModel3D';
import { Cylinder } from './cylinder';
import { ExtrudedPolygon } from './extrudedPolygon';
import { ModelList } from './operation3D';
import { Transform3D } from './transform3D';
import { Translation } from './translation';
import { Union } from './union';
import { Vector2DTuple, Vector3D } from './vector';

const lineToRectangleOutlinePath = (
  start: Vector2DTuple,
  end: Vector2DTuple,
  thickness: number,
): Vector2DTuple[] => {
  const lineDeltaX = end[0] - start[0];
  const lineDeltaY = end[1] - start[1];
  const lineLength = Math.hypot(lineDeltaX, lineDeltaY);
  const lineUnitVector = [lineDeltaX / lineLength, lineDeltaY / lineLength];

  const perpendicularUnitVector1 = [-lineUnitVector[1], lineUnitVector[0]];
  const perpendicularUnitVector2 = [lineUnitVector[1], -lineUnitVector[0]];

  const perpendicularLineMagnitude = thickness / 2;

  const perpendicularVector1 = [
    perpendicularUnitVector1[0] * perpendicularLineMagnitude,
    perpendicularUnitVector1[1] * perpendicularLineMagnitude,
  ];
  const perpendicularVector2 = [
    perpendicularUnitVector2[0] * perpendicularLineMagnitude,
    perpendicularUnitVector2[1] * perpendicularLineMagnitude,
  ];

  const firstPoint: Vector2DTuple = [
    start[0] + perpendicularVector1[0],
    start[1] + perpendicularVector1[1],
  ];
  const path: Vector2DTuple[] = [
    firstPoint,
    [start[0] + perpendicularVector2[0], start[1] + perpendicularVector2[1]],
    [end[0] + perpendicularVector2[0], end[1] + perpendicularVector2[1]],
    [end[0] + perpendicularVector1[0], end[1] + perpendicularVector1[1]],
    firstPoint,
  ];

  return path;
};

export type Text3DParams = {
  name?: string;
  text: string;
  strokeWidth: number;
  letterSpacing?: number;
  fontSize: number;
  lengthZ: number;
  transforms?: Transform3D[];
};

// TODO: when we scale by font size we need to take the starting font size into consideration
// TODO: make a helper function to compute width and height based on fontSize and letterSpacing
// TODO: why is comma messed up but semicolon is fine
export class Text3D extends CompoundModel3D {
  readonly text: string;
  readonly width: number;
  // TODO: figure out how to calculate height taking ascenders and descenders into consideration
  // TODO: make an "origin"-like parameter that determines if the baseline or bottom correspond to y=0
  // TODO: calculate line height, ascender, descender etc
  //   readonly height: number;
  readonly strokeWidth: number;
  readonly letterSpacing: number | undefined;
  readonly fontSize: number;
  readonly lengthZ: number;

  constructor({
    name = 'Text3D',
    text,
    strokeWidth,
    letterSpacing = 0,
    fontSize,
    lengthZ,
    transforms = [],
  }: Text3DParams) {
    if (fontSize < hersheySimplex.minimumFontSize) {
      throw new Error(
        `fontSize must be at least ${hersheySimplex.minimumFontSize}, but received ${fontSize}`,
      );
    }

    const scaleVector2 = (vector: Vector2): Vector2 => {
      return [vector[0] * fontSize, vector[1] * fontSize];
    };

    let accumulatedWidth = 0;
    const textMetadata = text.split('').map((character, index) => {
      const characterVector = hersheySimplex.characters[character];
      if (characterVector === undefined) {
        throw new Error(`Character "${character}" not found in vector font`);
      }

      const scaledWidth = characterVector.width * fontSize;
      const nextLetterSpacing = index === 0 ? 0 : letterSpacing;
      const xOffset = accumulatedWidth + nextLetterSpacing;

      accumulatedWidth += nextLetterSpacing + scaledWidth;

      return {
        characterVector,
        xOffset,
        scaledWidth,
      };
    });

    super(
      new Union({
        name,
        models: textMetadata
          .filter((metadata) => {
            return metadata.characterVector.points.length > 0;
          })
          .map(({ characterVector, xOffset }) => {
            const scaledPoints = characterVector.points.map((point) => {
              return scaleVector2(point);
            });

            const scaledSegments = characterVector.segments.map((segment) => ({
              start: scaleVector2(segment.start),
              end: scaleVector2(segment.end),
            }));

            const scaledPolygons = characterVector.polygons.map((polygon) => {
              return polygon.map((point) => scaleVector2(point));
            });

            return new Union({
              name: `Character "${characterVector.character}"`,
              models: [
                ...scaledPoints.map((scaledPoint) => {
                  return new Cylinder({
                    name: `Point at (${scaledPoint[0]}, ${scaledPoint[1]})`,
                    origin: 'bottom',
                    axis: 'z',
                    axialLength: lengthZ,
                    diameter: strokeWidth,
                    transforms: [
                      new Translation({
                        x: scaledPoint[0],
                        y: scaledPoint[1],
                      }),
                    ],
                  });
                }),
                ...scaledSegments.map((segment) => {
                  const outlinePath = lineToRectangleOutlinePath(
                    segment.start,
                    segment.end,
                    strokeWidth,
                  );

                  return new ExtrudedPolygon({
                    boundingBox: new Vector3D(0, 0, 0),
                    points: outlinePath,
                    lengthZ,
                  });
                }),
                ...scaledPolygons.flatMap((polygon, polygonIndex) => {
                  return new ExtrudedPolygon({
                    name: `Polygon ${polygonIndex} of character "${characterVector.character}"`,
                    boundingBox: new Vector3D(0, 0, 0),
                    points: polygon,
                    lengthZ,
                  });
                }),
              ] as unknown as ModelList,
              transforms: [new Translation({ x: xOffset })],
            });
          }) as unknown as ModelList,
        transforms: [
          new Translation({
            // adjusts the baseline to account for stroke width
            y: strokeWidth / 2,
          }),
          ...transforms,
        ],
      }),
    );

    this.text = text;
    this.width = accumulatedWidth;
    this.strokeWidth = strokeWidth;
    this.letterSpacing = letterSpacing;
    this.fontSize = fontSize;
    this.lengthZ = lengthZ;
  }
}
