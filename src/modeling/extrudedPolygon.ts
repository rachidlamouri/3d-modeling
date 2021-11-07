import { RotationInput } from './model3D';
import { PrimitiveModel3D } from './primitiveModel3D';
import { Vector3D, Vector3DObject } from './vector';

export type Point2D = [number, number];

type ExtrudedPolygonParams = {
  boundingBox: Vector3D;
  points: Point2D[];
  lengthZ: number;
  translation?: Partial<Vector3DObject>;
  rotations?: RotationInput[];
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
