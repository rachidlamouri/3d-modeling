import { PrimitiveModel3D } from './primitiveModel3D';
import { Transform3D } from './transform3D';
import { Vector3D } from './vector';

export type Text3DParams = {
  name?: string;
  text: string;
  strokeWidth: number;
  letterSpacing?: number
  fontSize: number;
  lengthZ: number;
  transforms?: Transform3D[];
}

export class Text3D extends PrimitiveModel3D {
readonly text: string
readonly strokeWidth: number;
readonly letterSpacing: number | undefined;
readonly fontSize: number;
readonly lengthZ: number;

constructor({
  name = 'Text3D', text, strokeWidth, letterSpacing, fontSize, lengthZ, transforms = [],
}: Text3DParams) {
  super({
    name,
    position: new Vector3D(0, 0, 0),
    transforms,
  });

  this.text = text;
  this.strokeWidth = strokeWidth;
  this.letterSpacing = letterSpacing;
  this.fontSize = fontSize;
  this.lengthZ = lengthZ;
}
}
