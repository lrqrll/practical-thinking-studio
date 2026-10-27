const base=require('@playwright/test');
const test=base.test.extend({
 page: async({page},use,info)=>{
  const pending=[],events=[];let downloads=0;const capture=!!process.env.NEXUS_CAPTURE_EVIDENCE;
  if(capture){page.on('dialog',d=>events.push({event:'dialog',type:d.type(),message:d.message()}));page.on('framenavigated',f=>{if(f===page.mainFrame())events.push({event:'navigation',url:f.url()});});page.on('download',d=>{pending.push((async()=>{const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');const file=info.outputPath(String(++downloads).padStart(3,'0')+'-'+path.basename(d.suggestedFilename()));await d.saveAs(file);const bytes=fs.readFileSync(file);events.push({event:'download',file:path.basename(file),bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});})());});}

  const errors=[];
  const expected=require('../../test-results/production-expected-assets.json');
  const assetErrors=[];
  await page.context().route('**/*',route=>{
   const task=(async()=>{const request=route.request(),u=new URL(request.url());if(!['http:','https:'].includes(u.protocol)||!['document','script','stylesheet','font'].includes(request.resourceType()))return route.continue();if(!request.url().startsWith(expected.site))throw Error('Unexpected application resource origin: '+request.url());const name=u.pathname.slice(new URL(expected.site).pathname.length)||'index.html',entry=expected.assets[name];if(!entry)throw Error('Application resource not in exact M: '+name);const headers=Object.fromEntries(Object.entries(request.headers()).filter(([k])=>!['if-none-match','if-modified-since'].includes(k.toLowerCase())));headers['cache-control']='no-cache';const response=await route.fetch({headers,maxRetries:0,timeout:30000});if(!response.ok())throw Error('Live production resource failed: '+name+' '+response.status());const bytes=await response.body(),actual=require('node:crypto').createHash('sha256').update(bytes).digest('hex');if(actual!==entry.sha256)throw Error('Actual production resource differs from M: '+name);events.push({event:'verified-live-production-resource-before-render',file:name,sha256:actual});await route.fulfill({response});})();
   const observed=task.catch(async error=>{assetErrors.push(error.message);try{await route.abort('failed');}catch(abortError){assetErrors.push('abort: '+abortError.message);}});pending.push(observed);return observed;
  });
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&['document','script','stylesheet','font'].includes(response.request().resourceType()))errors.push(`${response.status()} ${response.url()}`);});
  await use(page);
  await Promise.all(pending);
  base.expect(await page.evaluate(()=>({channel:DEPLOYMENT.channel,commit:DEPLOYMENT.commit,version:BRAND.version,db:DATABASE_NAME}))).toEqual({channel:'production',commit:null,version:'3.4.0',db:'nexus-workspace'});
  if(capture){await Promise.all(pending);await page.screenshot({path:info.outputPath('final-screen.png'),fullPage:true});await info.attach('actual-browser-events',{body:JSON.stringify({role:'開發者實際驗證',browser:page.context().browser().version(),url:page.url(),events},null,2),contentType:'application/json'});}
  base.expect(assetErrors,'live production asset hash and transport errors').toEqual([]);
  base.expect(errors,'uncaught JavaScript exceptions or failed application resources').toEqual([]);
 }
});
module.exports={test,expect:base.expect};
