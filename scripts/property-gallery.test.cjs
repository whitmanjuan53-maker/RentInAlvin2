const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '..', 'src/lib/property-gallery.ts'), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleUnderTest = { exports: {} };
new Function('require', 'module', 'exports', code)(require, moduleUnderTest, moduleUnderTest.exports);
const { mergePublicGallery } = moduleUnderTest.exports;

test('committed gallery remains first and database extras remain available', () => {
  assert.deepEqual(
    mergePublicGallery(['/new-mural.png', '/local-photo.jpg'], ['/db-photo.jpg', '/local-photo.jpg']),
    ['/new-mural.png', '/local-photo.jpg', '/db-photo.jpg'],
  );
});

test('an empty database gallery cannot hide the committed White House mural', () => {
  assert.deepEqual(
    mergePublicGallery(['/images/white-house/mural-white-house.png'], []),
    ['/images/white-house/mural-white-house.png'],
  );
});

test('removed mural files are not restored by stale database rows', () => {
  assert.deepEqual(
    mergePublicGallery(
      ['/images/french-quarter/mural-french-quarter.png', '/images/french-quarter/exterior.jpg'],
      ['/images/french-quarter/mural-butterflies-flowers.jpg', '/uploads/manager-photo.jpg'],
    ),
    ['/images/french-quarter/mural-french-quarter.png', '/images/french-quarter/exterior.jpg', '/uploads/manager-photo.jpg'],
  );
});
