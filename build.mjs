#!/usr/bin/env node
// LunaChart build — the single source of truth is src/.
// Concatenates the source, pre-transpiles JSX with the vendored Babel
// standalone (no npm dependencies), and injects the result into the web
// and iOS shells. NEVER hand-edit index.html or the iOS WebAssets copy.
//
// Usage: node build.mjs
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Babel = require('./vendor/babel.min.js');

const read = (p) => readFileSync(p, 'utf8');

// Plain JS (no JSX): content data + core logic. Skips the Babel pass.
const CONTENT_FILES = [
  'src/content/articles.js',
  'src/content/lessons-base.js',
  'src/content/lessons-extra.js',
  'src/content/drills.js',
  'src/content/glossary.js',
  'src/content/firstcycle.js',
  'src/content/sample.js',
  'src/core.js',
];
// JSX (transpiled at build time). Order matters: shared UI first, app root last.
const APP_FILES = [
  'src/ui.jsx',
  'src/chart.jsx',
  'src/screens/settings.jsx',
  'src/screens/today.jsx',
  'src/screens/chart.jsx',
  'src/screens/learn.jsx',
  'src/screens/drills.jsx',
  'src/screens/glossary.jsx',
  'src/screens/review.jsx',
  'src/screens/onboard.jsx',
  'src/screens/library.jsx',
  'src/screens/landing.jsx',
  'src/app.jsx',
];

const styles = read('src/styles/tokens.css') + '\n' + read('src/styles/app.css');
const content = CONTENT_FILES.map(f => `// ===== ${f} =====\n` + read(f)).join('\n');
const appSrc = APP_FILES.map(f => `// ===== ${f} =====\n` + read(f)).join('\n');
const icons = read('shells/icons.svg');

const appJs = Babel.transform(appSrc, { presets: ['react'] }).code;

// A literal "</script>" inside JS strings would end the inline script tag.
const guard = (s) => s.replace(/<\/script/gi, '<\\/script');
const hash = createHash('sha1').update(styles + content + appJs).digest('hex').slice(0, 8);

const fill = (shell) => read(shell)
  .replace('/*@STYLES*/', styles)
  .replace('<!--@ICONS-->', icons)
  .replace('/*@BUILD*/', hash)
  .replace('/*@CONTENT*/', guard(content))
  .replace('/*@APP*/', guard(appJs));

writeFileSync('index.html', fill('shells/web.html'));
writeFileSync('ios/LunaChart/LunaChart/WebAssets/index.html', fill('shells/ios.html'));
writeFileSync('sw.js', read('shells/sw.js').replace('@HASH', hash));
copyFileSync('vendor/react.production.min.js', 'ios/LunaChart/LunaChart/WebAssets/react.production.min.js');
copyFileSync('vendor/react-dom.production.min.js', 'ios/LunaChart/LunaChart/WebAssets/react-dom.production.min.js');
console.log(`Built ${hash} -> index.html, ios/.../WebAssets/index.html, sw.js`);
