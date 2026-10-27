const { test }=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const context=vm.createContext({structuredClone,TextDecoder,crypto,console});
for(const f of ['time-model.js','media-model.js','document-model.js','storage.js','tools-core.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context);
const run=code=>vm.runInContext(code,context);
test('valid blank records for all nine formal tools',()=>{
 for(const type of ['time-records','document','notes','tasks','budget','quotes','slides','report','minutes'])assert.equal(run(`NexusStore.validData('${type}',blankData('${type}'))`),true);
});
test('reject invalid numbers, malformed notes and dangerous links',()=>{
 for(const code of ["({...blankData('budget'),budget:{...blankState().budget,people:1.5}})","({budget:{...blankState().budget,price:Infinity}})"])assert.equal(run(`NexusStore.validData('budget',${code})`),false);
 assert.equal(run("validNote({...emptyNote(),checks:[null]})"),false);
 for(const link of ['javascript:alert(1)','data:text/html,hi','file:///etc/passwd'])assert.equal(run(`safeDocumentLink(${JSON.stringify(link)})`),false);
 assert.equal(run("validDocument(emptyDocument())"),true);
});
test('malformed backups return false; never throw or accept duplicate identities',()=>{
 for(const value of [null,{}, {kind:'nexus-workspace',version:1,files:[],folders:[null],archives:[]},{kind:'nexus-workspace',version:1,files:[],folders:[],archives:[null]}])assert.equal(run(`NexusStore.validateBackup(${JSON.stringify(value)})`),false);
 assert.equal(run("NexusStore.validateBackup({kind:'nexus-workspace',version:1,folders:[],archives:[],files:[NexusStore.record('notes','a',blankData('notes')),NexusStore.record('notes','b',blankData('notes'))]})"),true);
 assert.equal(run("(()=>{const f=NexusStore.record('notes','a',blankData('notes'));return NexusStore.validateBackup({kind:'nexus-workspace',version:1,folders:[],archives:[],files:[f,f]})})()"),false);
});
test('CSV formula injection is neutralized including whitespace prefixes',()=>{
 for(const v of ['=HYPERLINK("https://bad")',' +SUM(1,2)','\t@cmd','\r-1'])assert.ok(run(`csv(${JSON.stringify(v)})`).startsWith('"\''));
 assert.equal(run('csv(42)'),'"42"');
});
test('DOCX malformed input rejected',()=>{
 assert.throws(()=>run('preflightDocx(new ArrayBuffer(3))'),/不完整/);
 assert.throws(()=>run('preflightDocx(new ArrayBuffer(30))'),/有效/);
});
test('document validation rejects malformed marks without throwing',()=>{
 assert.equal(run("validDocument({...emptyDocument(),content:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'x',marks:[null]}]}]}})"),false);
});
