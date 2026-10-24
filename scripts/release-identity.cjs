'use strict';
const {execFileSync}=require('node:child_process'),fs=require('node:fs');
const target=process.env.RELEASE_TARGET,sha=process.env.RELEASE_SOURCE_SHA;
if(!['preview-3.2.2','production-3.2.2','production-3.3.0'].includes(target)||!(/^[a-f0-9]{40}$/).test(sha||''))throw Error('Unexpected target or source SHA');
const approved=target.endsWith('3.2.2')?'a16250ab4b4a355feef8559e44a278ee023ef889':'25fee3d52f9d8af764b19161479b94027ee8dc44';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
if(git('rev-parse','HEAD')!==sha||git('rev-parse',sha+'^{tree}')!==git('rev-parse',approved+'^{tree}'))throw Error('Source tree does not exactly match the approved head');
let pages;
if(target.startsWith('production-')){
 const api=path=>JSON.parse(execFileSync('gh',['api','repos/lrqrll/practical-thinking-studio/'+path],{encoding:'utf8'}));
 if(api('git/ref/heads/main').object.sha!==sha)throw Error('main differs from the intended release SHA');
 pages=api('pages/builds/latest');if(pages.commit!==sha||pages.status!=='built')throw Error('Pages has not successfully deployed the exact main SHA');
}
fs.mkdirSync('../verification-results',{recursive:true});fs.writeFileSync('../verification-results/identity.json',JSON.stringify({target,sha,approved,approvedTree:git('rev-parse',approved+'^{tree}'),pages:pages&&{commit:pages.commit,status:pages.status},checkedAt:new Date().toISOString()},null,2));
console.log('PASS approved tree and deployment identity',target,sha);
