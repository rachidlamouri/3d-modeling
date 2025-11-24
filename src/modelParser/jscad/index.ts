import * as jscad from '@jscad/modeling';
import type { Geom3 } from '@jscad/modeling/src/geometries/geom3';
import type { Vec3 } from '@jscad/modeling/src/maths/vec3';

import { VectorChar, VectorText, VectorTextOptions } from '@jscad/modeling/src/text';
import { Vec2 } from '@jscad/modeling/src/maths/vec2';
import {
  PrimitiveModel3D,
  Model3D,
  RectangularPrism,
  Cylinder,
  Subtraction,
  Operation3D,
  Union,
  ModelCollection3D,
  ExtrudedPolygon,
  Rotation,
  Transform3D,
  Translation,
  Vector3D,
} from '../../modeling';
import { Text3D } from '../../modeling/text3D';

const {
  primitives: { cuboid, cylinder, polygon },
  booleans: { subtract, union },
  transforms: { translate, rotate },
  utils: { degToRad },
  extrusions: { extrudeLinear },
  geometries: { path2, geom3, geom2 },
  text: { vectorText, vectorChar },
  maths: { line2, line3 },
} = jscad;

const parsePrimitiveModel = (model: PrimitiveModel3D): Geom3 => {
  if (model instanceof ExtrudedPolygon) {
    return translate(
      model.position.tuple,
      translate(
        model.boundingBox.tuple.map((value) => -value / 2) as Vec3,
        extrudeLinear(
          { height: model.lengthZ },
          polygon({
            points: model.points,
          }),
        ),
      ),
    );
  }

  if (model instanceof RectangularPrism) {
    return cuboid({
      center: model.position.tuple,
      size: model.size.tuple,
    });
  }

  if (model instanceof Cylinder) {
    return cylinder({
      center: model.position.tuple,
      height: model.lengthZ,
      radius: model.radius,
    });
  }

  if (model instanceof Text3D) {
    //  return cuboid({
    //   center: [0, 0, 0],
    //   size: [ 10, 10, 10 ],
    // });
    // const lineToRectangle = (a: Vec2, b: Vec2, thickness: number): Vec2[] => {
    //   const dx = b[0] - a[0];
    //   const dy = b[1] - a[1];
    //   const len = Math.hypot(dx, dy) || 1;
    //   const ux = -dy / len;
    //   const uy = dx / len;
    //   const off = thickness / 2;
    //   return [
    //     [a[0] + ux * off, a[1] + uy * off],
    //     [b[0] + ux * off, b[1] + uy * off],
    //     [b[0] - ux * off, b[1] - uy * off],
    //     [a[0] - ux * off, a[1] - uy * off],
    //   ];
    // };

    /** First and last vector should be the same */
    type RectangleOutlinePath = [Vec2, Vec2, Vec2, Vec2, Vec2];

    const lineToRectangleOutlinePath = (start: Vec2, end: Vec2, thickness: number):Vec2[] => {
      const lineDeltaX = end[0] - start[0];
      const lineDeltaY = end[1] - start[1];
      const lineLength = Math.hypot(lineDeltaX, lineDeltaY);
      const lineUnitVector = [lineDeltaX / lineLength, lineDeltaY / lineLength];

      const perpendicularUnitVector1 = [
        -lineUnitVector[1], lineUnitVector[0]];
      const perpendicularUnitVector2 = [
        lineUnitVector[1], -lineUnitVector[0]];

      // const perpendicularLineMagnitude = 1;
      const perpendicularLineMagnitude = thickness / 2;

      const perpendicularVector1 = [
        perpendicularUnitVector1[0] * perpendicularLineMagnitude,
        perpendicularUnitVector1[1] * perpendicularLineMagnitude,
      ];
      const perpendicularVector2 = [
        perpendicularUnitVector2[0] * perpendicularLineMagnitude,
        perpendicularUnitVector2[1] * perpendicularLineMagnitude,
      ];

      const firstPoint: Vec2 = [start[0] + perpendicularVector1[0], start[1] + perpendicularVector1[1]];
      const path: RectangleOutlinePath = [
        firstPoint,
        [start[0] + perpendicularVector2[0], start[1] + perpendicularVector2[1]],
        [end[0] + perpendicularVector2[0], end[1] + perpendicularVector2[1]],
        [end[0] + perpendicularVector1[0], end[1] + perpendicularVector1[1]],
        firstPoint,
      ];

      return path;
      // return [
      //   [start[0] + lineUnitVector[0], start[1] + lineUnitVector[1]],
      //   [start[0] + perpendicularUnitVector1[0], start[1] + perpendicularUnitVector1[1]],
      //   [start[0] + perpendicularUnitVector2[0], start[1] + perpendicularUnitVector2[1]],
      // ];
    };

    // const start:Vec2 = [0, 5]
    // const end:Vec2 = [10, 20]
    // const start:Vec2 = [0, 0]
    // const end:Vec2 = [-10, 20]
    // const rectangleOutlinePath = lineToRectangleOutlinePath(start, end, 1);
    // const x:Geom3 = extrudeLinear({height: 20}, polygon({points: rectangleOutlinePath}));
    // const x = [start, end, ...rectangleOutlinePath].map((point) => cylinder({
    //   center: [point[0], point[1], 10],
    //   height: 20,
    //   radius: 0.05,
    // }));
    // console.log(x)
    // return x;
    // return union(...x)
    // console.log('RECT', rectangleOutlinePath, x);

    type VectorTextOutlinePair = [Vec2, Vec2];

    // const strokeWidth = model.strokeWidth;
    // const lengthZ = model.lengthZ;
    // const fontSize = 20;
    const textOptions: VectorTextOptions = {height: model.fontSize}
    // note: when the key "letterSpacing" exists in textOptions, but the value
    // is undefined, it defaults to 0 causing the characters to render on top of
    // each other
    if (model.letterSpacing !== undefined) {
      textOptions.letterSpacing = model.letterSpacing;
    }
    const listOfPointLists = vectorText(textOptions, model.text)
    // const listOfPointLists = vectorText({ height: fontSize }, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')

    console.log('START', listOfPointLists);

    // type G = typeof nestedPoints[number]
    // console.log(nestedPoints)

    // console.log('A', nestedPoints);
    // console.log('B', nestedPoints.flat(1));

    const pairs = listOfPointLists.flatMap((pointList) => {
      const pairsSublist = pointList.map((start, index, list) => {
        const end = list[index + 1];

        if (end !== undefined) {
          const result: VectorTextOutlinePair = [start, end];
          return result;
        }

        return null;
      }).filter((pair): pair is VectorTextOutlinePair => pair !== null);
      // const pairs: VectorTextOutlinePair[] = [];
      // pointGroups.forEach((pointGroup, index) => {
      //   const nextPoint = pointGroups[index + 1];

      //   if (nextPoint !== undefined) {
      //     pairs.push([point, nextPoint]);
      //   }
      // })

      return pairsSublist;
    });

    console.log('PAIRS', pairs);

    const segments = pairs.map(([start, end]) => {
      const rectangleOutlinePath = lineToRectangleOutlinePath(start, end, model.strokeWidth);
      const rectangle = polygon({points: rectangleOutlinePath});
      // console.log(start, end, rectangleOutlinePath);
      const rectangularPrism = extrudeLinear(
        { height: model.lengthZ }, rectangle,
      );

      const startCylinder = cylinder({
        center: [start[0], start[1], model.lengthZ / 2],
        height: model.lengthZ,
        radius: model.strokeWidth / 2,
      });

      const endCylinder = cylinder({
        center: [end[0], end[1], model.lengthZ / 2],
        height: model.lengthZ,
        radius: model.strokeWidth / 2,
      });

      return [startCylinder, rectangularPrism, endCylinder] as const;
    });

    const geometries = segments.flat(1);

    // return geometries[1]

    console.log('GEOMETRIES', geometries.length);

    const geometry = union(
      ...geometries,
    );
    // const geometry = union(...listOfPointLists.flat(1).map((point) => cylinder({
    //   center: [point[0], point[1], lengthZ / 2],
    //   height: lengthZ,
    //   radius: stroke / 2,
    // })));

    return geometry;

    //     const geometries = nestedPoints.map((points) => {
    //       if (points.length === 2) {
    //         return points;
    //       }

    //       return points.flat(1);
    //     })
    //     .map((points) => {
    //       if (points.length !== 2) {
    //           throw new Error(`Unhandled number of points ${points.length}`);
    //       }

    //       return points
    //     })

    //     // .map((points, index) => {
    //     //   const result =  points.map((point) => [point[0], point[1]])
    //     //   return result
    //     // })

    //       .map((point, groupIndex) => {
    //         // console.log(points)
    //         // console.log(points.flat())
    //         if (point.length !== 2) {
    //           throw new Error(`Unhandled number of points ${point.length}`);
    //         }

    //         const initialRadius = 2;

    //  const [x, y] = point;
    //           const adjustedHeight = (groupIndex + 1) * (height);
    //           const innerResult = cylinder({
    //             center: [x, y, adjustedHeight / 2] as Vec3,
    //             height: adjustedHeight,
    //             radius: initialRadius - 0.05 * groupIndex + pointIndex + 0.1,

    //           });

    //         // const result = points.map((point, pointIndex) => {

    //         //   innerResult.color = [1, 0, 0, 1];
    //         //   return innerResult;
    //         // });

    //         const circle1 =

    //         return result;
    //       }).flat();

    // const geometries = letters.map((letterSegments) => {
    //   // if (letterSegments.length >= 3) {
    //   //   // filled polygon: convert points -> geom2 -> extrude
    //   //   const poly2 = path2.fromPoints({ closed: true},letterSegments);
    //   //   return extrudeLinear({ height }, poly2);
    //   // }

    //   // return null

    //   if (letterSegments.length === 2) {
    //     // stroke: make a thin rectangle around the segment and extrude
    //     const rect = lineToRectangle(letterSegments[0] , letterSegments[1], stroke);
    //     const poly2 = path2.fromPoints({ closed: true},rect);
    //     return extrudeLinear({ height }, poly2);
    //   }

    //   return null
    //   throw new Error('Bad data');
    // }).filter((geom): geom is Geom3 => geom !== null) ;

    // union the letters into one geometry and translate into place
    // const result = union(...geometries);
    // return result;
    // // const textPoints: VectorChar = vectorChar('A');
    // const textPoints = vectorText('ABCDEFGH')
    // // const textPoints = vectorText('HIJKLMNOP')
    // // const textPoints = vectorText('QRSTUVWXYZ')
    // const textPaths = textPoints.map((points) => {
    // //   const [first, second] = points
    // // const lineA = line2.create();
    // //      line2.fromPoints(lineA, first, second);
    // //     const geometry = extrudeLinear({height: 10})

    //   const [first, second] = points;
    //   const thickness = 2;

    //   return path2.fromPoints({ closed: true }, [
    //     first, second, [second[0] + thickness, second[1] + thickness],
    // [first[0] + thickness, first[1] + thickness]]);
    // });
    // // const textPoints = vectorText({ }, 'ABC');
    // // const idk = geom2.fromPoints(textPoints.segments.flat());
    // // const textPaths = textPoints.map((points) => path2.fromPoints({ closed: true }, points));
    // // const textPaths = path2.fromPoints({ closed: true }, textPoints.flat());
    // // const textPaths = textPoints.map((points) => path2.fromPoints({ closed: true }, points));
    // // const textPaths = textPoints.map((points) => {
    // //   if (points.length === 2) {
    // //     const [first, second] = points;
    // //     const line = line3.create();
    // //     return line3.fromPoints(line, [...first, 0], [...second, 0]);
    // //   }

    // //   const path = path2.fromPoints({ closed: true }, points);
    // //   return path;
    // // });
    // console.log(textPoints);
    // // // const validPoints: VectorText = textPoints
    // .map((points) => [...points, points[0]]); // textPoints.filter((points) => points.length >= 3)
    // // console.log(validPoints);
    // // const textPaths = textPoints.map((points) => path2.fromPoints({ closed: true }, points));
    // // console.log(textPaths);
    // // console.log(model.text, textPaths);

    // // const geometries = textPaths.map((path) => extrudeLinear({ height: 10 }, path));
    // const geometries = textPaths.map((path) => extrudeLinear({ height: 10 }, path));
    // const geometry= union(...geometries)
    // console.log(geom3.isA(geometry));

    // return geometry;
    // const q = translate([0, 0, 0], geometry)
    // console.log(geom3.isA(q))
    // return geometry;
  }

  throw Error(`Unhandled ${PrimitiveModel3D.name}: ${model.constructor.name}`);
};

const parseOperation = (operation: Operation3D) => {
  if (operation.type === Subtraction) {
    return subtract(
      ...operation.models.map(parseModel3D), // eslint-disable-line no-use-before-define
    );
  }

  if (operation.type === Union) {
    return union(
      ...operation.models.map(parseModel3D), // eslint-disable-line no-use-before-define
    );
  }

  throw Error(`Unhandled ${Operation3D.name}: ${operation.constructor.name}`);
};

const parseModel3D = (model: Model3D): Geom3 => {
  let parsedModel: Geom3 | null = null;

  if (model instanceof PrimitiveModel3D) {
    parsedModel = parsePrimitiveModel(model);
  }

  if (model instanceof Operation3D) {
    parsedModel = parseOperation(model);
  }

  if (parsedModel === null) {
    throw Error(`Unhandled ${Model3D.name}: ${model.constructor.name}`);
  }

  parsedModel = model.transformStates
    .flatMap(([position, transform]) => {
      if (transform instanceof Translation) {
        return (nextParsedModel: Geom3) => translate(transform.vector.tuple, nextParsedModel);
      }

      if (transform instanceof Rotation) {
        const offset = transform.center === 'self' ? position : new Vector3D(0, 0, 0);

        return [
          (nextParsedModel: Geom3) => translate(offset.invert().tuple, nextParsedModel),
          (nextParsedModel: Geom3) => rotate(transform.angles.tuple.map((degToRad)) as Vec3, nextParsedModel),
          (nextParsedModel: Geom3) => translate(offset.tuple, nextParsedModel),
        ];
      }

      throw Error(`Unhandled ${Transform3D.name}: ${transform.constructor.name}`);
    })
    .reduce(
      (nextParsedModel, transformation) => transformation(nextParsedModel),
      parsedModel,
    );

  return parsedModel;
};

export const parseModel = (model: Model3D | ModelCollection3D): Geom3 | Geom3[] => {
  if (model instanceof ModelCollection3D) {
    return model.models.map((submodel) => parseModel3D(submodel));
  }

  return parseModel3D(model);
};
