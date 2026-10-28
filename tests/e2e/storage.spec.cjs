const {test,expect}=require('./fixtures.cjs');
const {create,saved}=require('./helpers.cjs');
test('quota failure retries latest data without poisoning queue',async({page})=>{
 await create(page,'notes');
 await page.evaluate(()=>{window.realUpdate=NexusStore.update;NexusStore.update=async()=>{throw new DOMException('test quota full','QuotaExceededError')};});
 await page.locator('#note-body').fill('第一次未保存');
 await expect(page.locator('#save-status')).toContainText('未保存：test quota full');
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('nexus-recovery:')).length)).toBe(1);
 await page.locator('#note-body').fill('最新草稿不可遺失');
 await expect.poll(()=>page.evaluate(()=>pendingWrites===0&&!pendingSaveTimer)).toBe(true);
 await page.evaluate(()=>{NexusStore.update=window.realUpdate;});
 await page.locator('#retry-save').click();await saved(page);
 await page.reload();await expect(page.locator('#note-body')).toHaveValue('最新草稿不可遺失');
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('nexus-recovery:')).length)).toBe(0);
});
test('debounce immediately protects drafts and latest edit survives in-flight save',async({page})=>{
 await create(page,'notes');
 await page.evaluate(()=>{const real=NexusStore.update;NexusStore.update=async(...args)=>{await new Promise(r=>setTimeout(r,500));return real(...args);};});
 await page.locator('#note-body').fill('第一份');
 expect(await page.evaluate(()=>Object.values(localStorage).some(s=>s.includes('第一份')))).toBe(true);
 await page.waitForTimeout(400);
 await page.locator('#note-body').fill('第二份最後內容');await saved(page);
 await page.reload();await expect(page.locator('#note-body')).toHaveValue('第二份最後內容');
});
test('conflicting tabs never overwrite newer revision and recovery becomes independent copy',async({page,context})=>{
 await create(page,'notes');await page.locator('#note-body').fill('原稿');await saved(page);
 const other=await context.newPage();await other.goto(page.url());await expect(other.locator('#note-body')).toHaveValue('原稿');
 await page.locator('#note-body').fill('第一頁已保存');await saved(page);
 await other.locator('#note-body').fill('第二頁衝突草稿');await expect(other.locator('#save-status')).toContainText('其他分頁更新');
 await other.locator('#retry-save').click();await expect(other.locator('#save-status')).toContainText('其他分頁更新');
 await page.locator('#note-body').fill('第一頁再次保存');await saved(page);
 expect(await other.evaluate(()=>Object.values(localStorage).some(s=>s.includes('第二頁衝突草稿')))).toBe(true);
 await other.reload();await expect(other.locator('#note-body')).toHaveValue('第一頁再次保存');
 await other.getByRole('button',{name:'將草稿另存副本'}).click();await expect(other.locator('#note-body')).toHaveValue('第二頁衝突草稿');
 const all=await other.evaluate(()=>NexusStore.readAll('files'));expect(all).toHaveLength(2);expect(all.map(f=>f.data.note.text)).toEqual(expect.arrayContaining(['第一頁再次保存','第二頁衝突草稿']));
});
test('failed navigation preserves editor and recovery when localStorage also fills',async({page})=>{
 await create(page,'notes');await page.evaluate(()=>{NexusStore.update=async()=>{throw Error('disk unavailable')};Storage.prototype.setItem=function(){throw new DOMException('full','QuotaExceededError')};});
 await page.locator('#note-body').fill('兩層儲存都失敗仍可下載');await expect(page.locator('#save-status')).toContainText('未保存');
 await page.locator('a.back').click();await expect(page.locator('#note-body')).toHaveValue('兩層儲存都失敗仍可下載');
 const dl=page.waitForEvent('download');await page.locator('#recover-draft').click();const download=await dl;const stream=await download.createReadStream();let body='';for await(const c of stream)body+=c;expect(JSON.parse(body).files[0].data.note.text).toBe('兩層儲存都失敗仍可下載');
});
test('backup restore retains original data and rejects malformed backup atomically',async({page})=>{
 await create(page,'notes');await page.locator('#note-body').fill('備份內容');await saved(page);
 const result=await page.evaluate(async()=>{const b=await NexusStore.snapshot();await NexusStore.importBackup(b);const before=(await NexusStore.readAll('files')).length;let rejected=false;try{await NexusStore.importBackup({...b,folders:[null]});}catch{rejected=true;}return {before,after:(await NexusStore.readAll('files')).length,rejected};});
 expect(result).toEqual({before:2,after:2,rejected:true});
});
test('navigation drains an edit made during an in-flight write',async({page})=>{
 await create(page,'notes');const id=await page.evaluate(()=>activeFile.id);
 await page.evaluate(()=>{const real=NexusStore.update;NexusStore.update=async(...args)=>{await new Promise(r=>setTimeout(r,700));return real(...args);};});
 await page.locator('#note-body').fill('第一個內容');await page.waitForTimeout(400);await page.locator('a.back').click();
 await page.locator('#note-body').fill('導覽等待期間的最新內容');
 await expect(page.locator('#new-file-type')).toBeVisible();
 expect(await page.evaluate(id=>NexusStore.get('files',id).then(f=>f.data.note.text),id)).toBe('導覽等待期間的最新內容');
});
test('real IndexedDB transaction abort rolls back both history and file then retries',async({page})=>{
 await create(page,'notes');await page.evaluate(()=>{window.realPut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...a){if(this.name==='files')throw new DOMException('injected quota','QuotaExceededError');return realPut.apply(this,a);};});
 await page.locator('#note-body').fill('交易回滾驗證');await expect(page.locator('#save-status')).toContainText('injected quota');
 const before=await page.evaluate(async()=>({file:await NexusStore.get('files',activeFile.id),history:await NexusStore.get('meta','history:'+activeFile.id)}));expect(before.file.rev).toBe(1);expect(before.file.data.note.text).toBe('');expect(before.history).toBeUndefined();
 await page.evaluate(()=>{IDBObjectStore.prototype.put=realPut;});await page.locator('#retry-save').click();await saved(page);expect(await page.evaluate(()=>activeFile.rev)).toBe(2);
});
test('history retention is bounded and import preserves snapshot values',async({page})=>{
 await create(page,'notes');const result=await page.evaluate(async()=>{let f=activeFile;for(let i=0;i<14;i++)f=await NexusStore.update(f.id,f.rev,{data:{note:{...emptyNote(),text:'版本'+i}}});const h=await NexusStore.get('meta','history:'+f.id);const b=await NexusStore.snapshot();await NexusStore.importBackup(b);const all=await NexusStore.readAll('files');const copy=all.find(x=>x.id!==f.id);const copied=await NexusStore.get('meta','history:'+copy.id);return {count:h.versions.length,first:h.versions[0].data.note.text,last:h.versions.at(-1).data.note.text,copy:copied.versions};});
 expect(result.count).toBe(10);expect(result.first).toBe('版本3');expect(result.last).toBe('版本12');expect(result.copy).toHaveLength(10);
});
test('legacy migration preserves original local data and runs only once',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('thinking-studio-v1',JSON.stringify({version:1,theme:'dark',budget:{fixed:0,price:100,variable:20,people:10,rows:[['場租',200]]},tasks:[{name:'舊任務',owner:'甲',due:'',depends:'',status:'未開始'}],drafts:{'report-result':'舊版報告'}}));});
 await page.goto('/#work');await expect(page.locator('#new-file-type')).toBeVisible();
 const result=await page.evaluate(async()=>({files:await NexusStore.readAll('files'),archive:await NexusStore.get('meta','archive:legacy-v1'),original:localStorage.getItem('thinking-studio-v1')}));expect(result.files).toHaveLength(6);expect(result.archive.raw).toBe(result.original);expect(JSON.stringify(result.files)).toContain('舊版報告');expect(result.files.find(f=>f.type==='budget').data.budget.price).toBe(100);await page.reload();await expect(page.locator('#new-file-type')).toBeVisible();expect(await page.evaluate(()=>NexusStore.readAll('files').then(f=>f.length))).toBe(6);
});
test('restored history keeps revisions increasing on the next edit',async({page})=>{
 await create(page,'notes');await page.evaluate(async()=>{let f=activeFile;for(let i=0;i<3;i++)f=await NexusStore.update(f.id,f.rev,{data:{note:{...emptyNote(),text:'version'+i}}});const b=await NexusStore.snapshot();await NexusStore.importBackup(b);const copy=(await NexusStore.readAll('files')).find(x=>x.id!==f.id);await NexusStore.update(copy.id,copy.rev,{data:{note:{...emptyNote(),text:'imported edit'}}});const h=await NexusStore.get('meta','history:'+copy.id);if(new Set(h.versions.map(v=>v.rev)).size!==h.versions.length)throw Error('duplicate revision');});
});
