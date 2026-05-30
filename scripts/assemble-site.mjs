import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const rootDir = path.resolve('.');
const buildDir = path.join(rootDir, 'build');
const landingBuildDir = path.join(rootDir, 'landing', 'build');
const cnamePath = path.join(rootDir, 'static', 'CNAME');
const blogDataPath = path.join(rootDir, 'landing', 'src', 'data', 'blogArticles.js');
const docsTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'w7s-docs-'));

const assertDir = (dir, message) => {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(message);
  }
};

const copySpaRoute = (route) => {
  const routeDir = path.join(buildDir, route);
  fs.mkdirSync(routeDir, {recursive: true});
  fs.copyFileSync(path.join(buildDir, 'index.html'), path.join(routeDir, 'index.html'));
};

const readBlogSlugs = () => {
  if (!fs.existsSync(blogDataPath)) return [];
  const source = fs.readFileSync(blogDataPath, 'utf8');
  return [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
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

  const statusDir = path.join(buildDir, 'status');
  fs.mkdirSync(statusDir, {recursive: true});
  fs.copyFileSync(path.join(buildDir, 'index.html'), path.join(statusDir, 'index.html'));
  copySpaRoute('blog');
  for (const slug of readBlogSlugs()) {
    copySpaRoute(path.join('blog', slug));
  }

  if (fs.existsSync(cnamePath)) {
    fs.copyFileSync(cnamePath, path.join(buildDir, 'CNAME'));
  }

  console.log('Assembled landing frontend at / and Docusaurus docs at /docs/.');
} finally {
  fs.rmSync(docsTempDir, {recursive: true, force: true});
}
