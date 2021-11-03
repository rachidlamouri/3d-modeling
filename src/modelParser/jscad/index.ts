import * as jscad from '@jscad/modeling';
import type { Geom3 } from '@jscad/modeling/src/geometries/geom3';

import {
  PrimitiveModel3D,
  Model3D,
  CompoundModel3D,
  RectangularPrism,
  Cylinder,
  Subtraction,
  Operation3D,
  NoOp3D,
  Union,
  ModelCollection3D,
} from '../../modeling';
import { Vector3DTuple } from '../../modeling/vector';

const {
  primitives: { cuboid, cylinder },
  booleans: { subtract, union },
  transforms: { translate, rotate },
  utils: { degToRad },
} = jscad;

const parsePrimitiveModel = (model: PrimitiveModel3D) => {
  if (model instanceof RectangularPrism) {
    return cuboid({
      center: model.positionTuple,
      size: model.sizeTuple,
    });
  }

  if (model instanceof Cylinder) {
    return cylinder({
      center: model.positionTuple,
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

  if (operation instanceof NoOp3D) {
    return parseModel3D(operation.model); // eslint-disable-line no-use-before-define
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
    parsedModel = translate(model.translationTuple, parsedModel);
  }

  if (parsedModel === null) {
    throw Error(`Unhandled ${Model3D.name}: ${model.constructor.name}`);
  }

  return model.rotations
    .flatMap((rotation) => [
      (nextParsedModel: Geom3) => translate(rotation.offset, nextParsedModel),
      (nextParsedModel: Geom3) => rotate(rotation.angles.map((degToRad)) as Vector3DTuple, nextParsedModel),
      (nextParsedModel: Geom3) => translate(
        rotation.offset.map((value) => -value) as Vector3DTuple,
        nextParsedModel,
      ),
    ])
    .reduce(
      (nextParsedModel, transformation) => transformation(nextParsedModel),
      parsedModel,
    );
};

export const parseModel = (model: Model3D | ModelCollection3D): Geom3 | Geom3[] => {
  if (model instanceof ModelCollection3D) {
    return model.models.map((submodel) => parseModel3D(submodel));
  }

  return parseModel3D(model);
}
