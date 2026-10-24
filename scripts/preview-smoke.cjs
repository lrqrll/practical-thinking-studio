'use strict';
const path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require('@playwright/test');
(async()=>{
 const folder=path.resolve(process.argv[2]||'dist-preview');
 const metadata=require(path.join(folder,'deployment.json'));
 const browser=await chromium.launch(process.env.NEXUS_CHROMIUM?{executablePath:process.env.NEXUS_CHROMIUM,args:['--no-sandbox']}:{});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.NEXUS_PREVIEW_TEST_URL||pathToFileURL(path.join(folder,'index.html')).href);
  await page.locator('#new-file-type').waitFor();
  const banner=await page.locator('#deployment-status').textContent();if(!banner.includes(metadata.commit)||!banner.includes(metadata.version))throw Error('Preview metadata mismatch');
  if(await page.evaluate(()=>DATABASE_NAME)!=='nexus-preview-procurement-m1-workspace')throw Error('Preview storage is not isolated');
  await page.locator('#new-file-type').selectOption('document');await page.locator('#document-editor [contenteditable=true]').fill('可操作預覽文件');await page.evaluate(()=>flush());await page.reload();
  await page.waitForFunction(()=>document.querySelector('#document-editor')?.textContent.includes('可操作預覽文件'));
  if(errors.length)throw Error(JSON.stringify(errors));console.log('PASS preview package: exact commit, isolated storage, document edit/save/reload',metadata.commit);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
