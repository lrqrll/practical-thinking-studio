'use strict';
// Synthetic inputs only; refuse existing output paths to avoid overwriting any data.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {DIRECTORY,identity,sha,json,product}=require('./support.cjs');
const {qaBackupProjection,qaBackupRelations}=require('./inspect-backup.js');
(async()=>{
 const out=process.argv[2];if(!out)throw Error('Usage: node scripts/qa/m2/generate-large.cjs NEW_DIRECTORY');fs.mkdirSync(out,{recursive:false});
 const {S,W,B}=product(),x=JSON.parse(fs.readFileSync(path.join(DIRECTORY,'fixtures/workbench-v3.json'))),w=x.workbenches[0],note=x.files.find(f=>f.type==='notes'&&!f.deletedAt),legacy=JSON.stringify(x.workbenchSnapshots[0]);
 x.histories.find(h=>h.id==='history:'+note.id).versions.push({rev:note.rev,name:note.name,data:structuredClone(note.data),at:note.updatedAt});
 note.rev++;note.data.note.text='合成中文'.repeat(24500);note.data.note.checks=Array.from({length:140},(_,i)=>({id:'qa-large-'+i,text:'文'.repeat(990),done:true}));
 x.workbenchSnapshots=[x.workbenchSnapshots[0]];
 for(let i=0;i<150;i++)x.workbenchSnapshots.push(W.makeSnapshot(w,x.files,'workbench-snapshot:qa-capacity-'+i,new Date(Date.parse('2026-10-25T00:01:00Z')+i*1000).toISOString()));
 assert.ok(S.validateBackup(x));assert.ok(qaBackupRelations(x));assert.equal(JSON.stringify(x.workbenchSnapshots[0]),legacy);
 const bytes=Buffer.byteLength(JSON.stringify(x));assert.ok(bytes>100000000,'must exceed transport boundary in UTF-8 bytes');
 const parts=await B.pack(x),files=[];for(const p of parts){const data=Buffer.from(await p.blob.arrayBuffer());fs.writeFileSync(path.join(out,p.name),data);files.push({name:p.name,bytes:data.length,sha256:sha(data)});}
 const manifest={kind:'nexus-qa-fixture-manifest-not-a-backup',candidateSha:identity.candidateSha,synthetic:true,bytes,files,expected:{files:x.files.length,snapshots:151,templates:1,historyVersions:x.histories.reduce((n,h)=>n+h.versions.length,0)},semanticSha256:sha(JSON.stringify(qaBackupProjection(x)))};
 fs.writeFileSync(path.join(out,'large-manifest.json'),json(manifest));
 const inputs=parts.map(p=>Object.assign(p.blob,{name:p.name})),restored=await B.unpack(inputs.reverse());assert.ok(S.validateBackup(restored));assert.ok(qaBackupRelations(restored));assert.equal(sha(JSON.stringify(qaBackupProjection(restored))),manifest.semanticSha256);
 console.log(JSON.stringify({role:'developer fixture generation and transport verification; NOT independent browser QA',candidate:identity.candidateSha,bytes,parts:parts.length,expected:manifest.expected}));
})().catch(e=>{console.error(e);process.exitCode=1;});
