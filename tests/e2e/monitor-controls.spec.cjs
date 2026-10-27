// TEST TOOL NEGATIVE CONTROLS ONLY. These are not production product responses.
const {test,expect}=require('@playwright/test');
const {createMonitor}=require('../../scripts/qa/production/monitor.cjs');
const {createServer}=require('node:http'),{createHash}=require('node:crypto');
for(const mode of ['hash-mismatch','second-page-error','required-resource-failure','normal-second-context'])test('tool control: '+mode,async({browser},info)=>{
 const html=Buffer.from('<!doctype html><meta charset="utf-8"><script src="app.js"></script><p>Synthetic control only</p>'),js=Buffer.from('window.syntheticControlReady=true;');
 const server=createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/app.js'?'application/javascript':'text/html');res.end(req.url==='/app.js'?js:html);});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const site=`http://127.0.0.1:${server.address().port}/`,assets=Object.fromEntries([['index.html',html],['app.js',js]].map(([name,b])=>[name,{sha256:createHash('sha256').update(b).digest('hex')}]));
 const monitor=createMonitor({info,control:true,expected:{M:'synthetic-tool-control-only',site,assets},fetchResponse:async(route,ids)=>{
  if(ids.contextId==='c2'&&ids.name==='app.js'&&mode!=='normal-second-context'&&mode!=='second-page-error')return route.request().frame().page().request.fetch(site+'app.js').then(async r=>({ok:()=>mode!=='required-resource-failure',status:()=>mode==='required-resource-failure'?503:200,body:async()=>mode==='hash-mismatch'?Buffer.from('window.wrongHash=true;'):await r.body()}));
  return route.fetch({maxRetries:0});
 }});
 try{const first=await monitor.install(await browser.newContext({ignoreHTTPSErrors:false}));await(await first.newPage()).goto(site);const second=await monitor.install(await browser.newContext({ignoreHTTPSErrors:false})),page=await second.newPage();await page.goto(site);if(mode==='second-page-error'){await page.evaluate(()=>setTimeout(()=>{throw Error('CONTROL_SECOND_PAGE_UNCAUGHT');},0));await expect.poll(()=>monitor.errors.some(e=>e.kind==='pageerror')).toBe(true);}
  if(mode==='normal-second-context'){await expect(page.locator('p')).toHaveText('Synthetic control only');await monitor.finish();expect(monitor.errors).toEqual([]);}else{await expect(monitor.finish()).rejects.toThrow('QA monitor rejected');expect(monitor.errors.some(e=>e.contextId==='c2'&&e.pageId==='p2')).toBe(true);const text=JSON.stringify(monitor.errors);expect(text).toContain(mode==='hash-mismatch'?'differs from M':mode==='second-page-error'?'CONTROL_SECOND_PAGE_UNCAUGHT':'HTTP failure');}
  await info.attach('expected-control-outcome',{body:JSON.stringify({role:'測試工具負控制，非正式產品缺陷',mode,expectedRejection:mode!=='normal-second-context',errors:monitor.errors},null,2),contentType:'application/json'});
 }finally{await server.close();}
});
