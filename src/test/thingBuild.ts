import { parseModel } from '../modelParser/jscad';
import { Thing } from './thing';

export const main = () => (
  parseModel(new Thing({
    reelDiameter: 60,
    reelHeight: 20,
    frameDiameter: 16,
  }))
);
