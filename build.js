const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  throw new Error('dist/ is missing. This repository deploys the prebuilt static site from dist/.');
}

const required = [
  'index.html',
  'about/index.html',
  'projects/index.html',
  'donate/index.html',
  'contact/index.html',
  'news/index.html',
  '404.html',
  'assets/styles.css',
  'assets/script.js',
  'assets/logo.svg'
];

const missing = required.filter(file => !fs.existsSync(path.join(dist, file)));
if (missing.length) {
  throw new Error('Build validation failed. Missing: ' + missing.join(', '));
}

console.log('BIMBA NEPAL static site validation passed.');
console.log('Deployable directory: dist/');
