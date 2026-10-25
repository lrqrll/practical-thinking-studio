'use strict';
// Read-only semantic comparison: restored copies intentionally receive new IDs/timestamps.
function qaBackupProjection(x){
 const clone=v=>JSON.parse(JSON.stringify(v)),sort=rows=>rows.sort((a,b)=>JSON.stringify(a)<JSON.stringify(b)?-1:JSON.stringify(a)>JSON.stringify(b)?1:0);
 const files=new Map((x.files||[]).map(f=>[f.id,f])),folders=new Map((x.folders||[]).map(f=>[f.id,f]));
 const field=f=>{const c=clone(f);delete c.id;if(c.options)c.options=c.options.map(o=>{const n={...o};delete n.id;return n;});return c;};
 const raw=(f,v)=>f.type==='select'&&v!==null&&v!==undefined?f.options.find(o=>o.id===v)?.label??v:v;
 const rows=(r,key)=>r.fields.map(f=>({field:field(f),hasValue:Object.hasOwn(r[key],f.id),raw:Object.hasOwn(r[key],f.id)?raw(f,r[key][f.id]):null}));
 const unknown=(r,key)=>Object.fromEntries(Object.entries(r[key]).filter(([k])=>!r.fields.some(f=>f.id===k)));
 return {
  files:sort((x.files||[]).map(f=>({name:f.name,type:f.type,rev:f.rev,deleted:!!f.deletedAt,folder:folders.get(f.folderId)?.name??null,data:clone(f.data),history:clone((x.histories||[]).find(h=>h.id==='history:'+f.id)?.versions||[])}))),
  folders:sort((x.folders||[]).map(f=>({name:f.name,deleted:!!f.deletedAt}))),archives:sort((x.archives||[]).map(a=>a.raw)),preferences:x.preferences?{favorites:clone(x.preferences.favorites),recent:clone(x.preferences.recent)}:null,
  workbenches:sort((x.workbenches||[]).map(w=>({schemaVersion:w.schemaVersion,name:w.name.replace(/( 還原副本)+$/,''),rev:w.rev,deleted:!!w.deletedAt,modules:sort(w.modules.map(m=>({kind:m.kind,file:files.get(m.sourceId)?.name??null}))),...(w.schemaVersion===2?{fieldStructureVersion:w.fieldStructureVersion,fields:rows(w,'values'),opaqueValues:unknown(w,'values')}:{}),qaOpaque:w.qaOpaque??null}))),
  snapshots:sort((x.workbenchSnapshots||[]).map(s=>({schemaVersion:s.schemaVersion,name:s.name,workbenchRev:s.workbenchRev,createdAt:s.createdAt,calculationVersion:s.calculationVersion,currency:s.currency,scale:s.scale,quotes:clone(s.quotes),need:s.need,decision:s.decision,memo:clone(s.memo),sources:sort(s.sourceVersions.map(v=>({kind:v.kind,name:v.name,rev:v.rev}))),...(s.schemaVersion===2?{fieldStructureVersion:s.fieldStructureVersion,customFields:s.customFields.map(c=>({field:field(c.field),raw:raw(c.field,c.raw),value:raw(c.field,c.value)}))}:{})}))),
  templates:sort((x.workbenchTemplates||[]).map(t=>({name:t.name,rev:t.rev,deleted:!!t.deletedAt,fieldStructureVersion:t.fieldStructureVersion,fields:rows(t,'defaults')})))
 };
}
function qaBackupRelations(x){
 const files=new Map((x.files||[]).map(f=>[f.id,f])),benches=new Map((x.workbenches||[]).map(w=>[w.id,w]));
 return (x.workbenches||[]).every(w=>w.modules.every(m=>files.get(m.sourceId)?.type===m.kind)&&(!w.fields||w.fields.every(f=>f.type!=='select'||!Object.hasOwn(w.values,f.id)||w.values[f.id]===null||f.options.some(o=>o.id===w.values[f.id]))))&&(x.workbenchSnapshots||[]).every(s=>benches.has(s.workbenchId)&&s.sourceVersions.every(v=>files.get(v.fileId)?.type===v.kind&&v.rev<=files.get(v.fileId).rev&&benches.get(s.workbenchId).modules.some(m=>m.kind===v.kind&&m.sourceId===v.fileId&&m.id===v.moduleId))&&(s.schemaVersion!==2||s.customFields.every(c=>benches.get(s.workbenchId).fields.some(f=>f.id===c.field.id&&f.type===c.field.type))))&&(x.workbenchTemplates||[]).every(t=>t.fields.every(f=>f.type!=='select'||!Object.hasOwn(t.defaults,f.id)||t.defaults[f.id]===null||f.options.some(o=>o.id===t.defaults[f.id])));
}
if(typeof module!=='undefined')module.exports={qaBackupProjection,qaBackupRelations};
