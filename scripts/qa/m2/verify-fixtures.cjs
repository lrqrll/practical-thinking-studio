'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {DIRECTORY,identity,sha,stable,product}=require('./support.cjs');
const {qaBackupProjection,qaBackupRelations}=require('./inspect-backup.js');
const {S}=product(),manifest=JSON.parse(fs.readFileSync(path.join(DIRECTORY,'fixture-manifest.json')));
assert.equal(manifest.candidateSha,identity.candidateSha);assert.equal(manifest.containsRealPrivateData,false);
for(const [name,info]of Object.entries(manifest.files)){
 const bytes=fs.readFileSync(path.join(DIRECTORY,'fixtures',name));assert.equal(sha(bytes),info.sha256,name);assert.equal(bytes.length,info.bytes,name);const x=JSON.parse(bytes);
 if(info.validation==='legacy-ui-converter'){assert.equal(x.version,1);assert.ok(!x.kind);continue;}
 assert.equal(S.validateBackup(x),info.validation==='valid',name);
 if(info.validation!=='valid')continue;
 assert.ok(qaBackupRelations(x),name);assert.deepEqual(stable(qaBackupProjection(x)),stable(info.projection),name);
 assert.equal(x.files.length,info.expected.files);assert.equal(x.histories.reduce((n,h)=>n+h.versions.length,0),info.expected.historyVersions);
 for(const t of x.workbenchTemplates||[]){assert.ok(!JSON.stringify(t).includes('QA-PRIVATE-'));assert.ok(!x.files.some(f=>JSON.stringify(t).includes(f.id)));}
 console.log('PASS model, graph, semantic manifest, checksum:',name);
}
const read=name=>JSON.parse(fs.readFileSync(path.join(DIRECTORY,'fixtures',name))),v2=read('workbench-v2.json'),v3=read('workbench-v3.json');
assert.deepEqual(v2.workbenchSnapshots[0],v3.workbenchSnapshots[0],'legacy snapshot unchanged');
const snap=v3.workbenchSnapshots.find(s=>s.schemaVersion===2);assert.equal(snap.customFields.find(c=>c.field.type==='number').value,'-123.45');
assert.equal(snap.customFields.find(c=>c.field.type==='money').value.minor,'30');
const png=fs.readFileSync(path.join(DIRECTORY,'fixtures',manifest.image.file));assert.equal(sha(png),manifest.image.sha256);assert.equal(png.readUInt32BE(16),16);assert.equal(png.readUInt32BE(20),16);
console.log('PASS frozen candidate product inputs; legacy snapshot; decimal precision; synthetic PNG; invalid graph rejected. Developer validation only.');
