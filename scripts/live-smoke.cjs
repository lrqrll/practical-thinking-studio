'use strict';
const {chromium}=require('@playwright/test');
(async()=>{
 const url='https://lrqrll.github.io/practical-thinking-studio/';
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&['document','script','stylesheet','font'].includes(r.request().resourceType()))errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(url);await page.locator('#new-file-type').waitFor();
  const version=await page.locator('footer .version').textContent();
  if(process.env.NEXUS_EXPECTED_VERSION&&version!==process.env.NEXUS_EXPECTED_VERSION)throw Error(`Expected ${process.env.NEXUS_EXPECTED_VERSION}, deployed ${version}`);
  await page.locator('#new-file-type').selectOption('notes');
  await page.locator('#note-body').fill('NEXUS isolated deployment smoke test');
  await page.evaluate(()=>flush());await page.reload();
  if(await page.locator('#note-body').inputValue()!=='NEXUS isolated deployment smoke test')throw Error('deployed note persistence failed');
  if(errors.length)throw Error(JSON.stringify(errors));
  console.log(`PASS deployed baseline ${version}: HTTPS, resources, initialization, note edit/save/reload. Disposable context only; no server writes.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
