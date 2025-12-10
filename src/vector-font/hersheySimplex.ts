/**
 * Custom font for Text3D component
 */

import fs from 'fs';
import { Vector2D, Vector2DLike, Vector2DTuple } from '../modeling';

export type Vector2 = [number, number];

type CharacterVectorParams = {
  character: string;
  width: number;
  points: Vector2DLike[];
  segments: { start: Vector2DLike; end: Vector2DLike }[];
  polygons: Vector2DLike[][];
};

export class CharacterVector {
  character: string;
  /**
   * @note the width of a character is not the same as the distance between the
   * leftmost and rightmost x coordinates. You can see this with the " " character
   */
  width: number;
  points: Vector2D[];
  segments: { start: Vector2D; end: Vector2D }[];
  polygons: Vector2D[][];

  constructor(params: CharacterVectorParams) {
    this.character = params.character;
    this.width = params.width;
    this.points = params.points.map((point) => new Vector2D(...point.value));
    this.segments = params.segments.map((segment) => ({
      start: new Vector2D(...segment.start.value),
      end: new Vector2D(...segment.end.value),
    }));
    this.polygons = params.polygons.map((polygon) =>
      polygon.map((point) => new Vector2D(...point.value)),
    );
  }

  scale(factor: number): CharacterVector {
    const scaledPoints = this.points.map((point) => {
      return new Vector2DLike(point.scale(factor));
    });
    const scaledSegments = this.segments.map((segment) => ({
      start: new Vector2DLike(segment.start.scale(factor)),
      end: new Vector2DLike(segment.end.scale(factor)),
    }));
    const scaledPolygons = this.polygons.map((polygon) =>
      polygon.map((point) => new Vector2DLike(point.scale(factor))),
    );

    return new CharacterVector({
      character: this.character,
      width: this.width * factor,
      points: scaledPoints,
      segments: scaledSegments,
      polygons: scaledPolygons,
    });
  }
}

export type VectorFont = {
  minimumFontSize: number;
  descenderY: number;
  characters: {
    [character: string]: CharacterVector;
  };
};

const text = fs.readFileSync(
  'src/vector-font/hersheySimplexVectorFont.json',
  'utf-8',
);
// it would probably be better if this was parsed with zod, but I don't care
const data = JSON.parse(text);

const { minimumFontSize, characters } = data;

const entries = Object.entries(characters).map(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we can fix this when we use zod
  ([character, unknownData]: [string, any]) => {
    const characterVector = new CharacterVector({
      character,
      width: unknownData.width,
      points: unknownData.points.map(
        (point: Vector2DTuple) => new Vector2DLike(point),
      ),
      segments: unknownData.segments.map(
        (segment: { start: Vector2DTuple; end: Vector2DTuple }) => ({
          start: new Vector2DLike(segment.start),
          end: new Vector2DLike(segment.end),
        }),
      ),
      polygons: unknownData.polygons.map((polygon: Vector2DTuple[]) =>
        polygon.map((point: Vector2DTuple) => new Vector2DLike(point)),
      ),
    });

    return [character, characterVector] as const;
  },
);

const yCoordinates = entries
  .flatMap((entry) => entry[1].points)
  .map((point) => point.y);

const descenderY = Math.min(...yCoordinates);

const vectorFont: VectorFont = {
  minimumFontSize,
  descenderY,
  characters: Object.fromEntries(entries),
};

export const hersheySimplex = vectorFont;
