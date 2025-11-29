import { CommonModel3DParams } from './model3D';
import { PrimitiveModel3D } from './primitiveModel3D';
import { Point2D, Vector3D } from './vector';

type ExtrudedPolygonParams = CommonModel3DParams & {
  // TODO: figure out what bounding box is and why it's a vector 3d
  boundingBox: Vector3D;
  points: Point2D[];
  lengthZ: number;
};

export class ExtrudedPolygon extends PrimitiveModel3D {
  boundingBox: Vector3D;
  points: Point2D[];
  lengthZ: number;

  constructor({
    name = 'Extruded Polygon',
    boundingBox,
    points,
    lengthZ,
    transforms = [],
  }: ExtrudedPolygonParams) {
    super({
      name,
      position: new Vector3D(0, 0, 0),
      transforms,
    });

    this.boundingBox = boundingBox;
    this.points = points;
    this.lengthZ = lengthZ;
  }
}
