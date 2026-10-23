'use strict';
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {createHash} = require('node:crypto');
const commit = process.env.NEXUS_RELEASE_COMMIT;
if (!/^[0-9a-f]{40}$/.test(commit || '')) throw Error('A full release commit SHA is required');
const site = 'https://lrqrll.github.io/practical-thinking-studio/';
const files = execFileSync('git', ['ls-tree', '-r', '--name-only', commit], {encoding: 'utf8'}).trim().split('\n')
  .filter(name => !name.includes('/') && (name === '.nojekyll' || /\.(html|js|css|woff2|txt)$/.test(name)));
(async () => {
  const verified = [];
  // Compare actual published bytes, not just cache query strings or branding.
  for (const name of files) {
    const expected = execFileSync('git', ['show', `${commit}:${name}`], {maxBuffer: 16 * 1024 * 1024});
    const response = await fetch(new URL(name, site));
    if (!response.ok()) throw Error(`Published asset HTTP ${response.status()}: ${name}`);
    const actual = Buffer.from(await response.arrayBuffer());
    if (!actual.equals(expected)) throw Error(`Published asset differs from ${commit}: ${name}`);
    verified.push({name, bytes: actual.length, sha256: createHash('sha256').update(actual).digest('hex')});
  }
  fs.mkdirSync('release-evidence', {recursive: true});
  fs.writeFileSync('release-evidence/assets.json', JSON.stringify({site, commit, checkedAt: new Date().toISOString(), verified}, null, 2));
  console.log(`PASS ${verified.length} published assets match release commit ${commit}`);
})().catch(error => {console.error(error); process.exitCode = 1;});
