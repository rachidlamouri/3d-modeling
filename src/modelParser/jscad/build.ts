import fs from 'fs';
import { parseModel } from './index';

export const getParameterDefinitions = () => [
  { name: 'filepath', type: 'text', initial: '' },
  { name: 'model', type: 'text', initial: '' },
];

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

  const relativeFilePath = `../../../${filepath}`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
  const models = require(relativeFilePath);

  return parseModel(models.default[model]);
};
