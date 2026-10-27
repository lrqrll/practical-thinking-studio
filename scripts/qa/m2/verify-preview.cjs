'use strict';
const fs=require('node:fs');
const {identity,sha,assertProductIdentity}=require('./support.cjs');
(async()=>{assertProductIdentity();const entries=Object.entries(identity.previewAssets),assets=[];
 for(let i=0;i<entries.length;i+=4)assets.push(...await Promise.all(entries.slice(i,i+4).map(async([file,expected])=>{const r=await fetch(identity.previewUrl+file,{signal:AbortSignal.timeout(30000),cache:'no-store'});if(!r.ok)throw Error(file+': HTTP '+r.status);const bytes=Buffer.from(await r.arrayBuffer()),actual=sha(bytes);if(actual!==expected)throw Error('Public asset differs: '+file);return{file,bytes:bytes.length,sha256:actual};})));
 const r=await fetch(identity.previewUrl+'deployment.json',{signal:AbortSignal.timeout(30000)}),m=await r.json();if(m.commit!==identity.candidateSha||m.version!==identity.version)throw Error('Preview identity mismatch');
 const report={role:'developer public asset verification; not independent browser QA',checkedAt:new Date().toISOString(),url:identity.previewUrl,commit:m.commit,version:m.version,assets};fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/qa-public-assets.json',JSON.stringify(report,null,2));console.log('PASS TLS-verified frozen HTTPS assets',assets.length,m.commit);
})().catch(e=>{console.error(e);process.exitCode=1;});
