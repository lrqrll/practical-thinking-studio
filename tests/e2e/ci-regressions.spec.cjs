const {test,expect}=require('./fixtures.cjs');
const {create,saved}=require('./helpers.cjs');
test('find selects its result synchronously even when animation frames are delayed',async({page})=>{
 await create(page,'document');await page.locator('.tiptap').fill('alpha alpha');
 await page.getByText('尋找與取代',{exact:true}).click();await page.locator('#doc-find').fill('alpha');
 const selected=await page.evaluate(()=>{const raf=window.requestAnimationFrame;window.requestAnimationFrame=fn=>setTimeout(()=>fn(performance.now()),250);try{document.querySelector('#doc-find-next').click();return getSelection().toString();}finally{window.requestAnimationFrame=raf;}});
 expect(selected).toBe('alpha');
});
test('selecting files keeps the chosen move destination and input nodes',async({page})=>{
 await create(page,'notes');await page.locator('a.back').click();
 await page.evaluate(async()=>{await NexusStore.write('folders',{id:'destination',name:'目標',createdAt:new Date().toISOString()});await render();});
 await page.locator('#move-target').selectOption('destination');
 await page.evaluate(()=>{window.moveInput=document.querySelector('#move-target');});
 await page.locator('#select-all').check();await expect(page.locator('#move-files')).toBeEnabled();
 await expect(page.locator('#move-target')).toHaveValue('destination');
 expect(await page.evaluate(()=>moveInput===document.querySelector('#move-target'))).toBe(true);
 await page.locator('#move-files').click();await expect.poll(()=>page.evaluate(()=>files[0].folderId)).toBe('destination');
});
test('formatting uses the visible text range before selectionchange synchronizes the model',async({page})=>{
 await create(page,'document');
 const counts=await page.locator('.tiptap').evaluate(el=>{
  const editor=el.editor;editor.commands.setContent({type:'doc',content:[{type:'heading',attrs:{level:2},content:[{type:'text',text:'選取這一段'}]},{type:'paragraph'}]});
  editor.commands.setTextSelection({from:1,to:editor.state.doc.content.size-1});
  const text=el.querySelector('h2').firstChild,range=document.createRange();range.selectNodeContents(text);getSelection().removeAllRanges();getSelection().addRange(range);
  const block=document.querySelector('#doc-block');block.value='paragraph';block.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('[data-doc-command=bulletList]').click();return el.querySelectorAll('ul li').length;
 });
 expect(counts).toBe(1);await saved(page);await page.reload();await expect(page.locator('.tiptap ul li')).toHaveCount(1);
});
test('folder deletion disables controls until transaction and rendering finish',async({page})=>{
 await create(page,'notes');await page.locator('a.back').click();
 await page.evaluate(async()=>{await NexusStore.write('folders',{id:'remove-me',name:'刪除測試',createdAt:new Date().toISOString()});currentFolder='remove-me';await render();const real=NexusStore.removeEmptyFolder;NexusStore.removeEmptyFolder=async(...args)=>{await new Promise(r=>setTimeout(r,500));return real(...args);};});
 await page.locator('#delete-folder').click();await expect(page.locator('#folder-filter')).toBeDisabled();
 await page.locator('#folder-filter').selectOption('trash');await expect(page.locator('#empty-trash')).toBeVisible();await expect(page.locator('#folder-filter')).toHaveValue('trash');
});
