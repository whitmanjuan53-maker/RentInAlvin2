const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (module,file) => module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);
const { EMPTY_APPLICATION,validateApplication } = require('../src/lib/application.ts');
const valid = {...EMPTY_APPLICATION,firstName:'Test',lastName:'Applicant',email:'applicant@example.test',phone:'8325550123',employer:'Test income source',income:'3500',property:'Kings Haven Apartments, 410 S 2nd St',unitType:'2 Bed · 1 Bath',moveIn:'2099-01-01',consent:true,notes:'Test application',currentAddress:'Test address',prevLandlord:'Test landlord'};
assert.deepEqual(validateApplication(valid),{});
assert.ok(validateApplication({...valid,email:'bad'}).email);
assert.ok(validateApplication({...valid,phone:'123'}).phone);
assert.ok(validateApplication({...valid,income:'-10'}).income);
assert.ok(validateApplication({...valid,moveIn:'2026-02-30'}).moveIn);
assert.ok(validateApplication({...valid,consent:false}).consent);
assert.ok(validateApplication({...valid,moveIn:'2020-01-01'}).moveIn);
const originalLoad = Module._load;
let forwarded;
let outcome = {success:true,leadId:'TEST-REFERENCE',dbId:'test-id'};
let limited = false;
Module._load = function(request,parent,isMain) {
  if (request==='@/lib/leads') return {processLead:async payload => { forwarded=payload; return outcome; }};
  if (request==='@/lib/rate-limit') return {checkRateLimit:()=>({allowed:!limited})};
  if (request.startsWith('@/')) return originalLoad.call(this,path.resolve('src',request.slice(2)),parent,isMain);
  if (parent?.filename.endsWith('lib'+path.sep+'leads.ts')) {
    if (request==='./db') return {prisma:null,isDbReady:()=>false};
    if (request==='./google') return {appendLeadToSheet:async()=>null,createTourEvent:async()=>null,checkDoubleBooking:async()=>false};
    if (request==='./email') return {sendLeadEmail:async()=>({id:'simulated'}),sendUserConfirmationEmail:async()=>null};
    if (request==='./analytics') return {saveUnifiedLead:async()=>null,logEmail:async()=>null,extractEmailId:()=>null,recordEvent:async()=>null,attachEmailToLead:async()=>null,hashIp:()=>'',normalizeLeadType:()=> 'application_interest'};
  }
  return originalLoad.call(this,request,parent,isMain);
};
const {NextRequest} = require('next/server');
const {POST} = require('../src/app/api/apply/route.ts');
const send = body => POST(new NextRequest('http://localhost/api/apply',{method:'POST',headers:{'Content-Type':'application/json',referer:'http://localhost/apply'},body:JSON.stringify(body)}));
(async()=>{
  let response=await send({...valid,consent:false});assert.equal(response.status,400);assert.equal(forwarded,undefined);
  response=await send({...valid,email:'bad'});assert.equal(response.status,400);
  response=await send({...valid,firstName:' Test '});assert.equal(response.status,200);assert.equal((await response.json()).leadId,'TEST-REFERENCE');
  for (const name of ['currentAddress','prevLandlord','moveIn','employer','income','notes','consent']) assert.equal(forwarded[name],valid[name]);
  assert.equal(forwarded.firstName,'Test');
  outcome={success:false,error:'Service unavailable'};response=await send(valid);assert.equal(response.status,503);
  limited=true;response=await send(valid);assert.equal(response.status,429);
  const {processLead}=require('../src/lib/leads.ts');
  const result=await processLead({type:'apply',...valid},{source:'Local test'});
  assert.equal(result.success,false,'A simulated email must not count as a received application');
  console.log('Passed application validation, API forwarding, consent, delivery failure and request-limit checks.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{Module._load=originalLoad;});
