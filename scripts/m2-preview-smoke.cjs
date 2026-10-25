'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const site='https://lrqrll.github.io/practical-thinking-studio-preview/m2/',expected=process.env.NEXUS_M2_EXPECTED_COMMIT;
if(!/^[a-f0-9]{40}$/.test(expected||''))throw Error('Exact M2 candidate SHA required');
(async()=>{let ready=false;for(let n=0;n<60;n++){const r=await fetch(site+'deployment.json');if(r.ok){const m=await r.json();if(m.commit===expected){ready=true;break;}}await new Promise(ok=>setTimeout(ok,3000));}if(!ready)throw Error('M2 Pages candidate not ready within bounded deployment wait');
 const directory=path.resolve('dist-preview'),meta=JSON.parse(fs.readFileSync(path.join(directory,'deployment.json')));if(meta.commit!==expected)throw Error('Candidate package identity mismatch');const assets=[];
 for(const name of fs.readdirSync(directory)){const p=path.join(directory,name);if(!fs.statSync(p).isFile())continue;const response=await fetch(site+name);if(!response.ok)throw Error('M2 public asset unavailable: '+name);const bytes=Buffer.from(await response.arrayBuffer());if(!bytes.equals(fs.readFileSync(p)))throw Error('M2 asset differs from exact candidate: '+name);assets.push({file:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
 fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/m2-public-assets.json',JSON.stringify({site,commit:expected,version:meta.version,assets},null,2));console.log('PASS exact M2 HTTPS candidate assets',expected,assets.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
