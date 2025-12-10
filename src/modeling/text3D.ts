/**
 * @file
 *
 * @note The word "point" in this file refers to an (x,y) coordinate in 2D
 * space, and not the unit of measurement (1/72 of an inch).
 */

import { hersheySimplex } from '../vector-font/hersheySimplex';
import { CompoundModel3D } from './compoundModel3D';
import { Cylinder } from './cylinder';
import { ExtrudedPolygon } from './extrudedPolygon';
import { ModelList } from './operation3D';
import { RectangularPrism } from './rectangularPrism';
import { Transform3D } from './transform3D';
import { Translation } from './translation';
import { Union } from './union';
import { Vector2D, Vector2DTuple, Vector3D } from './vector';

const vectorFont = hersheySimplex;

type ScaledCharacter = {
  character: string;
  offsetX: number;
  scaledWidthStroked: number;
  hasGeometry: boolean;
  scaledPoints: Vector2D[];
  scaledSegments: {
    start: Vector2D;
    end: Vector2D;
  }[];
  scaledPolygons: Vector2D[][];
};

type Text3DDimensionsParams = {
  text: string;
  fontSize: number;
  strokeWidth: number;
  letterSpacing: number;
  lengthZ: number;
};

// TODO: stroke width affects font size and character width
export class Text3DDimensions {
  text: string;
  strokeWidth: number;
  characters: ScaledCharacter[];
  descenderLengthY: number;
  lengthX: number;
  lengthY: number;
  lengthZ: number;

  constructor(params: Text3DDimensionsParams) {
    /**
     * Terminology
     *   - <x>Unstroked: the measurement of "x" that does not account for stroke width
     *   - <x>Stroked: the measurement of "x" that accounts for stroke width
     */

    const {
      text,
      fontSize: fontSizeStroked,
      strokeWidth,
      letterSpacing = 0,
      lengthZ,
    } = params;

    const pointWidthStroked = strokeWidth;
    const halfPointWidthStroked = pointWidthStroked / 2;

    // The printed font size must account for the stroke width (half on top and half on bottom).
    //    The point vectors should scale with fontSizeUnstroked so that when we add the stroke around them they match fontSizeStroked
    const fontSizeUnstroked = fontSizeStroked - 2 * halfPointWidthStroked;

    let accumulatedWidthStroked = 0;

    const letterDimensions = text.split('').map((character, index) => {
      const characterVector = vectorFont.characters[character];
      if (characterVector === undefined) {
        throw new Error(`Character "${character}" not found in vector font`);
      }

      const scaledWidthUnstroked = characterVector.width * fontSizeUnstroked;

      const scaledWidthStroked =
        halfPointWidthStroked + scaledWidthUnstroked + halfPointWidthStroked;

      const scaledPoints = characterVector.points.map((point) => {
        return point.scale(fontSizeUnstroked);
      });

      const scaledSegments = characterVector.segments.map((segment) => ({
        start: segment.start.scale(fontSizeUnstroked),
        end: segment.end.scale(fontSizeUnstroked),
      }));

      const scaledPolygons = characterVector.polygons.map((polygon) => {
        return polygon.map((point) => point.scale(fontSizeUnstroked));
      });

      // letter spacing is agnositic to stroke width
      const nextLetterSpacing = index === 0 ? 0 : letterSpacing;

      // The distance from where the character is rendered by default to its final position as measured from the vector point (not the stroke edge).
      //   For example, if we assume that the bottom left point of "A" renders at (0, 0) then xOffset would be halfPointWidthStroked
      const offsetX =
        accumulatedWidthStroked + nextLetterSpacing + halfPointWidthStroked;

      accumulatedWidthStroked += nextLetterSpacing + scaledWidthStroked;

      const letter: ScaledCharacter = {
        character,
        offsetX,
        scaledWidthStroked,
        hasGeometry: scaledPoints.length > 0,
        scaledPoints,
        scaledSegments,
        scaledPolygons,
      };

      return letter;
    });

    this.text = text;
    this.strokeWidth = strokeWidth;

    this.characters = letterDimensions;
    this.descenderLengthY = -vectorFont.descenderY * fontSizeUnstroked;
    this.lengthX = accumulatedWidthStroked;
    this.lengthY = fontSizeStroked;
    this.lengthZ = lengthZ;
  }
}

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
  precomputedDimensions: Text3DDimensions;
  transforms?: Transform3D[];
  debug?: boolean;
};

// TODO: when we scale by font size we need to take the starting font size into consideration
// TODO: make a helper function to compute width and height based on fontSize and letterSpacing
// TODO: why is comma messed up but semicolon is fine
export class Text3D extends CompoundModel3D {
  // TODO: figure out how to calculate height taking ascenders and descenders into consideration
  // TODO: make an "origin"-like parameter that determines if the baseline or bottom correspond to y=0
  // TODO: calculate line height, ascender, descender etc
  //   readonly height: number;

  constructor({
    name = 'Text3D',
    precomputedDimensions: {
      strokeWidth,
      characters,
      descenderLengthY,
      lengthX,
      lengthY,
      lengthZ,
    },
    transforms = [],
    debug = false,
  }: Text3DParams) {
    super(
      new Union({
        name,
        models: [
          new Union({
            name,
            models: characters
              .filter((character) => {
                return character.hasGeometry;
              })
              .map(
                ({
                  character,
                  scaledPoints,
                  scaledSegments,
                  scaledPolygons,
                  offsetX,
                }) => {
                  return new Union({
                    name: `Character "${character}"`,
                    models: [
                      ...scaledPoints.map((scaledPoint) => {
                        return new Cylinder({
                          name: `Point at (${scaledPoint.x}, ${scaledPoint.y})`,
                          origin: 'bottom',
                          axis: 'z',
                          axialLength: lengthZ,
                          diameter: strokeWidth,
                          transforms: [
                            new Translation({
                              x: scaledPoint.x,
                              y: scaledPoint.y,
                            }),
                          ],
                        });
                      }),
                      ...scaledSegments.map((segment) => {
                        const outlinePath = lineToRectangleOutlinePath(
                          segment.start.tuple,
                          segment.end.tuple,
                          strokeWidth,
                        );

                        return new ExtrudedPolygon({
                          name: `Segment from (${segment.start.x}, ${segment.start.y}) to (${segment.end.x}, ${segment.end.y})`,
                          boundingBox: new Vector3D(0, 0, 0),
                          points: outlinePath,
                          lengthZ,
                        });
                      }),
                      ...scaledPolygons.flatMap((polygon, polygonIndex) => {
                        return new ExtrudedPolygon({
                          name: `Polygon ${polygonIndex}`,
                          boundingBox: new Vector3D(0, 0, 0),
                          points: polygon.map((point) => point.tuple),
                          lengthZ,
                        });
                      }),
                    ] as unknown as ModelList,
                    transforms: [
                      new Translation({
                        x: offsetX,
                      }),
                    ],
                  });
                },
              ) as unknown as ModelList,
            transforms: [
              new Translation({
                // adjusts the baseline to account for stroke width
                y: strokeWidth / 2,
              }),
            ],
          }),
          ...(debug
            ? [
                new RectangularPrism({
                  name: 'Text DebugBox Box',
                  lengthX,
                  lengthY,
                  lengthZ,
                  origin: ['left', 'back', 'bottom'],
                  transforms: [
                    new Translation({
                      // move the rectangle down slightly so you can see the text
                      z: -0.1,
                      y: -descenderLengthY,
                    }),
                  ],
                }),
              ]
            : []),
        ],
        transforms: [
          new Translation({
            y: descenderLengthY,
          }),
          ...transforms,
        ],
      }),
    );
  }
}
