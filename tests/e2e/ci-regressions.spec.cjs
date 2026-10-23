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
