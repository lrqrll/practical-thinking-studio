'use strict';
// Original PNG bytes, chunked to avoid log line truncation. Artifact remains canonical.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
function all(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?all(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const inputs=[];for(const phase of ['before-cjk','after-cjk'])for(const suffix of ['.png','-editor.png'])inputs.push(['font-'+phase+suffix,path.join('environment-evidence/font-diagnosis',phase,phase+suffix)]);
const suite=all('production-https-results');for(const name of ['document-pending-with-latest-input.png','document-reopened.png','mixed-reloaded.png']){const found=suite.filter(f=>path.basename(f)===name);if(found.length!==1)throw Error('Required unique visual evidence missing: '+name);inputs.push([name,found[0]]);}
for(const [label,file]of inputs){const b=fs.readFileSync(file);if(b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Not original PNG: '+file);const encoded=b.toString('base64'),parts=Math.ceil(encoded.length/12000);console.log('QA_PNG_MANIFEST '+JSON.stringify({label,file,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),parts}));for(let i=0;i<parts;i++)console.log(`QA_PNG_CHUNK ${label} ${i+1}/${parts} ${encoded.slice(i*12000,(i+1)*12000)}`);}
