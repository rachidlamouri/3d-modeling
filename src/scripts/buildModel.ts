/* eslint-disable no-console */
import _ from 'lodash';
import { spawn } from 'child_process';
import fs from 'fs';

const [src] = process.argv.slice(2);

if (!src) {
  console.log('Usage: npm run build:model <build/src/path_to_model>');
  process.exit(1);
}

if (!fs.existsSync(src)) {
  console.log(`"${src}" does not exist`);
  process.exit(1);
}

if (!src || !/\.ts$/.test(src)) {
  console.log(`"${src}" is not a TypeScript file`);
  process.exit(1);
}

import(`../../${src}`).then(async (models) => {
  if (!models.default || !_.isPlainObject(models.default) || Object.keys(models.default).length === 0) {
    console.log(`"${src}" does not export a default object with at least one key`);
    process.exit(1);
  }

  const modelNames = Object.keys(models.default);

  for (let i = 0; i < modelNames.length; i += 1) {
    const modelName = modelNames[i];

    const outputPath = src.replace(/^src/, 'build/src').replace(/\.ts$/, `.${modelName}.stl`);
    const command = ['npx.cmd', 'jscad', 'scripts/loadModel.js', '--filepath', `${src}`, '--model', `${modelName}`, '-o', `${outputPath}`];

    // eslint-disable-next-line no-await-in-loop
    await new Promise<void>((resolve) => {
      const childProcess = spawn(command[0], command.slice(1));
      childProcess.stdout?.pipe(process.stdout);
      childProcess.stderr?.pipe(process.stderr);

      childProcess.on('exit', (exitCode) => {
        const description = exitCode === 0 ? 'Finished:' : 'Failed:';

        console.log(description, modelName);
        resolve();
      });
    });
  }
});
