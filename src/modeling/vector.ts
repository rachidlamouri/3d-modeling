export type Vector3DObject = {
  x: number;
  y: number;
  z: number;
}

export type Vector3DTuple = [x: number, y: number, z: number];

export type Vector3D = Vector3DObject | Vector3DTuple;

export const vector3DTupleToObject = ([x, y, z]: Vector3DTuple): Vector3DObject => ({ x, y, z });

export const vector3DObjectToTuple = ({ x, y, z }: Vector3DObject): Vector3DTuple => [x, y, z];
