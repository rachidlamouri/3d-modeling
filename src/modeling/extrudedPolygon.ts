import { CommonModel3DParams } from './model3D';
import { PrimitiveModel3D } from './primitiveModel3D';
import { Vector3D } from './vector';

export type Point2D = [number, number];

type ExtrudedPolygonParams =
  CommonModel3DParams
  & {
    boundingBox: Vector3D;
    points: Point2D[];
    lengthZ: number;
  }

export class ExtrudedPolygon extends PrimitiveModel3D {
  boundingBox: Vector3D;
  points: Point2D[];
  lengthZ: number;

  constructor({
    boundingBox,
    points,
    lengthZ,
    translation = {},
    rotations = [],
  }: ExtrudedPolygonParams) {
    super({
      position: new Vector3D(0, 0, 0),
      translation,
      rotations,
    });

    this.boundingBox = boundingBox;
    this.points = points;
    this.lengthZ = lengthZ;
  }
}
