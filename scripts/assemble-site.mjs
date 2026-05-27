import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const rootDir = path.resolve('.');
const buildDir = path.join(rootDir, 'build');
const landingBuildDir = path.join(rootDir, 'landing', 'build');
const cnamePath = path.join(rootDir, 'static', 'CNAME');
const docsTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'w7s-docs-'));

const assertDir = (dir, message) => {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(message);
  }
};

assertDir(buildDir, 'Missing Docusaurus build directory. Run npm run build:docs first.');
assertDir(landingBuildDir, 'Missing landing build directory. Run npm run build:landing first.');

try {
  for (const entry of fs.readdirSync(buildDir, {withFileTypes: true})) {
    if (entry.name === 'docs') continue;

    fs.cpSync(path.join(buildDir, entry.name), path.join(docsTempDir, entry.name), {
      recursive: true,
    });
  }

  fs.rmSync(buildDir, {recursive: true, force: true});
  fs.mkdirSync(buildDir, {recursive: true});
  fs.cpSync(landingBuildDir, buildDir, {recursive: true});
  fs.cpSync(docsTempDir, path.join(buildDir, 'docs'), {recursive: true});

  if (fs.existsSync(cnamePath)) {
    fs.copyFileSync(cnamePath, path.join(buildDir, 'CNAME'));
  }

  console.log('Assembled landing frontend at / and Docusaurus docs at /docs/.');
} finally {
  fs.rmSync(docsTempDir, {recursive: true, force: true});
}
