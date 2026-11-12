// kinetic-type helpers (no footage). Synchronous + deterministic.
// Entrances (slam, swing, stretch, popLetters, drop, slide) live in shared/motion.js.
(function () {
  var sfx = (window.__sfxEvents = window.__sfxEvents || []);
  var P = 1600; // must match .stage perspective

  window.Kinetic = {
    // camera dolly: push from scale 1 to k by moving the 3D world toward the camera.
    // Words at z=0 scale by exactly k; z>0 grow faster, z<0 slower = parallax.
    dolly: function (tl, worldSel, from, to, k) {
      tl.fromTo(worldSel, { z: 0 }, { z: P * (1 - 1 / (k || 1.12)), duration: to - from, ease: "sine.inOut" }, from);
    },
    // word slides along its arc (SVG textPath startOffset, in %)
    arcIn: function (tl, textPathSel, at, fromPct, toPct, snd) {
      tl.fromTo(textPathSel, { attr: { startOffset: (fromPct === undefined ? 100 : fromPct) + "%" } },
        { attr: { startOffset: (toPct || 0) + "%" }, duration: 0.45, ease: "expo.out" }, at);
      if (snd) sfx.push({ type: snd, t: at });
    },
    // liquid-ink wipe: red card floods in from top-right with droplets running ahead (8-10 frames)
    inkWipe: function (tl, cardSel, dropSel, at) {
      tl.fromTo(cardSel, { clipPath: "circle(0px at 100% 0%)" }, { clipPath: "circle(2300px at 100% 0%)", duration: 0.32, ease: "power2.in" }, at);
      Array.prototype.forEach.call(document.querySelectorAll(dropSel), function (d, i) {
        tl.fromTo(d, { x: 0, y: 0, scale: 0 }, { x: -260 - i * 140, y: 300 + i * 220, scale: 1, duration: 0.24, ease: "power2.out" }, at + i * 0.02);
        tl.to(d, { opacity: 0, duration: 0.06 }, at + 0.3);
      });
      sfx.push({ type: "whoosh", t: at + 0.16 });
    },
    // rack focus: blur the given words while focus moves elsewhere, then return
    rack: function (tl, sel, at, hold, px) {
      tl.to(sel, { filter: "blur(" + (px || 9) + "px)", duration: 0.33, ease: "sine.inOut" }, at);
      if (hold) tl.to(sel, { filter: "blur(0px)", duration: 0.33, ease: "sine.inOut" }, at + hold);
    }
  };
})();
