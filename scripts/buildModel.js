/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

const _ = require('lodash');
const { exec } = require('child_process');

const [src] = process.argv.slice(2);

if (!src) {
  console.log('Usage: npm run build:model <build/src/path_to_model>');
  process.exit(1);
}

if (!src || !/^build\//.test(src)) {
  console.log(`"${src}" is not in the "build/" directory`);
  process.exit(1);
}

if (!src || !/\.js$/.test(src)) {
  console.log(`"${src}" is not a javascript file`);
  process.exit(1);
}

// eslint-disable-next-line import/no-dynamic-require
const models = require(`../${src}`);
if (!models.default || !_.isPlainObject(models.default) || Object.keys(models.default).length === 0) {
  console.log(`"${src}" does not export a default object with at least one key`);
  process.exit(1);
}

const modelNames = Object.keys(models.default);
modelNames.forEach((modelName) => {
  const childProcess = exec(`npx jscad build/src/modelParser/jscad/build.js --filepath ${src} --model ${modelName} -o ${src.replace(/\.js$/, `.${modelName}.stl`)}"`, {});
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);

  childProcess.on('exit', () => {
    console.log('Finished:', modelName);
  });
});
