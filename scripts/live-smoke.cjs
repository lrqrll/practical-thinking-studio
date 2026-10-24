'use strict';
const {chromium}=require('@playwright/test');
(async()=>{
 const url=process.env.NEXUS_SITE_URL||'https://lrqrll.github.io/practical-thinking-studio/';
 if(!url.startsWith('https://lrqrll.github.io/'))throw Error('Unexpected deployment host');
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&['document','script','stylesheet','font'].includes(r.request().resourceType()))errors.push(`${r.status()} ${r.url()}`);});
  if(process.env.NEXUS_EXPECTED_COMMIT){
   let ready=false;
   for(let i=0;i<60;i++){
    const response=await page.request.get(new URL('deployment.json',url).href);
    if(response.ok()){const metadata=await response.json();if(metadata.commit===process.env.NEXUS_EXPECTED_COMMIT){ready=true;break;}}
    await new Promise(resolve=>setTimeout(resolve,3000));
   }
   if(!ready)throw Error('Preview did not publish the expected source commit');
  }
  await page.goto(url);await page.locator('#new-file-type').waitFor();
  if(process.env.NEXUS_EXPECTED_COMMIT){const banner=await page.locator('#deployment-status').textContent();if(!banner.includes(process.env.NEXUS_EXPECTED_COMMIT))throw Error('Preview banner mismatch');if(await page.evaluate(()=>DATABASE_NAME)!=='nexus-preview-procurement-m1-workspace')throw Error('Preview storage not isolated');}
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
