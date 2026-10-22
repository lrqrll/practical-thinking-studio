const base=require('@playwright/test');
const test=base.test.extend({
 page: async({page},use)=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&['document','script','stylesheet','font'].includes(response.request().resourceType()))errors.push(`${response.status()} ${response.url()}`);});
  await use(page);
  base.expect(errors,'uncaught JavaScript exceptions or failed application resources').toEqual([]);
 }
});
module.exports={test,expect:base.expect};
