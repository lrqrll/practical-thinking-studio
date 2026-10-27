const {test,expect}=require('./fixtures.cjs');
// Complements the original notes regression: actual document editor, with an explicit save latch.
test('actual document preserves input appended while navigation waits for an in-flight save',async({page},info)=>{
 const site=process.env.NEXUS_M2_SITE_URL||'/';await page.goto(site+'#work');
 if(process.env.NEXUS_M2_EXPECTED_COMMIT)expect(await page.evaluate(()=>DEPLOYMENT.commit)).toBe(process.env.NEXUS_M2_EXPECTED_COMMIT);
 await page.locator('#new-file-type').selectOption('document');const editor=page.locator('#document-editor [contenteditable=true]');await expect(editor).toBeVisible();await expect.poll(()=>page.locator('#main').evaluate(x=>x.inert)).toBe(false);
 const id=await page.evaluate(()=>activeFile.id);await page.evaluate(()=>{const real=NexusStore.update;let first=true;NexusStore.update=async(...args)=>{if(first){first=false;window.documentWriteWaiting=true;await new Promise(ok=>window.releaseDocumentWrite=ok);}return real(...args);};});
 await editor.fill('合成文件第一段');await editor.focus();await page.keyboard.press('ControlOrMeta+a');await page.locator('[data-doc-command=bold]').click();await expect(editor.locator('strong')).toHaveText('合成文件第一段');await expect.poll(()=>page.evaluate(()=>!!window.documentWriteWaiting)).toBe(true);await page.locator('a.back').click();
 await editor.press('End');await page.keyboard.insertText('，保存等待期間追加的完整內容');await expect(editor).toHaveText('合成文件第一段，保存等待期間追加的完整內容');await page.screenshot({path:info.outputPath('document-pending-with-latest-input.png'),fullPage:true});
 await page.evaluate(()=>releaseDocumentWrite());await expect(page.locator('#new-file-type')).toBeVisible();const data=await page.evaluate(id=>NexusStore.get('files',id),id);
 const text=data.data.document.content.content.map(p=>(p.content||[]).map(n=>n.text||'').join('')).join('\n');expect(text).toBe('合成文件第一段，保存等待期間追加的完整內容');
 await page.locator('a[href="#file/'+id+'"]').click();await expect(editor).toHaveText(text);await expect(editor.locator('strong')).toHaveText(text);await page.reload();await expect(editor).toHaveText(text);await expect(editor.locator('strong')).toHaveText(text);expect(data.data.document.content.content[0].content.every(n=>n.marks?.some(m=>m.type==='bold'))).toBe(true);
 await info.attach('stored-document',{body:JSON.stringify({role:'開發者實際驗證',id,record:data},null,2),contentType:'application/json'});
});
