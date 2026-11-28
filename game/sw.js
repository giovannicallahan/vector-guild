/* MathCosmos service worker (docs/INSTALL.md). Only the website registers it (install.js); the Android app never does.
   It can only ever add an offline copy; it never stands between the player and the server:
   - NETWORK FIRST for every request. Whatever the server answers is passed on untouched (a new release, a 404).
   - The cache is read only when the network gives no answer at all (offline play after one visit).
   - One cache is one release: it is filled during install only, never while the game runs, and it counts only once
     every file is in it (the DONE entry is written last). If one file fails, the install fails, the cache that was
     being filled is dropped, and the previous worker and its complete cache stay until a later visit succeeds.
   - Older caches are deleted on activate, and only when this release's cache is complete.
   - No skipWaiting: a page that is open keeps the worker, and the offline copy, of the release it was loaded with.
   The save lives in localStorage and is never touched here.
   The block between the two marker lines is written by `node tools/build-sw.js`; qa/install.test.js fails when it is stale. */
/* precache:start */
var VERSION='d680bc3fec17';
var FILES=["app.js","board.js","chapters.js","collection/achievements.js","collection/collection.css","collection/core.js","collection/figures.js","collection/ui.js","concept-lab.js","contracts.js","curriculum.js","daily.css","daily.js","docking.css","docking.js","engage.css","experiment-high.js","experiment-low.js","extra-quests.js","gameplay.js","gen-a.js","gen-b.js","gen-c.js","gen-core.js","gen-d.js","glossary.js","graph-lab.js","handson.css","handson.js","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","install.js","lab3d.js","life.css","life.js","manifest.webmanifest","mira.jpg","next-up.js","reading-links.js","realm.html","realms/calc1/experiments-a.js","realms/calc1/experiments-b.js","realms/calc1/experiments-c.js","realms/calc1/experiments-d.js","realms/calc1/gen-a.js","realms/calc1/gen-b.js","realms/calc1/gen-c.js","realms/calc1/gen-d.js","realms/calc1/missions-a.js","realms/calc1/missions-b.js","realms/calc1/missions-c.js","realms/calc1/missions-d.js","realms/calc1/pack.js","realms/calc1/practice-1.js","realms/calc1/practice-2.js","realms/calc1/practice-3.js","realms/calc1/practice-4.js","realms/calc1/practice-5.js","realms/calc1/practice-6.js","realms/calc1/practice-7.js","realms/calc1/practice-8.js","realms/calc1/variants-a.js","realms/calc1/variants-b.js","realms/calc1/variants-c.js","realms/calc1/variants-d.js","realms/calc2/experiments-a.js","realms/calc2/experiments-b.js","realms/calc2/experiments-c.js","realms/calc2/experiments-d.js","realms/calc2/gen-a.js","realms/calc2/gen-b.js","realms/calc2/gen-c.js","realms/calc2/gen-d.js","realms/calc2/glossary.js","realms/calc2/missions-a.js","realms/calc2/missions-b.js","realms/calc2/missions-c.js","realms/calc2/missions-d.js","realms/calc2/pack.js","realms/calc2/practice-1.js","realms/calc2/practice-2.js","realms/calc2/practice-3.js","realms/calc2/practice-4.js","realms/calc2/practice-5.js","realms/calc2/practice-6.js","realms/calc2/practice-7.js","realms/calc2/practice-8.js","realms/calc2/variants-a.js","realms/calc2/variants-b.js","realms/calc2/variants-c.js","realms/calc2/variants-d.js","realms/calc3/experiments-a.js","realms/calc3/experiments-b.js","realms/calc3/experiments-c.js","realms/calc3/experiments-d.js","realms/calc3/gen-a.js","realms/calc3/gen-b.js","realms/calc3/gen-c.js","realms/calc3/gen-d.js","realms/calc3/glossary.js","realms/calc3/missions-a.js","realms/calc3/missions-b.js","realms/calc3/missions-c.js","realms/calc3/missions-d.js","realms/calc3/pack.js","realms/calc3/practice-1.js","realms/calc3/practice-2.js","realms/calc3/practice-3.js","realms/calc3/practice-4.js","realms/calc3/practice-5.js","realms/calc3/practice-6.js","realms/calc3/practice-7.js","realms/calc3/practice-8.js","realms/calc3/variants-a.js","realms/calc3/variants-b.js","realms/calc3/variants-c.js","realms/calc3/variants-d.js","realms/disc/experiments-a.js","realms/disc/experiments-b.js","realms/disc/experiments-c.js","realms/disc/experiments-d.js","realms/disc/gen-a.js","realms/disc/gen-b.js","realms/disc/gen-c.js","realms/disc/gen-d.js","realms/disc/glossary.js","realms/disc/missions-a.js","realms/disc/missions-b.js","realms/disc/missions-c.js","realms/disc/missions-d.js","realms/disc/pack.js","realms/disc/practice-1.js","realms/disc/practice-2.js","realms/disc/practice-3.js","realms/disc/practice-4.js","realms/disc/practice-5.js","realms/disc/practice-6.js","realms/disc/practice-7.js","realms/disc/practice-8.js","realms/disc/variants-a.js","realms/disc/variants-b.js","realms/disc/variants-c.js","realms/disc/variants-d.js","realms/found/experiments-a.js","realms/found/experiments-b.js","realms/found/experiments-c.js","realms/found/experiments-d.js","realms/found/gen-a.js","realms/found/gen-b.js","realms/found/gen-c.js","realms/found/gen-d.js","realms/found/missions-a.js","realms/found/missions-b.js","realms/found/missions-c.js","realms/found/missions-d.js","realms/found/pack.js","realms/found/practice-1.js","realms/found/practice-2.js","realms/found/practice-3.js","realms/found/practice-4.js","realms/found/practice-5.js","realms/found/practice-6.js","realms/found/practice-7.js","realms/found/practice-8.js","realms/found/variants-a.js","realms/found/variants-b.js","realms/found/variants-c.js","realms/found/variants-d.js","realms/graph/experiments-a.js","realms/graph/experiments-b.js","realms/graph/experiments-c.js","realms/graph/experiments-d.js","realms/graph/gen-a.js","realms/graph/gen-b.js","realms/graph/gen-c.js","realms/graph/gen-d.js","realms/graph/glossary.js","realms/graph/missions-a.js","realms/graph/missions-b.js","realms/graph/missions-c.js","realms/graph/missions-d.js","realms/graph/pack.js","realms/graph/practice-1.js","realms/graph/practice-2.js","realms/graph/practice-3.js","realms/graph/practice-4.js","realms/graph/practice-5.js","realms/graph/practice-6.js","realms/graph/practice-7.js","realms/graph/practice-8.js","realms/graph/variants-a.js","realms/graph/variants-b.js","realms/graph/variants-c.js","realms/graph/variants-d.js","realms/la/pack.js","realms/la/practice-1.js","realms/la/practice-10.js","realms/la/practice-11.js","realms/la/practice-12.js","realms/la/practice-13.js","realms/la/practice-14.js","realms/la/practice-2.js","realms/la/practice-3.js","realms/la/practice-4.js","realms/la/practice-5.js","realms/la/practice-6.js","realms/la/practice-7.js","realms/la/practice-8.js","realms/la/practice-9.js","realms/logic/experiments-a.js","realms/logic/experiments-b.js","realms/logic/experiments-c.js","realms/logic/experiments-d.js","realms/logic/gen-a.js","realms/logic/gen-b.js","realms/logic/gen-c.js","realms/logic/gen-d.js","realms/logic/glossary.js","realms/logic/missions-a.js","realms/logic/missions-b.js","realms/logic/missions-c.js","realms/logic/missions-d.js","realms/logic/pack.js","realms/logic/practice-1.js","realms/logic/practice-2.js","realms/logic/practice-3.js","realms/logic/practice-4.js","realms/logic/practice-5.js","realms/logic/practice-6.js","realms/logic/practice-7.js","realms/logic/practice-8.js","realms/logic/variants-a.js","realms/logic/variants-b.js","realms/logic/variants-c.js","realms/logic/variants-d.js","realms/number/experiments-a.js","realms/number/experiments-b.js","realms/number/experiments-c.js","realms/number/experiments-d.js","realms/number/gen-a.js","realms/number/gen-b.js","realms/number/gen-c.js","realms/number/gen-d.js","realms/number/glossary.js","realms/number/missions-a.js","realms/number/missions-b.js","realms/number/missions-c.js","realms/number/missions-d.js","realms/number/pack.js","realms/number/practice-1.js","realms/number/practice-2.js","realms/number/practice-3.js","realms/number/practice-4.js","realms/number/practice-5.js","realms/number/practice-6.js","realms/number/practice-7.js","realms/number/practice-8.js","realms/number/variants-a.js","realms/number/variants-b.js","realms/number/variants-c.js","realms/number/variants-d.js","realms/packs.js","realms/prob/experiments-a.js","realms/prob/experiments-b.js","realms/prob/experiments-c.js","realms/prob/experiments-d.js","realms/prob/gen-a.js","realms/prob/gen-b.js","realms/prob/gen-c.js","realms/prob/gen-d.js","realms/prob/glossary.js","realms/prob/missions-a.js","realms/prob/missions-b.js","realms/prob/missions-c.js","realms/prob/missions-d.js","realms/prob/pack.js","realms/prob/practice-1.js","realms/prob/practice-2.js","realms/prob/practice-3.js","realms/prob/practice-4.js","realms/prob/practice-5.js","realms/prob/practice-6.js","realms/prob/practice-7.js","realms/prob/practice-8.js","realms/prob/variants-a.js","realms/prob/variants-b.js","realms/prob/variants-c.js","realms/prob/variants-d.js","realms/registry.js","realms/stats/experiments-a.js","realms/stats/experiments-b.js","realms/stats/experiments-c.js","realms/stats/experiments-d.js","realms/stats/gen-a.js","realms/stats/gen-b.js","realms/stats/gen-c.js","realms/stats/gen-d.js","realms/stats/glossary.js","realms/stats/missions-a.js","realms/stats/missions-b.js","realms/stats/missions-c.js","realms/stats/missions-d.js","realms/stats/pack.js","realms/stats/practice-1.js","realms/stats/practice-2.js","realms/stats/practice-3.js","realms/stats/practice-4.js","realms/stats/practice-5.js","realms/stats/practice-6.js","realms/stats/practice-7.js","realms/stats/practice-8.js","realms/stats/variants-a.js","realms/stats/variants-b.js","realms/stats/variants-c.js","realms/stats/variants-d.js","save-store.js","shell/home.css","shell/home.js","shell/shell.css","shell/shell.js","shell/vendor/THREE-LICENSE.txt","shell/vendor/three.min.js","skip.js","slips.js","styles.css","try-first.js","update.css","variants.js","voice/index.js"];
/* precache:end */
var PREFIX='mathcosmos-',CACHE=PREFIX+VERSION;
/* Written into a cache last, when every file of the release is in it. */
var DONE=new URL('precache-complete',self.location.href).href, HOME=new URL('index.html',self.location.href).href;

/* Cache key: the file itself, without ?query or #hash (realm.html?realm=la and ?realm=found are one file). */
function keyFor(url){var u=new URL(url);return u.origin+u.pathname}
function sameOriginGet(req){
  if(req.method!=='GET')return false;
  try{return new URL(req.url).origin===self.location.origin}catch(e){return false}
}
/* The cache with that name, when it holds a whole release; otherwise nothing. Never creates a cache. */
function complete(name){
  return caches.has(name).then(function(there){
    if(!there)return null;
    return caches.open(name).then(function(cache){return cache.match(DONE).then(function(done){return done?cache:null})});
  });
}

self.addEventListener('install',function(e){
  /* Every file, straight from the server (cache:'reload'). All of them or nothing. */
  e.waitUntil(caches.open(CACHE).then(function(cache){
    return Promise.all(FILES.map(function(f){
      var url=new URL(f,self.location.href).href;
      return fetch(new Request(url,{cache:'reload'})).then(function(res){
        if(!res||!res.ok)throw new Error('MathCosmos offline copy: could not download '+f);
        return cache.put(keyFor(url),res);
      });
    })).then(function(){return cache.put(DONE,new Response(VERSION))});
  }).catch(function(err){
    /* Drop what was half filled. A cache that was already complete (the same release, installed before) is kept. */
    var fail=function(){throw err};
    return complete(CACHE).then(function(cache){if(!cache)return caches.delete(CACHE)}).then(fail,fail);
  }));
});

self.addEventListener('activate',function(e){
  var claim=function(){return self.clients.claim()};
  e.waitUntil(complete(CACHE).then(function(cache){
    if(!cache)return; /* cannot happen after a good install; if it does, the older offline copy is left alone */
    return caches.keys().then(function(names){
      return Promise.all(names.map(function(n){if(n.indexOf(PREFIX)===0&&n!==CACHE)return caches.delete(n)}));
    });
  }).then(claim,claim));
});

/* The offline answer for a request, from this release's complete cache only. */
function offline(req){
  return complete(CACHE).then(function(cache){
    if(!cache)return;
    var key=keyFor(req.url);
    if(key===DONE)return;
    return cache.match(key,{ignoreVary:true}).then(function(hit){
      if(hit)return hit;
      /* A folder address ("/vector-guild/") or an unknown page offline: the home page. */
      if(req.mode==='navigate'||/\/$/.test(key))return cache.match(HOME,{ignoreVary:true});
    });
  });
}

self.addEventListener('fetch',function(e){
  var req=e.request;
  if(!sameOriginGet(req))return;
  /* Any answer from the network is the answer. Only a network failure looks in the cache; if that finds nothing,
     the page gets the same failure it would get without a service worker. */
  e.respondWith(fetch(req).catch(function(err){
    var fail=function(){throw err};
    return offline(req).then(function(hit){if(hit)return hit;throw err},fail);
  }));
});
