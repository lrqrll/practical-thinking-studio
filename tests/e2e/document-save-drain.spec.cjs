const {test,expect}=require('./fixtures.cjs');
const {fontEvidence}=require('../../scripts/qa/production/font-evidence.cjs');
const {ready}=require('../../scripts/qa/production/monitor.cjs');
// Complements the original notes regression: actual document editor, with an explicit save latch.
test('actual document preserves input appended while navigation waits for an in-flight save',async({page},info)=>{
 const site=process.env.NEXUS_M2_SITE_URL||'/';await page.goto(site+'#work');
 if(process.env.NEXUS_M2_EXPECTED_COMMIT)expect(await page.evaluate(()=>DEPLOYMENT.commit)).toBe(process.env.NEXUS_M2_EXPECTED_COMMIT);
 await page.locator('#new-file-type').selectOption('document');const editor=page.locator('#document-editor [contenteditable=true]');await expect(editor).toBeVisible();await expect.poll(()=>page.locator('#main').evaluate(x=>x.inert)).toBe(false);
 const id=await page.evaluate(()=>activeFile.id);await page.evaluate(()=>{const real=NexusStore.update;let first=true;NexusStore.update=async(...args)=>{if(first){first=false;window.documentWriteWaiting=true;await new Promise(ok=>window.releaseDocumentWrite=ok);}return real(...args);};});
 await editor.fill('合成文件第一段');await editor.focus();await page.keyboard.press('ControlOrMeta+a');await page.locator('[data-doc-command=bold]').click();await expect(editor.locator('strong')).toHaveText('合成文件第一段');await expect.poll(()=>page.evaluate(()=>!!window.documentWriteWaiting)).toBe(true);await page.locator('a.back').click();
 await editor.press('End');await page.keyboard.insertText('，保存等待期間追加的完整內容');await expect(editor).toHaveText('合成文件第一段，保存等待期間追加的完整內容');await ready(page);await page.screenshot({path:info.outputPath('document-pending-with-latest-input.png'),fullPage:true});
 await page.evaluate(()=>releaseDocumentWrite());await expect(page.locator('#new-file-type')).toBeVisible();const data=await page.evaluate(id=>NexusStore.get('files',id),id);
 const text=data.data.document.content.content.map(p=>(p.content||[]).map(n=>n.text||'').join('')).join('\n');expect(text).toBe('合成文件第一段，保存等待期間追加的完整內容');
 await page.locator('a[href="#file/'+id+'"]').click();await expect(editor).toHaveText(text);await expect(editor.locator('strong')).toHaveText(text);await page.reload();await expect(editor).toHaveText(text);await expect(editor.locator('strong')).toHaveText(text);expect(data.data.document.content.content[0].content.every(n=>n.marks?.some(m=>m.type==='bold'))).toBe(true);
 await fontEvidence(page,n=>info.outputPath(n),'document-reopened');
 await info.attach('stored-document',{body:JSON.stringify({role:'開發者實際驗證',id,record:data},null,2),contentType:'application/json'});
});

// Mixed visual fixture uses existing marks, never restores retired italic operations.
test('CJK visual fixture preserves normal bold and legacy italic after save reopen and reload',async({page},info)=>{
 await page.goto((process.env.NEXUS_M2_SITE_URL||'/')+'#work');await page.locator('#new-file-type').selectOption('document');const editor=page.locator('.tiptap');await expect.poll(()=>page.locator('#main').evaluate(x=>x.inert)).toBe(false);
 const content={type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'繁體中文一般文字 ABC xyz 123，。！？「」；：'},{type:'text',text:'粗體 Bold 保存等待',marks:[{type:'bold'}]},{type:'text',text:'既有斜體 italic 相容',marks:[{type:'italic'}]}]}]};
 await editor.evaluate((el,data)=>el.editor.commands.setContent(data),content);const id=await page.evaluate(()=>activeFile.id);await fontEvidence(page,n=>info.outputPath(n),'mixed-before-save');await page.locator('a.back').click();await expect(page.locator('#new-file-type')).toBeVisible();await page.locator('a[href="#file/'+id+'"]') .click();await expect(editor.locator('em')).toHaveText('既有斜體 italic 相容');await fontEvidence(page,n=>info.outputPath(n),'mixed-reopened');await page.reload();await expect(editor.locator('strong')).toHaveText('粗體 Bold 保存等待');await expect(editor.locator('em')).toHaveText('既有斜體 italic 相容');expect(await editor.evaluate(el=>el.editor.getJSON().content[0].content)).toEqual(content.content[0].content);await fontEvidence(page,n=>info.outputPath(n),'mixed-reloaded');
});
