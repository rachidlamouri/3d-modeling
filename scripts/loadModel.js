/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

require('ts-node').register({ project: 'tsconfig.json' });

module.exports = require('../src/modelParser/jscad/build');
