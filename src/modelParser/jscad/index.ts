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
} from '../../modeling';

const {
  primitives: { cuboid, cylinder },
  booleans: { subtract, union },
  transforms: { translate, rotate },
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
      parseModel(operation.minuend), // eslint-disable-line no-use-before-define
      ...operation.subtrahends.map(parseModel), // eslint-disable-line no-use-before-define
    );
  }

  if (operation instanceof Union) {
    return union(
      ...operation.models.map(parseModel), // eslint-disable-line no-use-before-define
    );
  }

  if (operation instanceof NoOp3D) {
    return parseModel(operation.model); // eslint-disable-line no-use-before-define
  }

  throw Error(`Unhandled ${Operation3D.name}: ${operation.constructor.name}`);
};

export const parseModel = (model: Model3D): Geom3 => {
  let parsedModel;
  if (model instanceof PrimitiveModel3D) {
    parsedModel = parsePrimitiveModel(model);
  }

  if (model instanceof CompoundModel3D) {
    parsedModel = parseOperation(model.operation);
  }

  if (model instanceof Operation3D) {
    parsedModel = parseOperation(model);
  }

  if (!parsedModel) {
    throw Error(`Unhandled ${Model3D.name}: ${model.constructor.name}`);
  }

  if (model.hasRotation()) {
    parsedModel = translate(
      [
        -model.position.x,
        -model.position.y,
        -model.position.z,
      ],
      parsedModel,
    );
    parsedModel = rotate(model.rotationTupleRadians, parsedModel);
    parsedModel = translate(model.positionTuple, parsedModel);
  }

  if (model.hasTranslation()) {
    parsedModel = translate(model.translationTuple, parsedModel);
  }

  return parsedModel;
};
