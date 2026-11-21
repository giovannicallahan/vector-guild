# Hooking the home view into the shell

`game/shell/home.js` and `game/shell/home.css` are finished and tested on their own through
`game/home-preview.html`. Nothing loads them from `game/index.html` yet. These are the edits that make the
wormhole end on the home view instead of the star map. Line references are to the files as they were when
this was written; search for the quoted text.

What changes for the player: wormhole, then the home page (welcome, start/continue button, realm cards,
drop-down of unbuilt realms). The star map is never started and "List view" is never shown. "Replay intro",
"Back up or restore save" and "Collection" are buttons on the home page.

## game/index.html (3 edits)

1. In `<head>`, after `<link rel="stylesheet" href="shell/shell.css">`:

   ```html
   <link rel="stylesheet" href="shell/home.css">
   ```

2. Right after the closing `</div>` of `<div class="vg-stage" id="vg-stage" hidden>`:

   ```html
   <div id="vg-home"></div>
   ```

3. Between the `three.min.js` and `shell.js` script tags:

   ```html
   <script src="shell/home.js"></script>
   ```

Nothing is removed. `#vg-listbtn`, `#vg-replay`, `#vg-card` and the `<main id="vg-list">` list stay in the
file: after the edits below they are only reached if `home.js` failed to load.

## game/shell/shell.js (7 edits)

1. **Add the home helpers.** Directly above `var closeCard=function(){},closeList=function(){},refreshMap=function(){};`:

   ```js
   /* Home view (shell/home.js): what the wormhole leads into. Returns false when home.js did not load. */
   var homeHost=$('vg-home'),homeOn=false;
   function replayIntro(){
     if(reduced||!renderer||contextLost)return;
     root.VGHome.unmount();homeOn=false;stage.hidden=false;resize();startTunnel();start();
     $('vg-skip').focus({preventScroll:true});
   }
   function showHome(){
     if(!root.VGHome||!homeHost)return false;
     var actions=[{label:'Collection',place:'top',href:'collection/index.html'}]; /* set the real page when it exists, or drop this line */
     if(renderer&&!reduced)actions.push({label:'Replay intro',onClick:replayIntro});
     if(canBackup)actions.push({label:'Back up or restore save',onClick:openBackup});
     root.VGHome.mount(homeHost,{realms:REALMS,save:Save,three:forceFlat?null:THREE,actions:actions});
     homeOn=true;list.hidden=true;
     return true;
   }
   ```

   Notes: `reducedMotion` is left out on purpose, so the home view follows the system setting live; pass
   `reducedMotion:reduced` to pin it. `onEnter` is left out, so Enter buttons are plain links to
   `realm.html?realm=<id>`. Actions with `place:'top'` sit beside the XP count; the others sit in a row at
   the bottom of the page. `list.hidden=true` removes the flat list (and its screen-reader copy) while the
   home view is up.

2. **Back handling calls the home view first.** In `window.VectorGuildBack=function(){`, add as the first line:

   ```js
     if(homeOn&&root.VGHome.back())return true;
   ```

   `VGHome.back()` closes the open details panel and returns true, or returns false when none is open; the
   existing lines then close the backup dialog or return false so Back leaves the app. Escape needs no edit:
   the home view closes its own panel on Escape and ignores Escape while a `<dialog>` is open.

3. **Progress refresh.** Replace `function refresh(){buildModels();renderList();refreshMap();showXp()}` with:

   ```js
   function refresh(){buildModels();renderList();refreshMap();showXp();if(homeOn)root.VGHome.refresh()}
   ```

   (This is what updates the home page after "Restore from file".)

4. **No-WebGL path.** In `if(choice.mode==='flat'){`, right after `document.body.classList.add('vg-flat');`:

   ```js
     if(showHome()){document.body.classList.remove('vg-booting');return}
   ```

   The home view then shows its SVG icons. With `?flat=1` it is mounted without three.js.

5. **The wormhole ends on the home view.** In `function startMap(flashIn){`, add as the first line:

   ```js
     if(showHome()){
       var skipHadFocus=document.activeElement===$('vg-skip');
       phase='home';stop();flash.style.opacity='0';stage.hidden=true;
       if(skipHadFocus){var h1=document.getElementById('vgh-title');if(h1)h1.focus({preventScroll:true})}
       return;
     }
   ```

   Every way out of the tunnel already goes through `startMap` (tunnel finished, "Skip intro", reduced motion
   switched on mid-tunnel, context lost mid-tunnel, and the direct start when the intro was already seen), so
   the star map code below this line no longer runs and `#vg-listbtn` is never un-hidden.

6. **Keep the stopped stage stopped.** In `function start(){`, add `homeOn` to the guard:

   ```js
   function start(){if(running||contextLost||listOverlay||homeOn||document.hidden)return;running=true;last=0;raf=requestAnimationFrame(frame)}
   ```

   Without this, coming back to the tab restarts the star-map loop behind the home view.

7. **Context loss while the home view is up.** The shell's own canvas is hidden then, so it must not open the
   list. Replace the two listeners at the end of the file with:

   ```js
   canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();contextLost=true;stop();if(homeOn)return;if(phase==='tunnel')startMap(false);
     if(listOverlay){var hadBack=document.activeElement===listBack;showPaused();if(hadBack)listTitle.focus({preventScroll:true})}else openList(true)},false);
   canvas.addEventListener('webglcontextrestored',function(){contextLost=false;resize();if(homeOn)return;if(listAuto)closeList();else{if(listOverlay)showPaused();start()}},false);
   ```

   (Only `if(homeOn)return;` is new in each. With edit 5 in place the `openList` branch is reached only when
   `home.js` is missing.) The home view handles loss of its own context itself: its cards switch to the SVG
   icons and switch back when the context returns.

## What is now unnecessary

- The star map (`mapFrame`, labels, `#vg-card`, drag to turn) and the "List view" overlay (`openList`,
  `closeList`, `#vg-listbtn`, `#vg-list-back`) are dead code once `home.js` loads. They can be deleted in a
  later clean-up; leaving them costs nothing at run time and keeps a fallback if `home.js` is missing.
- `qa/shell.test.js` has source checks on the list overlay and label placement; they keep passing as long as
  that code is left in. Add `node qa/home.test.js` wherever `node qa/shell.test.js` is run.

## Things to know

- Two WebGL contexts exist while the home view is up: the shell's (stopped, canvas hidden, kept for "Replay
  intro") and the home view's single shared one. `VGHome.unmount()` frees the home view's context before the
  tunnel replays.
- The white flash at the end of the tunnel is cut to the home page directly. If a fade is wanted, fade
  `#vg-home` in with CSS; do not fade the stage, it is hidden.
- The home view is `position:fixed` and scrolls inside itself, so `body.vg-3d{overflow:hidden}` can stay.
- To check after the edits: open `index.html` (intro plays, home appears), reload (home appears at once),
  `index.html?flat=1` (SVG icons), open a card and press Escape, and on Android press Back with a panel open
  (panel closes) and again (app closes).
