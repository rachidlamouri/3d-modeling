import { parseModel } from '../modelParser/jscad';
import { Thing } from './thing';

export const main = () => (
  parseModel(new Thing({}))
);
