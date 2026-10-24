const {test,expect}=require('./fixtures.cjs');
const {create,saved}=require('./helpers.cjs');
test('backward native navigation retains its anchor and focus direction',async({page})=>{
 await create(page,'document');await page.locator('.tiptap').fill('方向不能反轉');
 const result=await page.locator('.tiptap').evaluate(el=>{
  const text=el.querySelector('p').firstChild,selection=getSelection();selection.collapse(text,text.length);selection.extend(text,0);
  el.dispatchEvent(new KeyboardEvent('keyup',{key:'Home',shiftKey:true,bubbles:true}));el.editor.view.focus();
  return {anchor:el.editor.state.selection.anchor,head:el.editor.state.selection.head,text:selection.toString()};
 });
 expect(result.anchor).toBeGreaterThan(result.head);expect(result.text).toBe('方向不能反轉');
 await page.locator('[data-doc-command=bold]').click();await expect(page.locator('.tiptap strong')).toHaveText('方向不能反轉');await saved(page);await page.reload();await expect(page.locator('.tiptap strong')).toHaveText('方向不能反轉');
});
test('native navigation updates the model before a pending focus restores its old selection',async({page})=>{
 await create(page,'document');
 await page.locator('.tiptap').evaluate(el=>{el.editor.commands.setContent({type:'doc',content:[{type:'heading',attrs:{level:2},content:[{type:'text',text:'只選第一段'}]},{type:'paragraph'}]});});
 await page.locator('.tiptap').focus();await page.keyboard.press('ControlOrMeta+a');
 await page.locator('.tiptap').evaluate(el=>{
  // Chromium moves its native caret immediately; selectionchange can arrive
  // after ProseMirror's delayed focus transaction restores the old AllSelection.
  const text=el.querySelector('h2').firstChild,selection=getSelection();selection.collapse(text,0);
  el.dispatchEvent(new KeyboardEvent('keyup',{key:'Home',bubbles:true}));
  el.editor.view.focus();
  selection.extend(text,text.length);
  el.dispatchEvent(new KeyboardEvent('keyup',{key:'End',shiftKey:true,bubbles:true}));
  el.editor.view.focus();
 });
 expect(await page.evaluate(()=>getSelection().toString())).toBe('只選第一段');
 await page.locator('#doc-block').selectOption('paragraph');await page.locator('[data-doc-command=bulletList]').click();
 await expect(page.locator('.tiptap ul li')).toHaveCount(1);await saved(page);await page.reload();await expect(page.locator('.tiptap ul li')).toHaveCount(1);
});
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
