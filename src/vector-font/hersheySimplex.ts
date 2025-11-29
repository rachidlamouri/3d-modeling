/**
 * Custom font for Text3D component
 */

import fs from 'fs';

export type Vector2 = [number, number];

export type CharacterVector = {
  character: string;
  width: number;
  points: Vector2[];
  segments: { start: Vector2; end: Vector2 }[];
  polygons: Vector2[][];
};

export type VectorFont = {
  minimumFontSize: number;
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

export const hersheySimplex = data as VectorFont;
