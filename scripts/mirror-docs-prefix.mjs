import fs from 'node:fs';
import path from 'node:path';

const buildDir = path.resolve('build');
const mirrorDir = path.join(buildDir, 'docs');

if (!fs.existsSync(buildDir)) {
  throw new Error('Missing build directory. Run docusaurus build first.');
}

fs.rmSync(mirrorDir, {recursive: true, force: true});
fs.mkdirSync(mirrorDir, {recursive: true});

for (const entry of fs.readdirSync(buildDir, {withFileTypes: true})) {
  if (entry.name === 'docs') continue;
  fs.cpSync(path.join(buildDir, entry.name), path.join(mirrorDir, entry.name), {
    recursive: true,
  });
}
