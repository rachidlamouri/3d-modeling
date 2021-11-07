import { ExtrudedPolygon, Vector3D } from '../../../modeling';

export default {
  example: new ExtrudedPolygon({
    boundingBox: new Vector3D(10, 10, 2),
    points: [
      [0, 0],
      [10, 0],
      [8, 8],
      [5, 10],
      [2, 8],
    ],
    lengthZ: 2,
  }),
};
