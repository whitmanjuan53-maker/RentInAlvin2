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
const { mergePublicGallery, resolvePropertyGallery } = moduleUnderTest.exports;

const orderSource = fs.readFileSync(path.join(__dirname, '..', 'src/lib/community-order.ts'), 'utf8');
const orderCode = ts.transpileModule(orderSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const orderModule = { exports: {} };
new Function('require', 'module', 'exports', orderCode)(require, orderModule, orderModule.exports);
const { orderCommunities } = orderModule.exports;

test('committed gallery remains first and database extras remain available', () => {
  assert.deepEqual(
    mergePublicGallery(['/new-mural.png', '/local-photo.jpg'], ['/db-photo.jpg', '/local-photo.jpg']),
    ['/new-mural.png', '/local-photo.jpg', '/db-photo.jpg'],
  );
});

test('an empty database gallery cannot hide the committed White House cover photo', () => {
  assert.deepEqual(
    mergePublicGallery(['/images/white-house/01-exterior-sealy-street.jpg'], []),
    ['/images/white-house/01-exterior-sealy-street.jpg'],
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

test('a manager-controlled gallery keeps the exact saved order', () => {
  assert.deepEqual(
    resolvePropertyGallery(['/site-main.jpg', '/site-two.jpg'], ['/site-two.jpg', '/uploaded.jpg'], true),
    ['/site-two.jpg', '/uploaded.jpg'],
  );
});

test('a manager-controlled row cannot leave a public property without a photo', () => {
  assert.deepEqual(
    resolvePropertyGallery(['/site-main.jpg'], [], true),
    ['/site-main.jpg'],
  );
});

test('communities follow the requested display order without dropping extra locations', () => {
  const communities = [
    { name: 'Kings Haven Apartments', addr: '410 S 2nd St' },
    { name: 'Kings Manor Townhomes', addr: '328 S 2nd St' },
    { name: 'Kings Haven Apartments', addr: '100 S 2nd St' },
    { name: 'French Quarter Residency', addr: '2550 S Bypass 35' },
    { name: 'The White House Apartments', addr: '1606 W Sealy St' },
    { name: 'The Royal Oaks Townhomes', addr: '418 S Jackson St' },
  ];

  assert.deepEqual(
    orderCommunities(communities).map(({ name, addr }) => `${name}|${addr}`),
    [
      'Kings Manor Townhomes|328 S 2nd St',
      'The Royal Oaks Townhomes|418 S Jackson St',
      'Kings Haven Apartments|410 S 2nd St',
      'French Quarter Residency|2550 S Bypass 35',
      'The White House Apartments|1606 W Sealy St',
      'Kings Haven Apartments|100 S 2nd St',
    ],
  );
});
