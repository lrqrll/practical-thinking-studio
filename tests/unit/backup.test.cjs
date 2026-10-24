const {test}=require('node:test');const assert=require('node:assert/strict');const B=require('../../backup-format.js');
const file=(p)=>Object.assign(p.blob,{name:p.name});
test('backup transport uses UTF-8 byte boundaries at 100 MB, including Chinese split across chunks',async()=>{
 for(const size of [B.SINGLE_BYTES-1,B.SINGLE_BYTES,B.SINGLE_BYTES+1]){
  // Chinese characters count as three bytes; transport must not cut them as characters.
  const prefix='中文',value={text:prefix+'x'.repeat(size-Buffer.byteLength(JSON.stringify({text:prefix})))};
  const parts=await B.pack(value);assert.equal(parts.length,size<=B.SINGLE_BYTES?1:7);
  const result=await B.unpack(parts.map(file).reverse());assert.equal(result.text,value.text);
 }
});
test('multipart validation rejects missing, duplicate, mixed and corrupt data before import',async()=>{
 const value={text:'中'.repeat(Math.ceil(B.SINGLE_BYTES/3))};const parts=await B.pack(value),files=parts.map(file);
 await assert.rejects(B.unpack(files.slice(1)),/不齊/);
 await assert.rejects(B.unpack([...files,files[0]]),/重複/);
 const raw=await files[0].text(),line=raw.indexOf('\n'),header=JSON.parse(raw.slice(0,line));header.setId=crypto.randomUUID();const mixed=Object.assign(new Blob([JSON.stringify(header)+'\n',files[0].slice(line+1)]),{name:'mixed.nexuspart'});
 await assert.rejects(B.unpack([mixed,...files.slice(1)]),/不同備份/);
 const corrupt=Object.assign(new Blob([files[0].slice(0,-1),'!']),{name:'corrupt.nexuspart'});await assert.rejects(B.unpack([corrupt,...files.slice(1)]),/損毀/);
 const truncated=Object.assign(files[0].slice(0,-1),{name:'truncated.nexuspart'});await assert.rejects(B.unpack([truncated,...files.slice(1)]),/損毀/);
});
