const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText, file);
const { answerLeasingQuestion } = require('../src/lib/leasing-chat.ts');
const { cleanWebsiteText } = require('../src/lib/website-copy.ts');
const { COMMUNITIES } = require('../src/lib/data.ts');
assert.equal(cleanWebsiteText('Family-run homes — $850–$999. Call (832) 210-3968 or office@yellowstone-am.com.'), 'Family run homes, $850 to $999. Call (832) 210 3968 or office@yellowstone-am.com.');
assert.equal(cleanWebsiteText('https://example.com/property-name'), 'https://example.com/property-name');
const answer = q => answerLeasingQuestion(q,'en',COMMUNITIES);
assert.match(answer('What is rent at Royal Oaks?').text, /1,350/);
assert.doesNotMatch(answer('What is rent at Royal Oaks?').text, /1,510|monthly fees/);
assert.match(answer('Do you allow dogs?').text, /50 lbs/);
assert.equal(answer('How do I apply?').href,'/apply');
assert.equal(answer('Will I qualify with bad credit?').href,'/#contact');
assert.equal(answer('Can you reserve a unit for me?').href,'/#contact');
assert.match(answer('There is a fire emergency').text,/911/);
assert.equal(answer('month-to-month leases').href,'/#contact');
assert.equal(answerLeasingQuestion('Solicitar visita','es',COMMUNITIES).href,'/es#contacto');
assert.match(answerLeasingQuestion('Rentas','es',COMMUNITIES).text,/Rentas publicadas/);
assert.equal(answerLeasingQuestion('Aplicar','es',COMMUNITIES).href,'/es/apply');
let scenarios = 0;
for (const q of ['How much is a one-bedroom?', 'What does a 1 bedroom cost?', '1BR prices', 'one bed apartment', 'Do you have one bedroom apartments?']) {
  assert.match(answer(q).text, /\$850 to \$999/); assert.doesNotMatch(answer(q).text, /1,495/); scenarios++;
}
for (const q of ['How much is a two-bedroom?', '2BR rent', 'two bed prices', 'What are your 2 bedroom options?', 'How much for 2 bedrooms?']) {
  assert.match(answer(q).text, /\$900 to \$1,079/); assert.match(answer(q).text, /2\.5 Bath/); assert.doesNotMatch(answer(q).text, /3 Bed/); scenarios++;
}
for (const q of ['How much is a three-bedroom?', '3br', 'three bed townhome', '3 bedroom rent', 'What does a three bedroom cost?']) {
  assert.match(answer(q).text, /\$1,495 to \$1,650/); assert.doesNotMatch(answer(q).text, /2 Bed/); scenarios++;
}
const cases = [
  ['Are cats allowed?', /50 lbs/], ['Can I bring my dog?', /50 lbs/],
  ['Is water included?', /Utility arrangements vary/], ['What is included in rent?', /Utility arrangements vary/],
  ['Do you have parking?', /assigned spot/], ['How much is parking?', /assigned spot/],
  ['What documents do I need?', /proof of income/], ['What are the income requirements?', /3 times/],
  ['How do I apply online?', /application online/], ['What is the deposit?', /current quote/],
  ['How much are the application fees?', /current quote/], ['Can I schedule a showing?', /confirm the time/],
  ['Can I see an apartment?', /confirm the time/], ['Do you do month-to-month?', /12 months/],
  ['Do you have short-term leases?', /12 months/], ['What are your office hours?', /9 am/],
  ['Are you open Saturday?', /Saturday by appointment/], ['What is your phone number?', /832/],
  ['What is the email address?', /office@yellowstone-am.com/], ['Where are you located?', /410 S 2nd/],
  ['Can I move in next week?', /Availability changes/], ['Are there vacancies?', /Availability changes/],
  ['How do I pay rent?', /resident login/], ['How do I get something repaired? maintenance', /Call the office/],
  ['Do you have washers?', /Which community/], ['Do you have a pool?', /Which community/],
  ['Will I qualify with an eviction?', /don’t have confirmed information/],
  ['Can I have a service dog?', /don’t have confirmed information/],
  ['Tell me about Kings Manor', /2BR/], ['How much at Kings Haven 100?', /from \$850/],
  ['Where is Royal Oaks?', /418 S Jackson/], ['How large is Royal Oaks in square feet?', /1,150 sq ft/],
];
for (const [q, expected] of cases) { assert.match(answer(q).text, expected, q); scenarios++; }
const multi = answer('How much is a two bedroom and do you allow dogs?').text;
assert.match(multi, /\$900 to \$1,079/); assert.match(multi, /50 lbs/); scenarios++;
const followup = (q, history) => answerLeasingQuestion(q, 'en', COMMUNITIES, history);
assert.match(followup('Where is it?', ['Tell me about Royal Oaks']).text, /418 S Jackson/); scenarios++;
assert.match(followup('How much is it?', ['Tell me about Royal Oaks']).text, /\$1,350/); scenarios++;
assert.match(followup('What about a two?', ['How much is a one bedroom?']).text, /\$900 to \$1,079/); scenarios++;
assert.doesNotMatch(followup('What about all the other communities?', ['Tell me about Royal Oaks']).text, /^The Royal Oaks Townhomes[^\n]*\nPublished/); scenarios++;
assert.match(followup('Where is Kings Manor?', ['Tell me about Royal Oaks']).text, /328 S 2nd/); scenarios++;
assert.match(answerLeasingQuestion('Cuánto cuesta una habitación?', 'es', COMMUNITIES).text, /\$850 a \$999/); scenarios++;
assert.match(answerLeasingQuestion('Renta de dos habitaciones', 'es', COMMUNITIES).text, /\$900 a \$1,079/); scenarios++;
assert.equal(answerLeasingQuestion('Qué documentos necesito para la solicitud?', 'es', COMMUNITIES).href, '/es/apply'); scenarios++;
assert.equal(answerLeasingQuestion('No sé qué preguntar', 'es', COMMUNITIES).href, '/es#contacto'); scenarios++;
const edited = COMMUNITIES.map(p => p.name.includes('Royal') ? { ...p, price: '$1,400/mo' } : p);
assert.match(answerLeasingQuestion('Rent at Royal Oaks', 'en', edited).text, /\$1,400/); scenarios++;
assert.doesNotMatch(answer('How much is parking?').text, /Published monthly rents/); scenarios++;
assert.doesNotMatch(answer('What is included in rent?').text, /Published monthly rents/); scenarios++;
console.log(`Passed ${scenarios} expanded question scenarios plus existing chat, Spanish, rent and punctuation checks.`);
