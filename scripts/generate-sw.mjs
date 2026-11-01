import {createHash} from 'node:crypto';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {join,relative} from 'node:path';

const dist='dist';
async function files(dir){
  const items=await readdir(dir,{withFileTypes:true});
  const result=[];
  for(const item of items){
    const full=join(dir,item.name);
    if(item.isDirectory())result.push(...await files(full));
    else if(item.isFile()&&item.name!=='sw.js')result.push(relative(dist,full).replaceAll('\\','/'));
  }
  return result;
}
const paths=(await files(dist)).sort();
const digest=createHash('sha256');
for(const name of paths){digest.update(name);digest.update(await readFile(join(dist,name)));}
const version=digest.digest('hex').slice(0,12);
const sw=`const CACHE='sporttrek-v6-${version}';
const PRE_CACHE=${JSON.stringify(paths.map(x=>'./'+x))};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRE_CACHE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sporttrek-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(request.mode==='navigate'){try{const response=await fetch(request);if(response.ok)await cache.put('./index.html',response.clone());return response;}catch{return await cache.match('./index.html')||Response.error();}}const saved=await cache.match(request);if(saved)return saved;try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}catch{return Response.error();}})());});
`;
await writeFile(join(dist,'sw.js'),sw);
console.log(`Offline precache: ${paths.length} files, revision ${version}`);
