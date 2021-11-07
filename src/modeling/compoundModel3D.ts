import { Operation3D } from './operation3D';

export abstract class CompoundModel3D extends Operation3D {
  constructor(operation: Operation3D) {
    super({
      name: operation.name,
      type: operation.type,
      models: operation.models,
      transforms: operation.transforms,
    });
  }
}
