'use strict';
const fs=require('node:fs'),{execFileSync}=require('node:child_process');
let version;
if(process.env.GITHUB_EVENT_NAME==='push'&&process.env.GITHUB_REF==='refs/heads/main')version=require('../package.json').version;
else{const payload=JSON.parse(execFileSync('gh',['api',`repos/${process.env.GITHUB_REPOSITORY}/contents/package.json?ref=main`],{encoding:'utf8'}));version=JSON.parse(Buffer.from(payload.content,'base64')).version;}
if(!/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(version))throw Error('Invalid expected production version');
fs.appendFileSync(process.env.GITHUB_ENV,'NEXUS_EXPECTED_PRODUCTION_VERSION='+version+'\n');console.log('Expected production version: '+version);
