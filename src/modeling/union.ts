import { Operation3D, CommonOperation3DParams } from './operation3D';

export class Union extends Operation3D {
  constructor({
    name = 'Union',
    models,
    transforms = [],
  }: CommonOperation3DParams) {
    super({
      name,
      type: Union,
      models,
      transforms,
    });
  }
}
