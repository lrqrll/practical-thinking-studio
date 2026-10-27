'use strict';
// Executes synthetic data in disposable contexts against two pinned source archives.
const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),net=require('node:net'),{spawn,execFileSync}=require('node:child_process');
const {ROOT,identity}=require('./support.cjs');
async function port(){const s=net.createServer();await new Promise(ok=>s.listen(0,'127.0.0.1',ok));const p=s.address().port;await new Promise(ok=>s.close(ok));return p;}
async function probe(sha,expectedFocus,browser){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'nexus-qa-control-'));let server;
 try{
  const archive=execFileSync('git',['archive','--format=tar',sha],{cwd:ROOT,maxBuffer:30*1024*1024});execFileSync('tar',['xf','-','-C',dir],{input:archive});const p=await port();server=spawn('python3',['-m','http.server',String(p),'--bind','127.0.0.1'],{cwd:dir,stdio:'ignore'});
  const url='http://127.0.0.1:'+p+'/';await expect.poll(async()=>{try{return(await fetch(url)).status;}catch{return 0;}},{timeout:10000}).toBe(200);
  const context=await browser.newContext({ignoreHTTPSErrors:false});try{
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url+'#benches');await page.locator('#new-workbench-name').fill('QA 延遲負控制');await page.locator('#new-workbench-form button').click();await expect(page.locator('.workbench-detail h1')).toHaveText('QA 延遲負控制');
   await expect.poll(()=>page.evaluate(()=>benchPending)).toBe(0);await page.locator('#m2-field-label').fill('切換金額');await page.locator('#m2-field-type').selectOption('money');await page.locator('#field-add-form button').click();await expect(page.getByLabel('切換金額',{exact:true})).toBeVisible();await expect.poll(()=>page.evaluate(()=>benchPending)).toBe(0);
   await page.evaluate(()=>{const read=NexusStore.readMetaPrefix;NexusStore.readMetaPrefix=async prefix=>{if(prefix==='workbench-template:'){window.qaRequested=true;await new Promise(ok=>window.qaRelease=ok);}return read(prefix);};});
   await page.locator('#save-as-template').click();await page.locator('#dialog-name').fill('QA 延遲範本');await page.getByRole('button',{name:'儲存名稱',exact:true}).click();await expect.poll(()=>page.evaluate(()=>!!window.qaRequested)).toBe(true);
   const focus=await page.getByLabel('切換金額',{exact:true}).evaluate(el=>{el.focus();return document.activeElement===el;});expect(focus).toBe(expectedFocus);await page.keyboard.type('9');const outgoingValue=await page.getByLabel('切換金額',{exact:true}).inputValue();expect(outgoingValue).toBe(expectedFocus?'9':'');await page.evaluate(()=>qaRelease());await expect(page.locator('#template-name')).toHaveValue('QA 延遲範本');expect(errors).toEqual([]);
   return{sha,expectedFocus,observedFocus:focus,outgoingValue,role:expectedFocus?'negative control: old outgoing form remains focusable':'developer verification: candidate blocks outgoing form',passed:true};
  }finally{await context.close();}
 }finally{if(server){server.kill();await new Promise(ok=>server.once('exit',ok));}fs.rmSync(dir,{recursive:true,force:true});}
}
(async()=>{const browser=await chromium.launch(process.env.NEXUS_CHROMIUM?{executablePath:process.env.NEXUS_CHROMIUM,args:['--no-sandbox']}:{});try{const results=[];results.push(await probe('e6f620353c2976f00e7913167d5c4720904c788e',true,browser));results.push(await probe(identity.candidateSha,false,browser));console.log(JSON.stringify({role:'developer validation; independent M2-NAV-01 browser review remains pending',results},null,2));}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
