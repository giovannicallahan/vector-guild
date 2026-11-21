# Install from the website

The website copy of the game (`https://giovannicallahan.github.io/vector-guild/`) can be installed as an app and then
plays offline. The Android app loads the same files from `file://`, where none of this runs.

## Files

| File | Job |
| --- | --- |
| `game/manifest.webmanifest` | Name, icons, colours, `start_url` `./index.html`, `scope` `./`, `display` `standalone`. All paths are relative, so the site can live in any folder. |
| `game/icons/*.png` | 192 and 512 icons, a maskable 512 (the mark sits inside the safe middle), and a 180 icon for iPhone. Drawn by `python3 tools/make-icons.py` (needs Pillow, no network). |
| `game/sw.js` | The service worker. |
| `game/install.js` | Registers the service worker and shows the install button. Loaded at the end of `index.html` and `realm.html`. |
| `tools/build-sw.js` | Writes the precache list and the cache version into `game/sw.js`. |
| `qa/install.test.js` | Checks all of the above. |

## Before every release

```
node tools/build-sw.js
node qa/install.test.js
```

`build-sw.js` lists every file in `game/` (not `home-preview.html`, not `collection/preview.html`, not `sw.js` itself, no
dot files) and hashes their bytes into the cache version. Any change under `game/` makes `sw.js` stale, and
`qa/install.test.js` fails until `build-sw.js` is run again. Run it last, after every other change. The changed
`sw.js` is also what tells a browser that a new release exists.

## Service worker rules

- Registered only when the page is on `https:` (or `http:` on localhost) and the browser has service workers.
- **Network first for every request.** Whatever the server answers is passed on untouched, so a new release is never
  hidden behind an old cache. The cache is read only when the network gives no answer at all.
- **One cache is one release.** Cache name: `mathcosmos-<version>`. It is filled during install only; nothing is written
  into it while the game runs, so files of two releases never end up in one cache.
- **Install is all or nothing.** Every file is downloaded straight from the server. If one fails, the install fails, the
  half-filled cache is dropped, and the previous worker and its complete cache stay. The browser tries again on a later
  visit. A cache counts only once its last entry, `precache-complete`, is written.
- On activate, every other `mathcosmos-*` cache is deleted, and only if the new cache is complete.
- No `skipWaiting`: a page that is open keeps the worker and the offline copy of the release it was loaded with. The new
  worker takes over when every tab and the installed app have been closed. Online, the newest files are served either way.
- Only same-origin `GET` requests are handled. The cache key ignores `?query`, so `realm.html?realm=la` and
  `realm.html?realm=found` share one entry.
- Known limit: on a connection that fails halfway through loading a page, files already loaded from the server can meet
  cached files of the previous release. Reloading when online fixes it. Progress is safe in that case too: the realm page
  writes back the missions it does not know unchanged (`app.js`, "parked").
- The save is not touched. It stays in `localStorage` under the same keys (docs/SAVE-V2.md). An installed copy on the
  same site shares the browser's save on Android and desktop. On iPhone, a Home Screen app keeps its own storage, so
  the player should use "Back up or restore save" to carry progress over.

## The install button

- Browsers that fire `beforeinstallprompt` (Chrome, Edge, Samsung Internet): an "Install MathCosmos" button is added
  to the home page footer actions, next to "Back up or restore save". It is put back whenever the home page is rebuilt.
- iPhone and iPad Safari have no such event: one line is shown instead, "To install: Share, then Add to Home Screen".
- Hidden when the game already runs installed (`display-mode: standalone`), after `appinstalled`, and on `file://`.
- Other browsers (Firefox, desktop Safari) show nothing.

## Not tested here

`qa/install.test.js` runs `sw.js` in Node with stand-ins for the cache and the network; no browser is involved. A real
install on a phone, the installed app's icon and splash screen, an update from one release to the next, and offline play
on a real device need a manual check on the live site after the release is published: in desktop Chrome, DevTools >
Application shows the worker and one complete `mathcosmos-<version>` cache, and the home page and both realms load with
the network set to Offline.
