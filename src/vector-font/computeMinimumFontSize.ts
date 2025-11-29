/**
 * @file
 *
 * @note Some of the constants are based on my specific 3D printer capabilities,
 * as well as some arbitrary decisions on how many nozzle widths make a legible
 * character.
 *
 * @note The following observations and assumptions were used to calculate the minimum font size
 *
 * - The vector input is unitless
 * - The vector input uses integers, which means it can easily scale up or down as needed
 * - Font size is the distance between the ascender and descender lines
 * - Cap Height: "M" and other similar capital flat-top letters should all be at the same height
 * - Ascender Height: Distance from cap height to highest y coordinate
 * - Can we assume that "baseline" is a y of zero? (After implementation: yes the baseline is at y = 0)
 * - Descender height: distance from baseline to lowest y value (which should just be the lowest y value?)
 * - x height: well that's just the height of x lol (do we need this?)
 * - line height is baseline to baseline, so pick a minimum value where ascenders and descenders dont overlap
 *
 * Constraints:
 * - stroke width is limited by nozzle size
 * - the distance between each point in a closed loop to the center of the loop should be above some minimum value
 *   - this way the "counters" (letter holes) are visible and don't get filled in
 *   - we can print out some test circles to see what this value should be
 * - dots on i, j and various punctuation should have a minimum diameter
 *   - the vectors for these form circles
 *   - these circles should be treated differently than "counters" (letter holes), since they will be filled in
 *   - capture the geometry for these dots so we can just extrude a polygon instead of a series of lines
 *
 * Next steps:
 *   - assume the unitless vectors are now in mm
 *   - scale the vectors up or down by incrementing the font size by .1mm
 *     - repeat until you find a scale that satisfies all constraints
 *   - this is your minimum font size
 *   - save 3 files:
 *     - the original vector data: for posterity
 *     - the code to get the minimum mm vector data: for posterity
 *     - the scaled output minimum vector JSON data
 *   - import the saved scaled vector data and use it in Text3D's renderer
 */

import fs from 'fs';
import { normalizeHersheySimplex } from './normalizeHersheySimplex';
import { CharacterVector, VectorFont } from './hersheySimplex';
import { Vector2DTuple } from '../modeling';

const getDistance = (point1: Vector2DTuple, point2: Vector2DTuple) => {
  return Math.hypot(point2[0] - point1[0], point2[1] - point1[1]);
};

const getAverage = (list: number[]) => {
  return list.reduce((sum, value) => sum + value, 0) / list.length;
};

const normalizedCharacters = Object.values(normalizeHersheySimplex());

/** @note This is for my specific printer */
const nozzleDiameter = 0.4;

const nozzleRadius = nozzleDiameter / 2;

/** The smallest line thickness that the nozzle can produce: It's just the nozzle diameter */
const nozzleLineThickness = nozzleDiameter;

/** Minimum thickness of the character lines: two walls */
const minimumStrokeWidth = 2 * nozzleDiameter;

/**
 *  Minimum distance that a character segment must be: four times the minimum
 *  stroke width; so its a legible rectangle
 */
const minimumStrokeLength = 4 * minimumStrokeWidth;

/**
 *  Minimum space between two points: The stroke radius of the first point plus
 *  4 nozzle sized walls plus the stroke radius of the second point
 */
const minimumPointDistance =
  minimumStrokeWidth / 2 + 4 * nozzleLineThickness + minimumStrokeWidth / 2;

/**
 * Minimum distance between the center of a closure loop (open hole) and its
 * closest point. The geometry from the center point out to its closest ring of
 * points is a nozzle sized dot surrounded by 7 concentric circles each as thick
 * as the nozzle, plus one final outer circle with a thickness that is half the
 * minimum stroke width. So the radius is half the nozzle radius plus 7 nozzle
 * widths + half the minimum stroke width.
 */
const minimumClosureRadius =
  nozzleRadius + 7 * nozzleLineThickness + minimumStrokeWidth / 2;

/**
 * Minimum distance between the center of a tittle loop (filled dot) and its
 * closest point. The geometry from the center point out to its closest ring of
 * points is a nozzle sized dot surrounded by 4 concentric circles each as thick
 * as the nozzle. So the radius is the nozzle radius, plus 4 nozzle widths.
 */
const minimumTittleRadius = nozzleRadius + 4 * nozzleLineThickness;

let fontSize = 0;
let issues: unknown[] = [];
do {
  fontSize += nozzleDiameter;

  const scaledCharacters = normalizedCharacters.map((normalizedCharacter) => {
    const scaledCharacter = normalizedCharacter.scale(fontSize);
    return scaledCharacter;
  });

  issues = scaledCharacters.flatMap((scaledCharacter) => {
    const closureLoopRadii = scaledCharacter.closureLoops.map((loop) => {
      const points = [...loop];
      const centerPoint: Vector2DTuple = [
        getAverage(points.map((point) => point[0])),
        getAverage(points.map((point) => point[1])),
      ];

      const distances = points.map((point) => {
        const distance = getDistance(point, centerPoint);
        return distance;
      });

      const minDistance = Math.min(...distances);
      return { loop, minDistance };
    });

    // Make sure closure loops are big enough so they don't get filled on accident
    const closureLoopIssues = closureLoopRadii
      .filter(({ minDistance }) => minDistance < minimumClosureRadius)
      .map(({ minDistance, loop }) => {
        return {
          message: 'Closure too small',
          character: scaledCharacter.character,
          fontSize,
          minDistance,
          loop,
        };
      });

    const tittleLoopRadii = scaledCharacter.tittleLoops.map((loop) => {
      const points = [...loop];
      const centerPoint: Vector2DTuple = [
        getAverage(points.map((point) => point[0])),
        getAverage(points.map((point) => point[1])),
      ];

      const distances = points.map((point) => {
        const distance = getDistance(point, centerPoint);
        return distance;
      });

      const minDistance = Math.min(...distances);
      return { loop, minDistance };
    });

    // Make sure tittle loops are big enough so they have enough material when filled
    const tittleLoopIssues = tittleLoopRadii
      .filter(({ minDistance }) => minDistance < minimumTittleRadius)
      .map(({ minDistance, loop }) => {
        return {
          message: 'Tittle too small',
          character: scaledCharacter.character,
          fontSize,
          minDistance,
          loop,
        };
      });

    const segmentLengths = scaledCharacter.segments.map((segment) => {
      const segmentLength = getDistance(segment.start, segment.end);
      return {
        segment,
        segmentLength,
      };
    });

    // Make sure segments appear as lines
    const segmentIssues = segmentLengths
      .filter(({ segmentLength }) => segmentLength < minimumStrokeLength)
      .map(({ segment, segmentLength }) => {
        return {
          message: 'Segment too short',
          character: scaledCharacter.character,
          fontSize,
          segment,
          segmentLength,
        };
      });

    // Make sure points are not too close to one another
    const pointIssues: unknown[] = [];
    for (let index1 = 0; index1 < scaledCharacter.points.length; index1 += 1) {
      const point1 = scaledCharacter.points[index1];
      for (
        let index2 = index1 + 1;
        index2 < scaledCharacter.points.length;
        index2 += 1
      ) {
        const point2 = scaledCharacter.points[index2];
        const pointDistance = getDistance(point1, point2);
        if (pointDistance < minimumPointDistance) {
          pointIssues.push({
            message: 'Points too close',
            character: scaledCharacter.character,
            fontSize,
            point1,
            point2,
            distance: pointDistance,
          });
        }
      }
    }

    return [
      ...closureLoopIssues,
      ...tittleLoopIssues,
      ...pointIssues,
      ...segmentIssues,
    ];
  });
} while (issues.length > 0);

const roundNumber = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const minimumFontSize = roundNumber(fontSize, 1);

const vectorFontEntries = normalizedCharacters.map((normalizedCharacter) => {
  const characterVector: CharacterVector = {
    character: normalizedCharacter.character,
    width: normalizedCharacter.width,
    points: normalizedCharacter.points,
    segments: normalizedCharacter.segments,
    polygons: normalizedCharacter.polygons,
  };

  return [normalizedCharacter.character, characterVector] as const;
});

const characters = Object.fromEntries(vectorFontEntries);

const output: VectorFont = {
  minimumFontSize,
  characters,
};

const outputText = JSON.stringify(output, null, 2);

fs.writeFileSync('src/vector-font/hersheySimplexVectorFont.json', outputText);
