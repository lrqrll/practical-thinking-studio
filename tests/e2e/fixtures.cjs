const base=require('@playwright/test');
const test=base.test.extend({
 page: async({page},use,info)=>{
  const pending=[],events=[];let downloads=0;const capture=!!process.env.NEXUS_CAPTURE_EVIDENCE;
  if(capture){page.on('dialog',d=>events.push({event:'dialog',type:d.type(),message:d.message()}));page.on('framenavigated',f=>{if(f===page.mainFrame())events.push({event:'navigation',url:f.url()});});page.on('download',d=>{pending.push((async()=>{const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');const file=info.outputPath(String(++downloads).padStart(3,'0')+'-'+path.basename(d.suggestedFilename()));await d.saveAs(file);const bytes=fs.readFileSync(file);events.push({event:'download',file:path.basename(file),bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});})());});}

  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&['document','script','stylesheet','font'].includes(response.request().resourceType()))errors.push(`${response.status()} ${response.url()}`);});
  await use(page);
  if(capture){await Promise.all(pending);await page.screenshot({path:info.outputPath('final-screen.png'),fullPage:true});await info.attach('actual-browser-events',{body:JSON.stringify({role:'開發者實際驗證',browser:page.context().browser().version(),url:page.url(),events},null,2),contentType:'application/json'});}
  base.expect(errors,'uncaught JavaScript exceptions or failed application resources').toEqual([]);
 }
});
module.exports={test,expect:base.expect};
