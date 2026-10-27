const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const ctx=vm.createContext({structuredClone,crypto});
for(const f of ['money-model.js','field-model.js','workbench-model.js','time-model.js','media-model.js','document-model.js','storage.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
const row=(id,minutes=30,date='2026-10-27',project='中文專案')=>({id,date,project,task:'工作',minutes,notes:''});
const file=rows=>({id:'file-1',rev:3,type:'time-records',data:{timeRecords:{schemaVersion:1,rows}}});
test('Gregorian dates and minute boundaries reject raw invalid input',()=>{
 for(const d of ['0001-01-01','9999-12-31','2000-02-29','2024-02-29'])assert.equal(run(`NexusTime.validDate('${d}')`),true);
 for(const d of ['','0000-01-01','1900-02-29','2026-02-29','2026-04-31','2026-1-01','2026-10-27Z'])assert.equal(run(`NexusTime.validDate('${d}')`),false);
 for(const n of [1,1440])assert.equal(run(`NexusTime.validMinutes(${n})`),true);
 for(const n of [0,-1,1.5,1441,Number.MAX_SAFE_INTEGER,NaN])assert.equal(run(`NexusTime.validMinutes(${n})`),false);
 for(const minutes of ['','0','-1','1.2','1e2',' 30','+30','1441'])assert.ok(run(`Object.keys(NexusTime.errors({date:'2026-10-27',minutes:${JSON.stringify(minutes)}})).includes('minutes')`));
});
test('strict versioned model rejects duplicate IDs unknown fields and row 501',()=>{
 const rows=Array.from({length:500},(_,i)=>row('r'+i,1440));
 assert.equal(run(`NexusTime.valid(${JSON.stringify(file(rows).data.timeRecords)})`),true);
 assert.equal(run(`NexusTime.totals(${JSON.stringify(rows)}).minutes`),720000);
 for(const value of [{schemaVersion:2,rows:[]},{schemaVersion:1,rows:[],unknown:'retain me'},{schemaVersion:1,rows:[row('a'),row('a')]},{schemaVersion:1,rows:[{...row('a'),future:'x'}]},{schemaVersion:1,rows:[...rows,row('extra')]}])assert.equal(run(`NexusTime.valid(${JSON.stringify(value)})`),false);
 assert.equal(run(`NexusStore.validData('time-records',{timeRecords:NexusTime.empty(),unknown:'x'})`),false);
});
test('adapter deep copies frozen rows and uses integer filtered/project totals',()=>{
 ctx.source=file([row('r1'),row('r2',45),row('r3',60,'2026-11-01','另一專案')]);
 assert.equal(run("NexusTime.duration(NexusTime.adapter(source,{to:'2026-10-31'}).totals.minutes)"),'1 小時 15 分鐘');
 assert.equal(run("NexusTime.adapter(source).totals.projects[0].minutes"),75);
 assert.equal(run("(()=>{const a=NexusTime.adapter(source);source.data.timeRecords.rows[0].minutes=1;return a.rows[0].minutes})()"),30);
 assert.throws(()=>run("NexusTime.adapter(source,{from:'2026-11-01',to:'2026-10-01'})"),/日期範圍/);
});
test('raw invalid drafts remain valid backup data and adapter refuses silent omission',()=>{
 const value={schemaVersion:1,rows:[row('r1')],draft:{editingId:'r1',date:'2026-02-30',project:'中文專案',task:'工作',minutes:'-2.5',notes:'未保存輸入'}};
 ctx.draftFile={...file([]),data:{timeRecords:value}};
 assert.equal(run("NexusStore.validData('time-records',draftFile.data)"),true);
 assert.throws(()=>run('NexusTime.adapter(draftFile)'),/未完成/);
 ctx.draftFile.data.timeRecords.draft={editingId:'r1',date:'2026-10-27',project:'中文專案',task:'工作',minutes:'030',notes:''};assert.equal(run('NexusTime.adapter(draftFile).totals.minutes'),30);
});
test('CSV preserves Unicode quotes newlines and guards all formula prefixes',()=>{
 ctx.csvFile=file([row('r1',30,'2026-10-27','中文「案」'),{...row('r2',45),task:' \\t=SUM(1,2)',notes:'中文"引號"\n第二行'}]);
 const csv=run('NexusTime.csv(csvFile)');assert.ok(csv.startsWith('\ufeff'));assert.ok(csv.includes('中文「案」'));assert.ok(csv.includes('"中文""引號""\n第二行"'));assert.ok(csv.includes('"合計分鐘","75"'));
 for(const prefix of ['=','+','-','@']){ctx.csvFile.data.timeRecords.rows[0].project='\t'+prefix+'危險';assert.ok(run('NexusTime.csv(csvFile)').includes('"\'\t'+prefix+'危險"'));}
});
test('time files and history fit unchanged v1 v2 v3 backups; future versions rejected',()=>{
 for(const version of [1,2,3]){const x={kind:'nexus-workspace',version,folders:[],archives:[],files:[file([row('r1')])],histories:[{id:'history:file-1',versions:[{rev:1,name:'原版',at:'2026-10-27',data:file([row('r1',1)]).data}]}],...(version>=2?{workbenches:[],workbenchSnapshots:[]}:{}),...(version===3?{workbenchTemplates:[]}:{})};x.files[0].name='工時';x.files[0].folderId=null;ctx.backup=x;assert.equal(run('NexusStore.validateBackup(backup)'),true);x.files[0].data.timeRecords.schemaVersion=2;assert.equal(run('NexusStore.validateBackup(backup)'),false);}
});
