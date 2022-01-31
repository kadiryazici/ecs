/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const root = process.cwd();

fs.renameSync(path.join(root, 'dist', 'ecs.cjs.js'), path.join(root, 'dist', 'ecs.cjs'));
fs.renameSync(path.join(root, 'dist', 'ecs.es.js'), path.join(root, 'dist', 'ecs.mjs'));
