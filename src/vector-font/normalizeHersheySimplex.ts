import { Vector2DTuple } from '../modeling';
import { assertIsNotUndefined } from '../utils/assertIsNotUndefined';
import { hersheySimplexVectorFontConfig } from './hersheySimplexVectorFontConfig';

type PathSegment = {
  start: Vector2DTuple;
  end: Vector2DTuple;
};

type NormalizedHersheySimplexCharacterInput = {
  character: string;
  characterCode: number;
  /** The amount of horizontal space this character takes up in mm */
  width: number;
  /** Flattened list of all x,y coordinates ready for cylindrical extrusion */
  points: Vector2DTuple[];
  /** Flattened list of all path segments (point to point pairs) ready for rectangular extrusion */
  segments: PathSegment[];
  /**
   * List of point sequences ready for polygon extrusion
   * @note this is an unclosed set of points; the last point is implied to be connected to the first
   */
  polygons: Vector2DTuple[][];
  tittleLoops: Set<Vector2DTuple>[];
  /** The open holes in letters like in A and B */
  closureLoops: Set<Vector2DTuple>[];
  closedLoops: Set<Vector2DTuple>[];
};

const scaleVector2 = (
  vector: Vector2DTuple,
  scaleFactor: number,
): Vector2DTuple => {
  return [vector[0] * scaleFactor, vector[1] * scaleFactor];
};

class NormalizedHersheySimplexCharacter
  implements NormalizedHersheySimplexCharacterInput
{
  character: string;
  characterCode: number;
  width: number;
  points: Vector2DTuple[];
  segments: PathSegment[];
  polygons: Vector2DTuple[][];
  tittleLoops: Set<Vector2DTuple>[];
  closureLoops: Set<Vector2DTuple>[];
  closedLoops: Set<Vector2DTuple>[];

  constructor(input: NormalizedHersheySimplexCharacterInput) {
    this.character = input.character;
    this.characterCode = input.characterCode;
    this.width = input.width;
    this.points = input.points;
    this.segments = input.segments;
    this.polygons = input.polygons;
    this.tittleLoops = input.tittleLoops;
    this.closureLoops = input.closureLoops;
    this.closedLoops = input.closedLoops;
  }

  scale(scaleFactor: number): NormalizedHersheySimplexCharacter {
    return new NormalizedHersheySimplexCharacter({
      character: this.character,
      characterCode: this.characterCode,
      width: this.width * scaleFactor,
      points: this.points.map((point) => scaleVector2(point, scaleFactor)),
      segments: this.segments.map((segment) => ({
        start: scaleVector2(segment.start, scaleFactor),
        end: scaleVector2(segment.end, scaleFactor),
      })),
      polygons: this.polygons.map((polygon) =>
        polygon.map((point) => scaleVector2(point, scaleFactor)),
      ),
      tittleLoops: this.tittleLoops.map((loop) => {
        const scaledLoop = new Set<Vector2DTuple>(
          [...loop].map((point) => scaleVector2(point, scaleFactor)),
        );
        return scaledLoop;
      }),
      closureLoops: this.closureLoops.map((loop) => {
        const scaledLoop = new Set<Vector2DTuple>(
          [...loop].map((point) => scaleVector2(point, scaleFactor)),
        );
        return scaledLoop;
      }),
      closedLoops: this.closedLoops.map((loop) => {
        const scaledLoop = new Set<Vector2DTuple>(
          [...loop].map((point) => scaleVector2(point, scaleFactor)),
        );
        return scaledLoop;
      }),
    });
  }
}

const tittleConfig = new Set([
  'i',
  'j',
  '!',
  '?',
  ',',
  '.',
  ':',
  ';',
  "'",
  '"',
  '~',
  '{',
  '}',
]);

/**
 * Gathers point, segment, and loop metadata to allow computing a minimum font size.
 */
export const normalizeHersheySimplex = () => {
  const initialEntries = Object.entries(
    hersheySimplexVectorFontConfig.characterConfigByCharacterCode,
  )
    .map(([characterCodeText, inputConfig]) => {
      const characterCode = Number(characterCodeText);
      const character = String.fromCharCode(characterCode);
      return [character, characterCode, inputConfig] as const;
    })
    .map(([character, characterCode, inputConfig]) => {
      const [width, ...pathConfigs] = inputConfig;

      /** A series of points that make up one stroke */
      type Path = Vector2DTuple[];

      // Parse simplified path config "syntax" to build point data structures. The
      //   input config is sequences of number pairs delimited by undefined and
      //   all values are flattened into a single list
      const paths: Path[] = [];
      let nextPath: Path = [];
      let nextXCoordinate: number | null = null;
      [...pathConfigs, undefined].forEach((pathConfig) => {
        if (pathConfig !== undefined) {
          if (nextXCoordinate !== null) {
            nextPath.push([nextXCoordinate, pathConfig]);
            nextXCoordinate = null;
            return;
          }

          nextXCoordinate = pathConfig;

          return;
        }

        paths.push(nextPath);
        nextPath = [];
      });

      // Create a set of unique point object references for later by-reference comparisons
      const uniquePointByYByX = new Map<number, Map<number, Vector2DTuple>>();
      paths.flat().forEach((point) => {
        const [xCoordinate, yCoordinate] = point;

        const uniquePointByY =
          uniquePointByYByX.get(xCoordinate) ??
          new Map<number, Vector2DTuple>();

        // Initialize the point with a copy to prevent any point from "paths" being reference checked against a unique point
        const uniquePoint = uniquePointByY.get(yCoordinate) ?? [...point];

        uniquePointByY.set(yCoordinate, uniquePoint);

        uniquePointByYByX.set(xCoordinate, uniquePointByY);
      });

      const uniquePoints: Vector2DTuple[] = [
        ...uniquePointByYByX.values(),
      ].flatMap((submap) => {
        return [...submap.values()];
      });

      const getUniquePoint = (point: Vector2DTuple): Vector2DTuple => {
        const uniquePoint = uniquePointByYByX.get(point[0])?.get(point[1]);
        assertIsNotUndefined(uniquePoint);
        return uniquePoint;
      };

      // Create a set of unique PathSegment objects
      const uniqueSegmentByEndByStart = new Map<
        Vector2DTuple,
        Map<Vector2DTuple, PathSegment>
      >();
      paths
        .flatMap((path) => {
          const subsegments = path.map((start, index) => {
            const end: Vector2DTuple | undefined = path[index + 1];

            const uniqueStart = getUniquePoint(start);
            const uniqueEnd = end !== undefined ? getUniquePoint(end) : null;

            return {
              start: uniqueStart,
              end: uniqueEnd,
            };
          });

          return subsegments;
        })
        .filter((segment): segment is PathSegment => segment.end !== null)
        .forEach((segment) => {
          const uniqueSegmentByEnd =
            uniqueSegmentByEndByStart.get(segment.start) ??
            new Map<Vector2DTuple, PathSegment>();

          const uniqueSegment = uniqueSegmentByEnd.get(segment.end) ?? segment;

          uniqueSegmentByEnd.set(segment.end, uniqueSegment);

          uniqueSegmentByEndByStart.set(segment.start, uniqueSegmentByEnd);
        });

      const uniquePathSegments = [
        ...uniqueSegmentByEndByStart.values(),
      ].flatMap((submap) => [...submap.values()]);

      // Collect all unique points into a graph data structure where each point knows its neighbors
      //  so we can find the distance between nodes, which lets us find closed loops
      type GraphNode = {
        uniquePoint: Vector2DTuple;
        uniqueNeighbors: Set<Vector2DTuple>;
      };

      const graphNodeByPoint = new Map<Vector2DTuple, GraphNode>(
        uniquePoints.map((uniquePoint) => {
          const node: GraphNode = {
            uniquePoint,
            uniqueNeighbors: new Set(),
          };
          return [uniquePoint, node] as const;
        }),
      );

      const getGraphNode = (point: Vector2DTuple): GraphNode => {
        const node = graphNodeByPoint.get(point);
        assertIsNotUndefined(node);
        return node;
      };

      uniquePathSegments.forEach((segment) => {
        const startNode = graphNodeByPoint.get(segment.start);
        const endNode = graphNodeByPoint.get(segment.end);

        assertIsNotUndefined(startNode);
        assertIsNotUndefined(endNode);

        startNode.uniqueNeighbors.add(segment.end);
        endNode.uniqueNeighbors.add(segment.start);
      });

      /**
       * TODO: finding loops
       *
       * - The initial search space for a node is its neighboors, and any other
       *   node that has already traversed to this node. Example:
       * - find all paths that start and end on the same node and that don't touch
       *   the same node twice
       * - if a path starts and ends on the same point then its a closed loop
       * - deduplicate closed loops by only keeping the smallest path that has a
       *   unqiue set of points
       *   - eg: every point in the top loop of "8" will find the same closed loop
       *     just from different starting points
       * - idea: we don't have to check every single node (eg. think about "o")
       *   - when we find a closed loop, we can iterate over every node in that
       *     loop. If that node only has neighbors in the loop, then we can remove
       *     it from the search space
       */
      class ClosedLoopAccumulator {
        searchSpace: Set<Vector2DTuple>;
        /**
         *  A path of points where the last point is implied to be connected to the first
         */
        closedLoops: Set<Vector2DTuple>[] = [];

        constructor(public points: Iterable<Vector2DTuple>) {
          this.searchSpace = new Set(points);
        }

        add(closedLoopSet: Set<Vector2DTuple>) {
          const closedLoopList = [...closedLoopSet];
          const isDuplicate = this.closedLoops.some((existingLoop) => {
            return (
              closedLoopSet.size === existingLoop.size &&
              closedLoopList.every((point) => existingLoop.has(point))
            );
          });

          if (isDuplicate) {
            return;
          }

          this.closedLoops.push(closedLoopSet);
          this.optimizeSearchSpace(closedLoopSet);
        }

        /**
         * @note Only call this function on dead end paths or on loops.
         *
         * Dead end paths and loops form one continuous path, so we can ignore any
         *  points along the path that only have one or two neighbors, since those
         *  neighbors won't be part of any other path!
         */
        optimizeSearchSpace(path: Set<Vector2DTuple>) {
          [...path]
            .map((point) => {
              return getGraphNode(point);
            })
            .filter((node) => {
              return node.uniqueNeighbors.size <= 2;
            })
            .forEach((node) => {
              this.searchSpace.delete(node.uniquePoint);
            });
        }
      }

      class ClosedLoopFinder {
        private traverseRecursively(
          origin: Vector2DTuple,
          currentPoint: Vector2DTuple,
          traveledPath: Set<Vector2DTuple>,
          closedLoopAccumulator: ClosedLoopAccumulator,
        ) {
          traveledPath.add(currentPoint);

          const currentNode = getGraphNode(currentPoint);
          if (currentNode.uniqueNeighbors.size === 0) {
            throw new Error('Why do we have a node with no neighbors?');
          }

          const hasOneNeighbor = currentNode.uniqueNeighbors.size === 1;

          currentNode.uniqueNeighbors.forEach((neighbor) => {
            if (neighbor === origin && traveledPath.size >= 3) {
              // Found a closed loop
              closedLoopAccumulator.add(traveledPath);
              return;
            }

            if (neighbor === origin) {
              // This is an immediate neighbor of the origin, so it's just a line

              if (hasOneNeighbor) {
                // completely done!
                closedLoopAccumulator.optimizeSearchSpace(traveledPath);
              }

              return;
            }

            if (traveledPath.has(neighbor)) {
              // Already visited; not the origin; not a closed loop

              if (hasOneNeighbor) {
                // completely done!
                closedLoopAccumulator.optimizeSearchSpace(traveledPath);
              }

              return;
            }

            if (hasOneNeighbor) {
              this.traverseRecursively(
                origin,
                neighbor,
                traveledPath,
                closedLoopAccumulator,
              );
              return;
            }

            const pathCopy = new Set(traveledPath);
            this.traverseRecursively(
              origin,
              neighbor,
              pathCopy,
              closedLoopAccumulator,
            );
          });
        }

        findClosedLoops(points: Vector2DTuple[]): Set<Vector2DTuple>[] {
          const closedLoopAccumulator = new ClosedLoopAccumulator(points);

          points.forEach((origin) => {
            if (!closedLoopAccumulator.searchSpace.has(origin)) {
              return;
            }

            const traveledPath = new Set<Vector2DTuple>();
            const currentPoint = origin;

            this.traverseRecursively(
              origin,
              currentPoint,
              traveledPath,
              closedLoopAccumulator,
            );
          });

          const result = closedLoopAccumulator.closedLoops;
          return result;
        }
      }

      const closedLoopFinder = new ClosedLoopFinder();
      const uniqueClosedLoops = closedLoopFinder.findClosedLoops(uniquePoints);

      const hasTittle = tittleConfig.has(character);

      const polygons = hasTittle
        ? uniqueClosedLoops.map((loop) => [...loop])
        : [];

      const tittleLoops = hasTittle ? uniqueClosedLoops : [];
      const closureLoops = hasTittle ? [] : uniqueClosedLoops;

      const normalizedCharacter = new NormalizedHersheySimplexCharacter({
        character,
        characterCode,
        width,
        points: uniquePoints,
        segments: uniquePathSegments,
        polygons,
        tittleLoops,
        closureLoops,
        closedLoops: uniqueClosedLoops,
      });

      return [character, normalizedCharacter] as const;
    });

  const yCoordinates = initialEntries.flatMap((entry) => {
    const normalizedCharacter = entry[1];
    return normalizedCharacter.points.map((point) => point[1]);
  });

  const maximumAscender = Math.max(...yCoordinates);
  const minimumDescender = Math.min(...yCoordinates);

  const initialFontSize = maximumAscender - minimumDescender;

  // Scale all characters to have a consistent font size of 1 unit tall
  const normalizedEntries = initialEntries.map(
    ([character, normalizedCharacter]) => {
      const scaleFactor = 1 / initialFontSize;
      const scaledCharacter = normalizedCharacter.scale(scaleFactor);
      return [character, scaledCharacter] as const;
    },
  );

  const result: {
    [character: string]: NormalizedHersheySimplexCharacter;
  } = Object.fromEntries(normalizedEntries);
  return result;
};
