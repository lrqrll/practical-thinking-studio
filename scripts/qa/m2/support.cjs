'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{createHash,webcrypto}=require('node:crypto');
const ROOT=path.resolve(__dirname,'../../..'),DIRECTORY=path.join(ROOT,'docs/qa/m2-rc2'),STAMP='2026-10-25T00:00:00.000Z';
const identity=JSON.parse(fs.readFileSync(path.join(DIRECTORY,'source-identity.json')));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function assertProductIdentity(){for(const [file,expected]of Object.entries(identity.productInputs))if(sha(fs.readFileSync(path.join(ROOT,file)))!==expected)throw Error('Product differs from frozen candidate: '+file);return identity;}
function product(){assertProductIdentity();let sequence=0;const uuid=()=>`00000000-0000-4000-8000-${(++sequence).toString(16).padStart(12,'0')}`;class FixtureDate extends Date{constructor(...args){super(...(args.length?args:[STAMP]));}static now(){return Date.parse(STAMP);}}
 const context=vm.createContext({console,structuredClone,Date:FixtureDate,crypto:{randomUUID:uuid,subtle:webcrypto.subtle},Blob,TextEncoder,TextDecoder});
 for(const name of ['money-model.js','field-model.js','workbench-model.js','media-model.js','document-model.js','storage.js','backup-format.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,name),'utf8'),context,{filename:name});
 const api=vm.runInContext('({S:NexusStore,F:NexusFields,W:NexusWorkbench,B:NexusBackup,emptyNote,emptyDocument})',context);return {...api,uuid};
}
function stable(value){if(Array.isArray(value))return value.map(stable);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])]));return value;}
function json(value){return JSON.stringify(value,null,2)+'\n';}
module.exports={ROOT,DIRECTORY,STAMP,identity,sha,stable,json,product,assertProductIdentity};
