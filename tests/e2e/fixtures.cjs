const base=require('@playwright/test');
const {createMonitor}=require('../../scripts/qa/production/monitor.cjs');
const test=base.test.extend({
 monitor:[async({browser},use,info)=>{
  const formal=process.env.NEXUS_FORMAL_VERIFY==='1';
  const monitor=createMonitor({info,formal,capture:!!process.env.NEXUS_CAPTURE_EVIDENCE,expected:formal?require('../../test-results/production-expected-assets.json'):undefined});
  const original=browser.newContext;browser.newContext=async(...args)=>{const context=await original.apply(browser,args);await monitor.install(context);return context;};
  try{await use(monitor);}finally{browser.newContext=original;await monitor.finish();}
 },{auto:true}]
});
module.exports={test,expect:base.expect};
