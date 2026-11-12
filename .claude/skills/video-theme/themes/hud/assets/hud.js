// hud theme helpers. Synchronous + deterministic. Logs SFX events for sfx-synth.mjs.
(function () {
  var sfx = (window.__sfxEvents = window.__sfxEvents || []);
  var NS = "http://www.w3.org/2000/svg";
  var mk = function (parent, cls, text, style) {
    var d = document.createElement("div"); d.className = cls; if (text) d.textContent = text; if (style) d.style.cssText = style; parent.appendChild(d); return d;
  };
  var hash = function (i) { var x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  window.HUD = {
    // Always-on frame built from SCENES: corners, title, timecode + WPM, waveform strip with keyword
    // marks and playhead, last-keyword readout, handle, chapter label per scene.
    frame: function (tl, rootSel, o) {
      var root = document.querySelector(rootSel), sc = o.scenes, D = o.duration;
      ["tl", "tr", "bl", "br"].forEach(function (c) { mk(root, "corner " + c); });
      mk(root, "abs mono t-title", o.title); mk(root, "abs mono t-sub", o.sub || "");
      var code = mk(root, "abs mono t-code", "00:00:00:00");
      var words = sc.scenes.reduce(function (n, s) { return n + s.words.length; }, 0);
      mk(root, "abs mono t-wpm", Math.round(words / (D / 60)) + " WPM");
      var strip = mk(root, "abs strip"), spoken = sc.scenes.reduce(function (a, s) { return a.concat(s.words.map(function (w) { return w[1]; })); }, []);
      for (var i = 0; i < 92; i++) {
        var t = (i / 92) * D, talking = spoken.some(function (w) { return t >= w - 0.05 && t <= w + 0.35; });
        mk(strip, "bar", "", "left:" + (i * 10) + "px;height:" + (talking ? 14 + Math.round(hash(i) * 46) : 4) + "px");
      }
      var keys = sc.scenes.reduce(function (a, s) { return a.concat(s.keys); }, []);
      keys.forEach(function (k) { mk(strip, "mark", "", "left:" + (k.time / D * 920 - 7) + "px"); });
      var head = mk(strip, "playhead");
      tl.fromTo(head, { x: 0 }, { x: 920, duration: D, ease: "none" }, 0);
      var clock = { t: 0 };
      tl.to(clock, { t: D, duration: D, ease: "none", onUpdate: function () {
        var f = Math.floor(clock.t * 30); code.textContent = "00:00:" + pad(Math.floor(f / 30)) + ":" + pad(f % 30);
      } }, 0);
      keys.forEach(function (k, i) { // readout of the latest keyword
        var r = mk(root, "abs mono readout", k.time.toFixed(2).padStart(5, "0") + "s ▸ " + k.word.toUpperCase(), "opacity:0");
        tl.set(r, { opacity: 1 }, k.time); if (keys[i + 1]) tl.set(r, { opacity: 0 }, keys[i + 1].time);
        sfx.push({ type: "blip", t: k.time, gain: 0.5 });
      });
      mk(root, "abs mono handle", o.handle || "");
      sc.scenes.forEach(function (s, i) {
        var c = mk(root, "abs mono chapter", pad(i + 1) + " / " + (o.chapters && o.chapters[i] || s.id).toUpperCase(), "opacity:0");
        tl.set(c, { opacity: 1 }, s.start); if (sc.scenes[i + 1]) tl.set(c, { opacity: 0 }, sc.scenes[i + 1].start);
      });
    },

    // film grain: three fixed noise layers cycled at 12 fps
    grain: function (tl, rootSel, D) {
      var root = document.querySelector(rootSel), layers = [];
      for (var k = 0; k < 3; k++) {
        var s = document.createElementNS(NS, "svg"); s.setAttribute("class", "layer grain"); s.setAttribute("width", 1080); s.setAttribute("height", 1920);
        s.innerHTML = '<filter id="gr' + k + '"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="' + (k * 13 + 5) + '"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1080" height="1920" filter="url(#gr' + k + ')"/>';
        s.style.opacity = 0; root.appendChild(s); layers.push(s);
      }
      for (var i = 0; i < Math.ceil(D * 12); i++) layers.forEach(function (l, j) { tl.set(l, { opacity: j === i % 3 ? 0.22 : 0 }, i / 12); });
    },

    // slice glitch on a cut (~0.2s); the glitch is the exit of the outgoing scene
    glitch: function (tl, sel, at) {
      [["inset(0 0 70% 0)", 30], ["inset(40% 0 30% 0)", -40], ["inset(70% 0 0 0)", 25], ["inset(10% 0 60% 0)", -20], ["inset(0 0 0 0)", 0]].forEach(function (g, i) {
        tl.set(sel, { clipPath: g[0], x: g[1] }, at + i * 0.035);
      });
      tl.set(sel, { opacity: 0, clipPath: "inset(0 0 0 0)", x: 0 }, at + 0.2);
      sfx.push({ type: "glitch", t: at, dur: 0.22 });
    },

    // detection brackets snap onto a box [x, y, w, h] (stage px)
    lockOn: function (tl, rootSel, box, at) {
      var root = document.querySelector(rootSel), x = box[0], y = box[1], w = box[2], h = box[3];
      [[x, y, "3px 0 0 3px", -1, -1], [x + w - 40, y, "3px 3px 0 0", 1, -1], [x, y + h - 40, "0 0 3px 3px", -1, 1], [x + w - 40, y + h - 40, "0 3px 3px 0", 1, 1]].forEach(function (c) {
        var b = mk(root, "bracket", "", "left:" + c[0] + "px;top:" + c[1] + "px;border-width:" + c[2]);
        tl.fromTo(b, { x: c[3] * 60, y: c[4] * 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.22, ease: "back.out(2.4)" }, at);
      });
      sfx.push({ type: "blip", t: at }, { type: "stamp", t: at + 0.2, gain: 0.5 });
    },

    flash: function (tl, sel, at) { tl.fromTo(sel, { opacity: 0.7 }, { opacity: 0, duration: 0.28, ease: "power2.out", immediateRender: false }, at); },

    // typewriter with a caret: text appears char by char at cps
    type: function (tl, sel, text, at, cps) {
      var el = document.querySelector(sel), n = { i: 0 }, rate = cps || 22, dur = text.length / rate;
      el.textContent = "";
      tl.to(n, { i: text.length, duration: dur, ease: "none", onUpdate: function () { el.textContent = text.slice(0, Math.round(n.i)) + "▏"; } }, at);
      sfx.push({ type: "typing", t: at, dur: dur, rate: rate * 0.7 });
    }
  };
})();
