const {test,expect}=require('./fixtures.cjs');
const {create,saved}=require('./helpers.cjs');
const {unzipSync,strFromU8}=require('fflate');
async function bytes(download){const chunks=[];for await(const c of await download.createReadStream())chunks.push(c);return Buffer.concat(chunks);}
const tools=[
 ['notes','#note-body','#export-note-text','記事測試'],
 ['report','#report-result','#exportreport','報告測試'],
 ['quotes','#work-quote-need','#exportquotes','報價測試'],
 ['slides','#work-slide-title-problem','#exportslides','簡報測試'],
 ['minutes','#work-meeting-title','#exportminutes','會議測試']
];
for(const [type,field,exporter,text]of tools)test(`${type}: edit, reload, export, independent copy, escaped input`,async({page})=>{
 await create(page,type);const value=text+' <img src=x onerror=alert(1)> =SUM(1,2)';
 await page.locator(field).fill(value);await saved(page);await page.reload();await expect(page.locator(field)).toHaveValue(value);
 const dl=page.waitForEvent('download');await page.locator(exporter).click();const body=(await bytes(await dl)).toString();expect(body.length).toBeGreaterThan(10);
 if(type!=='quotes')expect(body).toContain(text);
 if(['slides','minutes'].includes(type))expect(body).not.toContain('<img src=x');
 const previous=await page.evaluate(()=>activeFile.id);await create(page,type);await expect(page.locator(field)).toHaveValue('');
 const old=await page.evaluate(id=>NexusStore.get('files',id),previous);expect(JSON.stringify(old.data)).toContain(text);
});
test('tasks: add, update, sort, persisted values and CSV injection protection',async({page})=>{
 await create(page,'tasks');await page.locator('#addtask').click();await page.locator('[data-task="0"][data-field="name"]').fill('\t=HYPERLINK("evil")');await page.locator('[data-task="0"][data-field="due"]').fill('2026-12-31');await page.locator('[data-task="0"][data-field="owner"]').fill('負責人');await page.locator('[data-task="0"][data-field="status"]').selectOption('進行中');await saved(page);await page.reload();await expect(page.locator('[data-field="owner"]')).toHaveValue('負責人');
 const dl=page.waitForEvent('download');await page.locator('#exporttasks').click();expect((await bytes(await dl)).toString()).toContain("'\t=HYPERLINK");
 await page.locator('#addtask').click();await page.locator('#sorttask').click();await saved(page);expect(await page.locator('[data-task="0"][data-field="due"]').inputValue()).toBe('2026-12-31');
 await create(page,'tasks');expect(await page.locator('[data-task]').count()).toBe(0);
});
test('budget: invalid input, calculations, XLSX formulas, persisted and independent values',async({page})=>{
 await create(page,'budget');await page.locator('#price').fill('100');await page.locator('#variable').fill('20');await page.locator('#people').fill('10');await page.locator('#addcost').click();await page.locator('[data-cost-name]').fill('場租');await page.locator('[data-cost-value]').fill('200');await saved(page);await expect(page.locator('#budgetresult .metric')).toHaveText('600');
 await page.locator('#people').fill('-1');await expect(page.locator('#budgetresult')).toContainText('有效數字');expect(await page.evaluate(()=>state.budget.people)).toBe(10);await page.locator('#people').fill('10');await saved(page);await page.reload();await expect(page.locator('#price')).toHaveValue('100');
 const dl=page.waitForEvent('download');await page.locator('#exportbudgetxlsx').click();const zip=unzipSync(await bytes(await dl));expect(Object.keys(zip)).toContain('xl/worksheets/sheet1.xml');const sheet=strFromU8(zip['xl/worksheets/sheet1.xml']);expect(sheet).toContain('<f>');expect(sheet).toContain('SUM(B21:B21)');
 await create(page,'budget');await expect(page.locator('#price')).toHaveValue('0');
});
test('quotes reject negative costs in result',async({page})=>{await create(page,'quotes');for(const key of ['base','delivery','extra','tax'])await page.locator('#q-0-'+key).fill('0');await expect(page.locator('#quote-result')).toContainText('完整已填總價 0 元');await page.locator('#q-0-base').fill('-2');await expect(page.locator('#quote-result')).toContainText('尚不能計算完整總價');});
test('note rejects unsupported image without data mutation',async({page})=>{await create(page,'notes');await page.locator('#note-image-input').setInputFiles({name:'evil.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg onload="alert(1)"/>')});await expect(page.locator('#toast')).toContainText('僅支援');expect(await page.evaluate(()=>state.note.images.length)).toBe(0);});
module.exports={bytes};
