'use strict';
// Recompute raw response/download evidence; no HTTP request and no product mutation.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const sha=b=>createHash('sha256').update(b).digest('hex');
const M='78e90aec61ca825d45534c93515df4d8f949a431';
const root=path.resolve(process.argv[2]||'production-https-results');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]);}
const indexes=files(root).filter(f=>path.basename(f)==='monitor-index.json');if(!indexes.length)throw Error('No monitor evidence indexes found');
let responses=0,downloads=0;const reports=[];
for(const file of indexes){const x=JSON.parse(fs.readFileSync(file));if(x.role!=='開發者實際驗證'||x.product!==M||x.errors.length)throw Error('Not clean formal M evidence: '+file);const contexts=new Set(x.contexts.map(c=>c.id)),pages=new Map(x.pages.map(p=>[p.pageId,p.contextId]));if(!contexts.size||x.contexts.some(c=>!c.closed))throw Error('Unclosed/unobserved context: '+file);
 const seen=new Map();for(const e of x.events.filter(e=>e.event==='live-response')){if(!contexts.has(e.contextId)||pages.get(e.pageId)!==e.contextId||e.product!==M)throw Error('Invalid context/page/product mapping');const bytes=fs.readFileSync(path.resolve(path.dirname(file),e.body));if(bytes.length!==e.bytes||sha(bytes)!==e.sha256||e.sha256!==e.expectedSha256||e.status!==200)throw Error('Response hash/size/status mismatch: '+file+' '+e.requestId);if(seen.has(e.requestId))throw Error('Duplicate request evidence');seen.set(e.requestId,e);responses++;}
 for(const id of contexts)if(![...seen.values()].some(e=>e.contextId===id))throw Error('Context lacks production raw response proof: '+id);
 for(const e of x.events.filter(e=>e.event==='browser-response'&&e.url.startsWith('https://lrqrll.github.io/practical-thinking-studio/'))){const a=seen.get(e.requestId);if(!a||a.url!==e.url||a.contextId!==e.contextId||a.pageId!==e.pageId||a.status!==e.status)throw Error('Browser response missing exact raw bytes mapping: '+JSON.stringify(e));}
 for(const e of x.events.filter(e=>e.event==='download')){const b=fs.readFileSync(path.join(path.dirname(file),e.file));if(b.length!==e.bytes||sha(b)!==e.sha256)throw Error('Actual download hash mismatch');downloads++;}
 reports.push({index:path.relative(root,file),contexts:x.contexts.length,pages:x.pages.length,responses:seen.size,errors:x.errors.length});
}
console.log(JSON.stringify({role:'開發者取證完整性檢查（非獨立QA）',M,indexes:indexes.length,responses,downloads,reports},null,2));
