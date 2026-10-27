'use strict';
// Exact allowed production diff, rather than accepting arbitrary changes behind a version bump.
const fs=require('node:fs'),{execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const identity=require('../../../docs/qa/m2-rc2/source-identity.json');
for(const name of Object.keys(identity.productInputs)){
 let expected=execFileSync('git',['show',identity.candidateSha+':'+name],{maxBuffer:20*1024*1024});
 if(['storage.js','index.html','package.json','package-lock.json'].includes(name))expected=Buffer.from(expected.toString().replaceAll('3.4.0-rc.2','3.4.0'));
 if(name==='storage.js')expected=Buffer.from(expected.toString().replaceAll('nexus-preview-workbench-m2-workspace','nexus-preview-workbench-m2-release-workspace').replaceAll('nexus-preview-workbench-m2-recovery:','nexus-preview-workbench-m2-release-recovery:'));
 if(!fs.readFileSync(name).equals(expected))throw Error('Unexpected release product change: '+name);
}
console.log('PASS exact release runtime/dependency diff: version, cache keys, preview-only namespace; production DB/schema/models unchanged');
(async()=>{const site=process.env.NEXUS_RELEASE_SITE_URL;if(!site)return;const meta=JSON.parse(fs.readFileSync('dist-preview/deployment.json')),expected=process.env.NEXUS_RELEASE_COMMIT;if(meta.version!=='3.4.0'||meta.commit!==expected)throw Error('Package identity mismatch');let ready=false;for(let attempt=0;attempt<40;attempt++){const r=await fetch(site+'deployment.json',{signal:AbortSignal.timeout(15000),cache:'no-store'});if(r.ok){const m=await r.json();if(m.commit===expected&&m.version===meta.version){ready=true;break;}}await new Promise(ok=>setTimeout(ok,3000));}if(!ready)throw Error('Pages did not publish exact release SHA within bounded wait; browser acceptance not started');const assets=[];
 for(const file of fs.readdirSync('dist-preview')){const p='dist-preview/'+file;if(!fs.statSync(p).isFile())continue;const r=await fetch(site+file,{signal:AbortSignal.timeout(30000),cache:'no-store'});if(!r.ok)throw Error(file+': '+r.status);const bytes=Buffer.from(await r.arrayBuffer());if(!bytes.equals(fs.readFileSync(p)))throw Error('Public release preview differs: '+file);assets.push({file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
 fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/release-public-assets.json',JSON.stringify({role:'開發者實際驗證',site,version:meta.version,commit:expected,assets},null,2));console.log('PASS exact release HTTPS assets',assets.length,expected);
})().catch(e=>{console.error(e);process.exitCode=1;});
