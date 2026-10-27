'use strict';
const fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process'),{createHash,webcrypto}=require('node:crypto');
const M='78e90aec61ca825d45534c93515df4d8f949a431',B='ff3f8a16cb343b93973bd191003c30ca9c13b996',H='bf626a34c315108a1b5253a6d942ab8ae3734739',T='bba3bb3c0ae02afbfcfbeeeb7cee63f216c086b1',site='https://lrqrll.github.io/practical-thinking-studio/';
const api=p=>JSON.parse(execFileSync('gh',['api','repos/lrqrll/practical-thinking-studio'+p],{encoding:'utf8'}));
const source=(sha,name)=>execFileSync('git',['show',sha+':'+name],{maxBuffer:20*1024*1024});
(async()=>{
 for(const name of ['document-editor.js','document-model.js','document-vendor.js'])if(!source(B,name).equals(source(M,name)))throw Error('Legacy serialization control source changed: '+name);
 const phase=process.argv[2];if(!['before','after'].includes(phase))throw Error('Expected explicit before/after phase');
 const c=api('/git/commits/'+M),main=api('/git/ref/heads/main').object.sha,p=api('/pulls/15'),pages=api('/pages/builds/latest');
 if(main!==M||c.tree.sha!==T||JSON.stringify(c.parents.map(x=>x.sha))!==JSON.stringify([B,H])||!p.merged||p.merge_commit_sha!==M||pages.status!=='built'||pages.commit!==M)throw Error('Exact production release/Pages identity mismatch');
 const runs=api('/actions/runs?head_sha='+M+'&per_page=100').workflow_runs;
 for(const name of ['NEXUS quality','NEXUS deployed HTTPS verification']){const r=runs.find(x=>x.name===name);if(!r||r.head_sha!==M||r.conclusion==='failure'||(phase==='after'&&r.conclusion!=='success'))throw Error('Required main CI not successful: '+name);}
 const files=execFileSync('git',['ls-tree','--name-only',M],{encoding:'utf8'}).trim().split('\n').filter(x=>x==='.nojekyll'||/\.(js|html|css|woff2|txt)$/.test(x));if(files.length!==32)throw Error('Expected exactly 32 production assets; received '+files.length);
 const assets={};for(let offset=0;offset<files.length;offset+=4)await Promise.all(files.slice(offset,offset+4).map(async file=>{const expected=source(M,file);if(!fs.readFileSync(file).equals(expected))throw Error('Verifier runtime differs from M: '+file);const r=await fetch(site+file,{signal:AbortSignal.timeout(30000),cache:'no-store'});if(!r.ok)throw Error('Public asset '+file+': '+r.status);const bytes=Buffer.from(await r.arrayBuffer());if(!bytes.equals(expected))throw Error('Production asset differs from M: '+file);assets[file]={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}));
 // Validate old records against the genuine 3.3.0 validators, not just the newer validator.
 const ctx=vm.createContext({console,structuredClone,crypto:webcrypto,Blob,TextEncoder,TextDecoder});for(const f of ['money-model.js','workbench-model.js','media-model.js','document-model.js','storage.js'])vm.runInContext(source(B,f).toString(),ctx,{filename:B+':'+f});const validate=vm.runInContext('NexusStore.validateBackup',ctx);
 for(const name of ['workspace-v1.json','workbench-v2.json'])if(!validate(JSON.parse(fs.readFileSync('docs/qa/m2-rc2/fixtures/'+name))))throw Error('Synthetic legacy fixture is not valid in original 3.3.0: '+name);
 fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/production-expected-assets.json',JSON.stringify({M,tree:T,site,assets},null,2));
 const report={role:'開發者正式HTTPS實際驗證',phase,checkedAt:new Date().toISOString(),M,base:B,head:H,tree:T,pages,mainCI:runs.filter(r=>['NEXUS quality','NEXUS deployed HTTPS verification'].includes(r.name)).map(r=>({id:r.id,head:r.head_sha,status:r.status,conclusion:r.conclusion,url:r.html_url})),assets,legacyValidatorSource:B,legacyFixturesValid:true,legacyEditorAndSchemaByteIdenticalTo330:true};fs.writeFileSync('test-results/production-'+phase+'.json',JSON.stringify(report,null,2));console.log('PASS production '+phase+': exact M, parents/tree, Pages, 32 actual asset hashes, original 3.3.0 validators',M);
})().catch(e=>{console.error(e);process.exitCode=1;});
