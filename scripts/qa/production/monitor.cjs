'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const sha=b=>createHash('sha256').update(b).digest('hex');
const required=r=>['document','script','stylesheet','font'].includes(r.resourceType());
async function ready(page){await page.evaluate(async()=>{await document.fonts.ready;await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));});}
// One session per test. Install on browser.newContext BEFORE any page/navigation.
// A supplied fetchResponse is exclusively for separately labelled synthetic negative controls.
function createMonitor({info,expected,formal=false,preview=false,capture=false,fetchResponse,control=false}){
 if(fetchResponse&&!control)throw Error('Controlled responses are forbidden in formal product acceptance');
 const contexts=new Map(),pages=new Map(),pending=new Set(),events=[],errors=[],requestIds=new WeakMap();let downloads=0,requests=0;
 const record=(kind,ids,data={})=>events.push({event:kind,...ids,...data});
 const track=p=>{const observed=Promise.resolve(p).catch(e=>{errors.push({kind:'evidence',message:e.message});});pending.add(observed);observed.finally(()=>pending.delete(observed));return observed;};
 async function drain(){while(pending.size)await Promise.all([...pending]);}
 function assertClean(){if(errors.length)throw Error('QA monitor rejected: '+JSON.stringify(errors));}
 async function screenshot(page,ids,label){if(!capture||page.isClosed()||!/^https?:/.test(page.url()))return;await ready(page);await page.screenshot({path:info.outputPath(`${ids.contextId}-${ids.pageId}-${label}.png`),fullPage:true});}
 function installPage(page,cs){if(pages.has(page))return;const ids={contextId:cs.id,pageId:'p'+(pages.size+1)};pages.set(page,ids);record('page-created',ids);
  page.on('pageerror',e=>errors.push({...ids,kind:'pageerror',message:e.message}));
  page.on('response',r=>{if(required(r.request()))record('browser-response',ids,{url:r.url(),status:r.status(),requestId:requestIds.get(r.request())||null});if(required(r.request())&&r.status()>=400)errors.push({...ids,kind:'HTTP',url:r.url(),status:r.status()});});
  page.on('requestfailed',r=>{if(required(r))errors.push({...ids,kind:'requestfailed',url:r.url(),failure:r.failure()});});
  if(capture){page.on('dialog',d=>record('dialog',ids,{type:d.type(),message:d.message()}));page.on('framenavigated',f=>{if(f===page.mainFrame())record('navigation',ids,{url:f.url()});});page.on('download',d=>track((async()=>{const file=info.outputPath(`${ids.contextId}-${ids.pageId}-${String(++downloads).padStart(3,'0')}-${path.basename(d.suggestedFilename())}`);await d.saveAs(file);const bytes=fs.readFileSync(file);record('download',ids,{file:path.basename(file),bytes:bytes.length,sha256:sha(bytes)});})()));}
  const close=page.close.bind(page);page.close=async options=>{await drain();try{await screenshot(page,ids,'before-close');}catch(e){errors.push({...ids,kind:'screenshot',message:e.message});}await close(options);await drain();};
 }
 async function install(context){if(contexts.has(context))return context;const cs={id:'c'+(contexts.size+1),closed:false};contexts.set(context,cs);context.on('page',page=>installPage(page,cs));context.pages().forEach(p=>installPage(p,cs));
  if(formal||preview||control)await context.route('**/*',route=>track((async()=>{
   const request=route.request();if(!/^https?:/.test(request.url())||!required(request))return route.continue();let page;try{page=request.frame().page();}catch{}const ids=pages.get(page)||{contextId:cs.id,pageId:null};const requestId='r'+(++requests);requestIds.set(request,requestId);
   try{const u=new URL(request.url()),root=new URL(expected.site);if(u.origin!==root.origin||!u.pathname.startsWith(root.pathname))throw Error('Unexpected application resource origin: '+request.url());const name=u.pathname.slice(root.pathname.length)||'index.html',entry=expected.assets[name];if(!entry)throw Error('Resource not in exact M: '+name);
    const headers=Object.fromEntries(Object.entries(request.headers()).filter(([k])=>!['if-none-match','if-modified-since'].includes(k.toLowerCase())));headers['cache-control']='no-cache';
    const response=fetchResponse?await fetchResponse(route,{...ids,name}):await route.fetch({headers,maxRetries:0,timeout:30000});const bytes=await response.body(),hash=sha(bytes),file='response-bytes/'+hash+'.bin';fs.mkdirSync(info.outputPath('response-bytes'),{recursive:true});fs.writeFileSync(info.outputPath(file),bytes);
    record(control?'controlled-response':'live-response',ids,{requestId,product:expected.M,url:request.url(),file:name,type:request.resourceType(),status:response.status(),bytes:bytes.length,sha256:hash,expectedSha256:entry.sha256,body:file});
    if(!response.ok())throw Error('Necessary resource HTTP failure: '+name+' '+response.status());if(hash!==entry.sha256)throw Error('Actual production resource differs from M: '+name);
    await route.fulfill({response});
   }catch(e){errors.push({...ids,kind:'asset',url:request.url(),message:e.message});try{await route.abort('failed');}catch(abort){errors.push({...ids,kind:'abort',message:abort.message});}}
  })()));
  const close=context.close.bind(context);context.close=async options=>{if(cs.closed)return;await drain();for(const p of context.pages()){
   try{await screenshot(p,pages.get(p),'final-screen');if((formal||preview)&&p.url().startsWith(expected.site)){const identity=await p.evaluate(()=>({channel:DEPLOYMENT.channel,commit:DEPLOYMENT.commit,version:BRAND.version,db:DATABASE_NAME}));record('identity',pages.get(p),identity);if(JSON.stringify(identity)!==JSON.stringify(expected.identity||{channel:'production',commit:null,version:'3.4.0',db:'nexus-workspace'}))throw Error('Production identity mismatch');}}
   catch(e){errors.push({...pages.get(p),kind:'final-evidence',message:e.message});}
  }await close(options);cs.closed=true;await drain();await report();assertClean();};return context;
 }
 async function report(attach=false){await drain();fs.mkdirSync(info.outputPath('response-bytes'),{recursive:true});const body=JSON.stringify({role:control?'測試工具負控制':'開發者實際驗證',product:expected?.M||null,contexts:[...contexts.values()],pages:[...pages.values()],events,errors},null,2);fs.writeFileSync(info.outputPath('monitor-index.json'),body);if(attach)await info.attach('context-page-monitor-index',{body,contentType:'application/json'});}
 async function finish(){for(const [context,cs]of contexts)if(!cs.closed){try{await context.close();}catch(e){if(!errors.length)errors.push({kind:'close',message:e.message});}}await report(true);assertClean();}
 return{install,finish,drain,assertClean,report,events,errors,ready};
}
module.exports={createMonitor,ready};
