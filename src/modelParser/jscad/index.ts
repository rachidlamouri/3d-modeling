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
} from '../../modeling';

const {
  primitives: { cuboid, cylinder },
  booleans: { subtract },
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

const parseCompoundModel = (model: CompoundModel3D) => {
  if (model.operation instanceof Subtraction) {
    return subtract(
      parseModel(model.operation.minuend), // eslint-disable-line no-use-before-define
      ...model.operation.subtrahends.map(parseModel), // eslint-disable-line no-use-before-define
    );
  }

  throw Error(`Unhandled ${Operation3D.name}: ${model.operation.constructor.name}`);
};

export const parseModel = (model: Model3D): Geom3 => {
  if (model instanceof PrimitiveModel3D) {
    return parsePrimitiveModel(model);
  }

  if (model instanceof CompoundModel3D) {
    return parseCompoundModel(model);
  }

  throw Error(`Unhandled ${Model3D.name}: ${model.constructor.name}`);
};
