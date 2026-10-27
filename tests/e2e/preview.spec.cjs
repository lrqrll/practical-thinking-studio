const {test,expect}=require('./fixtures.cjs');
const {create,saved}=require('./helpers.cjs');
const commit='1234567890abcdef1234567890abcdef12345678';
test('preview isolates files, legacy migration and recovery from the production origin',async({page})=>{
 await create(page,'notes');await page.locator('#note-body').fill('正式資料請保留');await saved(page);
 const production=await page.evaluate(async()=>{localStorage.setItem('nexus-recovery:production-sentinel','production draft');localStorage.setItem('thinking-studio-v1','legacy sentinel');return await NexusStore.readAll('files');});
 await page.evaluate(async()=>{await new Promise((ok,no)=>{const req=indexedDB.open('nexus-preview-pr4-workspace',1);req.onupgradeneeded=()=>{for(const key of ['files','folders','meta'])req.result.createObjectStore(key,{keyPath:'id'});};req.onerror=()=>no(req.error);req.onsuccess=()=>{const db=req.result,tx=db.transaction('meta','readwrite');tx.objectStore('meta').put({id:'old-preview-sentinel',value:'舊預覽保留'});tx.oncomplete=()=>{db.close();ok();};};});localStorage.setItem('nexus-preview-pr4-recovery:old','舊預覽草稿');});
 await page.evaluate(async()=>{await new Promise((ok,no)=>{const r=indexedDB.open('nexus-preview-procurement-m1-workspace',1);r.onupgradeneeded=()=>{for(const s of ['files','folders','meta'])r.result.createObjectStore(s,{keyPath:'id'});};r.onerror=()=>no(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(['files','meta'],'readwrite');tx.objectStore('files').put(NexusStore.record('notes','M1預覽請保留',{note:{...emptyNote(),text:'M1預覽內容'}}));tx.objectStore('meta').put({id:'m1-sentinel',value:'M1舊資料保留'});tx.oncomplete=()=>{db.close();ok();};};});localStorage.setItem('nexus-preview-procurement-m1-recovery:old','M1舊草稿');});
 await page.route('**/deployment.js*',route=>route.fulfill({contentType:'application/javascript',body:`window.NEXUS_DEPLOYMENT={channel:'preview',commit:'${commit}'};`}));
 await page.goto('/');await expect(page.locator('#new-file-type')).toBeVisible();await expect(page.locator('#deployment-status')).toContainText(commit);
 expect(await page.evaluate(()=>files.length)).toBe(0);expect(await page.evaluate(()=>DATABASE_NAME)).toBe('nexus-preview-m31-assembly-workspace');expect(await page.evaluate(()=>NexusStore.get('meta','archive:legacy-v1'))).toBeUndefined();
 await page.locator('#new-file-type').selectOption('notes');await page.locator('#note-body').fill('預覽資料');await saved(page);await page.reload();await expect(page.locator('#note-body')).toHaveValue('預覽資料');
 expect(await page.evaluate(()=>localStorage.getItem('nexus-recovery:production-sentinel'))).toBe('production draft');expect(await page.evaluate(()=>localStorage.getItem('nexus-preview-pr4-recovery:old'))).toBe('舊預覽草稿');expect(await page.evaluate(()=>new Promise(ok=>{const r=indexedDB.open('nexus-preview-pr4-workspace',1);r.onsuccess=()=>{const d=r.result,g=d.transaction('meta').objectStore('meta').get('old-preview-sentinel');g.onsuccess=()=>{d.close();ok(g.result.value);};};}))).toBe('舊預覽保留');
 expect(await page.evaluate(()=>localStorage.getItem('nexus-preview-procurement-m1-recovery:old'))).toBe('M1舊草稿');expect(await page.evaluate(()=>new Promise(ok=>{const r=indexedDB.open('nexus-preview-procurement-m1-workspace',1);r.onsuccess=()=>{const db=r.result,g=db.transaction('files').objectStore('files').getAll();g.onsuccess=()=>{db.close();ok(g.result.map(f=>f.data.note.text));};};}))).toEqual(['M1預覽內容']);
 await page.unroute('**/deployment.js*');await page.goto('/');await expect(page.locator('#new-file-type')).toBeVisible();
 expect(await page.evaluate(()=>NexusStore.readAll('files'))).toEqual(production);
});
test('preview path fails closed before opening a database if deployment metadata is missing',async({page,baseURL})=>{
 await page.route('**/practical-thinking-studio-preview/**',async route=>{
  const url=new URL(route.request().url());url.pathname=url.pathname.replace('/practical-thinking-studio-preview/','/');
  if(url.pathname==='/deployment.js'){await route.fulfill({contentType:'application/javascript',body:''});return;}
  await route.fulfill({response:await route.fetch({url:url.href})});
 });
 await page.goto(baseURL+'/practical-thinking-studio-preview/');await expect(page.locator('#main')).toContainText('未開啟任何工作空間');
 expect(await page.evaluate(()=>indexedDB.databases())).toEqual([]);
});
