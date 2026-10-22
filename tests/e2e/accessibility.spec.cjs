const {test,expect}=require('./fixtures.cjs');
const AxeBuilder=require('@axe-core/playwright').default;
const {create,home}=require('./helpers.cjs');
for(const width of [390,1280])test(`responsive and accessibility at ${width}px in both themes`,async({page})=>{
 await page.setViewportSize({width,height:900});await home(page);
 for(const theme of ['light','dark']){
  if(theme==='dark')await page.locator('#theme').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
 }
 await create(page,'document');await page.locator('#document-editor [contenteditable=true]').fill('響應式文件');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});
test('document sanitizer removes executable markup and remote images',async({page})=>{
 await create(page,'document');const html=await page.evaluate(()=>cleanDocumentHTML('<script>alert(1)</script><img src="https://evil.test/tracker" onerror="alert(1)"><a href="javascript:alert(1)">x</a><p style="background:url(https://evil.test)">safe</p>'));
 expect(html).not.toContain('<script');expect(html).not.toContain('onerror');expect(html).not.toContain('javascript:');expect(html).not.toContain('evil.test');expect(html).toContain('safe');
});

for(const type of ['notes','tasks','budget','quotes','slides','report','minutes'])test(`${type}: mobile layout and accessible editor`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await create(page,type);
 if(type==='tasks')await page.locator('#addtask').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});
