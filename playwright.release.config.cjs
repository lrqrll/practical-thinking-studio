const base = require('./playwright.config.cjs');
const site = 'https://lrqrll.github.io/practical-thinking-studio/';
if (process.env.NEXUS_LIVE_BASE_URL !== site) throw Error('Release acceptance requires the exact production HTTPS URL');
module.exports = {...base, webServer: undefined, retries: 0, use: {...base.use, baseURL: site, ignoreHTTPSErrors: false}};
