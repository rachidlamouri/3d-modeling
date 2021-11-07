import { Vector3D } from './vector';

export abstract class Transform3D {}

export type TransformState = [position: Vector3D, transform: Transform3D];
