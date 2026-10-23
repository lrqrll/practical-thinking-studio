const {test,expect}=require('./fixtures.cjs');
const {create,saved}=require('./helpers.cjs');
const commit='1234567890abcdef1234567890abcdef12345678';
test('preview isolates files, legacy migration and recovery from the production origin',async({page})=>{
 await create(page,'notes');await page.locator('#note-body').fill('正式資料請保留');await saved(page);
 const production=await page.evaluate(async()=>{localStorage.setItem('nexus-recovery:production-sentinel','production draft');localStorage.setItem('thinking-studio-v1','legacy sentinel');return await NexusStore.readAll('files');});
 await page.route('**/deployment.js*',route=>route.fulfill({contentType:'application/javascript',body:`window.NEXUS_DEPLOYMENT={channel:'preview',commit:'${commit}'};`}));
 await page.goto('/');await expect(page.locator('#new-file-type')).toBeVisible();await expect(page.locator('#deployment-status')).toContainText(commit);
 expect(await page.evaluate(()=>files.length)).toBe(0);expect(await page.evaluate(()=>DATABASE_NAME)).toBe('nexus-preview-pr4-workspace');expect(await page.evaluate(()=>NexusStore.get('meta','archive:legacy-v1'))).toBeUndefined();
 await page.locator('#new-file-type').selectOption('notes');await page.locator('#note-body').fill('預覽資料');await saved(page);await page.reload();await expect(page.locator('#note-body')).toHaveValue('預覽資料');
 expect(await page.evaluate(()=>localStorage.getItem('nexus-recovery:production-sentinel'))).toBe('production draft');
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
