// VERSION is the app version (kept equal to APP_VERSION and package.json by a test).
// BUILD is the fingerprint of the cached files, written by `npm run release`; a test
// fails when it is stale. Any change therefore yields a new cache, and all modules
// below are cached together so HTML, JS and content stay consistent.
const VERSION = 'v0.9.1';
const BUILD = '032a6de51d';
const PREFIX = `luma:${self.registration.scope}:`;
const CACHE = `${PREFIX}${VERSION}-${BUILD}`;
const ASSETS = [
  './', './index.html', './styles.css',
  './app.js', './core.js', './storage.js', './ui.js', './media.js', './writing.js', './fill.js',
  './views/grammar.js', './views/speaking.js', './views/skills.js', './views/writing.js',
  './data/content.js', './data/library.js', './data/words.js', './data/phrasal.js', './data/vocab.js', './data/grammar.js', './data/grammar-full-1.js', './data/grammar-full-2.js', './data/speaking.js', './data/speaking-models.js',
  './data/words-extra.js', './data/awl.js', './data/expressions.js', './data/toolkit.js', './data/scoring.js', './data/grammar-extra.js', './data/grammar-drills.js', './data/irregular.js', './data/sets.js', './data/build.js', './data/grammar-ref.js', './data/everyday.js',
  './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];
const urls = new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));

self.addEventListener('install', event => {
  // cache:'reload' bypasses the HTTP cache, so a new version is never built from stale files.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([...urls].map(url => new Request(url, { cache: 'reload' })))));
  // No forced skipWaiting: a running lesson keeps its consistent content version.
  // The page asks for the switch after saving, when the learner taps "Güncelle".
});
self.addEventListener('message', event => { if (event.data === 'skip-waiting') self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith(PREFIX)&&name!==CACHE).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET'||!request.url.startsWith(self.registration.scope))return;
  if(!urls.has(request.url)&&request.mode!=='navigate')return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(request);
    if(cached)return cached;
    try{return await fetch(request);}catch(error){
      if(request.mode==='navigate'){const shell=await cache.match(new URL('./index.html',self.registration.scope).href);if(shell)return shell;}
      throw error;
    }
  })());
});
