const {expect}=require('@playwright/test');
async function home(page){await page.goto(process.env.NEXUS_M2_SITE_URL+'#work');await expect(page.locator('#new-file-type')).toBeVisible();await expect.poll(()=>page.locator('#main').evaluate(el=>el.inert)).toBe(false);}
async function create(page,type){await home(page);await page.locator('#new-file-type').selectOption(type);await expect(page.locator('#rename-current')).toBeVisible();if(type==='document')await expect(page.locator('#document-controls')).toBeEnabled();await expect.poll(()=>page.locator('#main').evaluate(el=>el.inert)).toBe(false);}
async function saved(page){await page.evaluate(()=>flush());await expect(page.locator('#save-status')).toHaveText('已保存至此瀏覽器');}
async function documentSelect(page){await page.locator('#document-editor [contenteditable=true]').focus();await page.keyboard.press('ControlOrMeta+a');}
module.exports={home,create,saved,documentSelect};
