import { Operation3D, CommonOperation3DParams } from './operation3D';

export class Subtraction extends Operation3D {
  constructor({
    name = 'Subtraction',
    models,
    transforms = [],
  }: CommonOperation3DParams) {
    super({
      name,
      type: Subtraction,
      models,
      transforms,
    });
  }
}
