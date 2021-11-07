import * as jscad from '@jscad/modeling';
import type { Geom3 } from '@jscad/modeling/src/geometries/geom3';
import type { Vec3 } from '@jscad/modeling/src/maths/vec3';

import {
  PrimitiveModel3D,
  Model3D,
  CompoundModel3D,
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

const {
  primitives: { cuboid, cylinder, polygon },
  booleans: { subtract, union },
  transforms: { translate, rotate },
  utils: { degToRad },
  extrusions: { extrudeLinear },
} = jscad;

const parsePrimitiveModel = (model: PrimitiveModel3D) => {
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

  throw Error(`Unhandled ${PrimitiveModel3D.name}: ${model.constructor.name}`);
};

const parseOperation = (operation: Operation3D) => {
  if (operation instanceof Subtraction) {
    return subtract(
      parseModel3D(operation.minuend), // eslint-disable-line no-use-before-define
      ...operation.subtrahends.map(parseModel3D), // eslint-disable-line no-use-before-define
    );
  }

  if (operation instanceof Union) {
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

  if (model instanceof CompoundModel3D) {
    parsedModel = parseModel3D(model.operation);
  }

  if (model instanceof Operation3D) {
    parsedModel = parseOperation(model);
  }

  if (parsedModel === null) {
    throw Error(`Unhandled ${Model3D.name}: ${model.constructor.name}`);
  }

  parsedModel = model.transforms
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
