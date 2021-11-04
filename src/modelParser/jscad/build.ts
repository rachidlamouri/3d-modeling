import fs from 'fs';
import { parseModel } from './index';

const ROOT_DIR = __dirname
  .replace(/\\/g, '/')
  .replace(/build\/src\/modelParser\/jscad$/, '');

export const getParameterDefinitions = () => {
  return [
    { name: 'filepath', type: 'text', initial: '' },
    { name: 'model', type: 'text', initial: '' },
  ]
}

export const main = ({ filepath, model }: { filepath: string, model :string }) => {
  if (!filepath) {
    throw Error('"filepath" is required');
  }

  if (!model) {
    throw Error('"model" is required');
  }

  if (!fs.existsSync(filepath)) {
    throw Error(`File "${filepath}" does not exist`);
  }

  const fullFilepath = `${ROOT_DIR}${filepath}`;
  const models = require(fullFilepath);

  return parseModel(models.default[model])
};
