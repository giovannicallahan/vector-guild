#!/usr/bin/env node
/* Writes the precache list and the cache version into game/sw.js, from the files actually in game/.
   Run after any change under game/:   node tools/build-sw.js
   Check only (exit 1 when stale):     node tools/build-sw.js --check
   The version is a hash of every listed file's path and bytes, so any change gives the cache a new name
   and the browser installs the new service worker. qa/install.test.js runs the same check. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const game = path.resolve(__dirname, '../game');
const SW = path.join(game, 'sw.js');
/* Not on the website (the two preview pages), or not a file to cache (the worker itself). */
const EXCLUDE = new Set(['home-preview.html', 'collection/preview.html', 'sw.js']);
const START = '/* precache:start */', END = '/* precache:end */';

function listFiles() {
  const out = [];
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(path.join(dir, e.name), r);
      else if (e.isFile() && !EXCLUDE.has(r)) out.push(r);
    }
  })(game, '');
  return out.sort();
}
function versionOf(files) {
  const h = crypto.createHash('sha256');
  for (const f of files) { h.update(f + '\0'); h.update(crypto.createHash('sha256').update(fs.readFileSync(path.join(game, f))).digest()); }
  return h.digest('hex').slice(0, 12);
}
function block(files, version) {
  return START + "\nvar VERSION='" + version + "';\nvar FILES=" + JSON.stringify(files) + ';\n' + END;
}
function expected(src) {
  const a = src.indexOf(START), b = src.indexOf(END);
  if (a < 0 || b < a) throw new Error('game/sw.js has lost its precache markers');
  const files = listFiles();
  return { files, version: versionOf(files), src: src.slice(0, a) + block(files, versionOf(files)) + src.slice(b + END.length) };
}
module.exports = { listFiles, versionOf, expected, EXCLUDE, SW };

if (require.main === module) {
  const src = fs.readFileSync(SW, 'utf8'), want = expected(src);
  if (process.argv.includes('--check')) {
    if (want.src !== src) { console.error('game/sw.js is stale. Run: node tools/build-sw.js'); process.exit(1); }
    console.log('game/sw.js is up to date: ' + want.files.length + ' files, version ' + want.version);
  } else {
    if (want.src !== src) fs.writeFileSync(SW, want.src);
    console.log((want.src !== src ? 'wrote' : 'unchanged') + ' game/sw.js: ' + want.files.length + ' files, version ' + want.version);
  }
}
