import { RotationInput } from './model3D';
import { PrimitiveModel3D } from './primitiveModel3D';
import { Vector3DObject } from './vector';

export type Point2D = [number, number];

type ExtrudedPolygonParams = {
  boundingBox: Vector3DObject;
  points: Point2D[];
  lengthZ: number;
  translation?: Partial<Vector3DObject>;
  rotations?: RotationInput[];
}

export class ExtrudedPolygon extends PrimitiveModel3D {
  boundingBox: Vector3DObject;
  points: [number, number][];
  lengthZ: number;

  constructor({
    boundingBox,
    points,
    lengthZ,
    translation = {},
    rotations = [],
  }: ExtrudedPolygonParams) {
    super({
      position: [0, 0, 0],
      translation,
      rotations,
    });

    this.boundingBox = boundingBox;
    this.points = points;
    this.lengthZ = lengthZ;
  }
}
