// Shared motion recipes for every theme. Synchronous + deterministic (HyperFrames rules).
// Each recipe adds tweens to a paused GSAP timeline `tl` at absolute time `at` (seconds).
// Optional `snd`: an SFX event type logged to window.__sfxEvents for
// explainer-video/scripts/sfx-synth.mjs (e.g. "hit", "pop", "whoosh").
(function () {
  var sfxLog = (window.__sfxEvents = window.__sfxEvents || []);
  var els = function (sel) {
    return [].concat(sel).reduce(function (out, s) {
      return out.concat(typeof s === "string" ? Array.prototype.slice.call(document.querySelectorAll(s)) : [s]);
    }, []);
  };
  var log = function (snd, t, extra) { if (snd) sfxLog.push(Object.assign({ type: snd, t: t }, extra || {})); };

  var M = {
    sfx: function (type, t, extra) { log(type, t, extra); },

    // ---- camera ----
    push: function (tl, sel, from, to, s) { tl.fromTo(sel, { scale: 1 }, { scale: s || 1.05, duration: to - from, ease: "sine.inOut" }, from); },
    punch: function (tl, sel, at, s, snd) {
      tl.to(sel, { scale: s || 1.06, duration: 0.14, ease: "power3.out" }, at);
      tl.to(sel, { scale: 1, duration: 0.6, ease: "sine.inOut" }, at + 0.14); log(snd, at);
    },
    shake: function (tl, sel, at, amp, snd) {
      var a = amp || 10;
      [[1, -0.6], [-0.8, 0.5], [0.6, 0.4], [-0.4, -0.3], [0, 0]].forEach(function (o, i) {
        tl.to(sel, { x: o[0] * a, y: o[1] * a, duration: 0.04, ease: "none" }, at + i * 0.04);
      }); log(snd, at);
    },
    rackFocus: function (tl, sel, at, px, dur) { tl.to(sel, { filter: "blur(" + (px || 9) + "px)", duration: dur || 0.33, ease: "sine.inOut" }, at); },
    unfocus: function (tl, sel, at, dur) { tl.to(sel, { filter: "blur(0px)", duration: dur || 0.33, ease: "sine.inOut" }, at); },

    // ---- entrances (kinetic type recipes) ----
    slam: function (tl, sel, at, snd) { // bigger than final, settles with overshoot
      tl.fromTo(sel, { scale: 2.4, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.32, ease: "back.out(2.6)" }, at); log(snd, at);
    },
    swing: function (tl, sel, at, dir, snd) { // door opening toward camera
      var d = dir === "right" ? -1 : 1;
      tl.fromTo(sel, { rotationY: 80 * d, rotationZ: 18 * d, x: -380 * d, opacity: 0, transformPerspective: 1600 },
        { rotationY: 0, rotationZ: 0, x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, at); log(snd, at);
    },
    stretch: function (tl, sel, at, snd) { tl.fromTo(sel, { scaleX: 0.15, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.55, ease: "elastic.out(1, 0.45)" }, at); log(snd, at); },
    drop: function (tl, sel, at, snd) { tl.fromTo(sel, { y: -320, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "power3.out" }, at); log(snd, at); },
    slide: function (tl, sel, at, dir, snd) {
      var d = dir === "right" ? 1 : -1;
      tl.fromTo(sel, { x: 280 * d, rotation: 18 * d, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.22, ease: "expo.out" }, at); log(snd, at);
    },
    fade: function (tl, sel, at) { tl.fromTo(sel, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.14, ease: "power2.out" }, at); },
    // letters of a text element pop in one by one (element text is split into spans once)
    popLetters: function (tl, sel, at, each, snd) {
      els(sel).forEach(function (el) {
        var txt = el.textContent; el.textContent = "";
        var spans = Array.prototype.map.call(txt, function (ch) {
          var s = document.createElement("span"); s.textContent = ch; s.style.display = "inline-block"; if (ch === " ") s.style.width = "0.28em"; el.appendChild(s); return s;
        });
        tl.fromTo(spans, { scale: 0, y: "0.35em", opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "back.out(3)", stagger: each || 0.033 }, at);
      }); log(snd, at);
    },
    // small item lands with squash & stretch
    squash: function (tl, sel, at, snd) {
      tl.to(sel, { scaleY: 0.86, scaleX: 1.1, transformOrigin: "50% 100%", duration: 0.08, ease: "power2.in" }, at);
      tl.to(sel, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1.2, 0.35)" }, at + 0.08); log(snd, at);
    },
    hop: function (tl, sel, at, h) { tl.to(sel, { y: -(h || 18), duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, at); },
    // travel on an arc: x eases evenly, y lifts first then drops (back.in)
    arcTo: function (tl, sel, dx, dy, at, dur, extra) {
      tl.to(sel, Object.assign({ x: dx, duration: dur || 0.45, ease: "power1.inOut" }, extra || {}), at);
      tl.to(sel, { y: dy, duration: dur || 0.45, ease: "back.in(1.8)" }, at);
    },
    // full-frame circular wipe revealing `sel` (clip-path), from a corner
    wipe: function (tl, sel, at, origin, snd) {
      var o = origin || "100% 0%";
      tl.fromTo(sel, { clipPath: "circle(0% at " + o + ")" }, { clipPath: "circle(150% at " + o + ")", duration: 0.32, ease: "power2.in" }, at); log(snd || "whoosh", at);
    },
    // number counts up; fmt(n) -> string
    counter: function (tl, sel, from, to, at, dur, fmt, snd) {
      var el = els(sel)[0], n = { v: from }, f = fmt || function (v) { return Math.round(v).toLocaleString("en-US"); };
      tl.to(n, { v: to, duration: dur || 0.8, ease: "power2.out", onUpdate: function () { el.textContent = f(n.v); } }, at); log(snd, at, { dur: dur || 0.8 });
    },

    // ---- life ----
    // hand-made jitter at 8 fps (fixed offsets, finite)
    boil: function (tl, sel, from, to, amp) {
      var a = amp || 1;
      for (var i = 0; i < Math.floor((to - from) / 0.125); i++)
        tl.set(sel, { x: [1, -1, 0, 1][i % 4] * a, y: [0, 1, -1, 0][i % 4] * a }, from + i * 0.125);
    },
    // gentle idle float (finite yoyo)
    float: function (tl, sel, from, to, dy) {
      var cycles = Math.max(1, Math.floor((to - from) / 0.8));
      tl.to(sel, { y: -(dy || 10), duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: cycles * 2 - 1 }, from);
    },
    // particle puff inside an <svg> layer (deterministic angles)
    puff: function (tl, layerSel, x, y, at, color, n) {
      var g = els(layerSel)[0], NS = "http://www.w3.org/2000/svg", k = n || 10;
      for (var i = 0; i < k; i++) {
        var c = document.createElementNS(NS, "circle"), a = (i / k) * Math.PI * 2 + 0.3, r = 50 + (i % 3) * 30;
        c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 4 + (i % 3) * 2); c.setAttribute("fill", color || "#ffffff"); c.setAttribute("opacity", 0);
        g.appendChild(c);
        tl.fromTo(c, { attr: { cx: x, cy: y }, opacity: 0.8 }, { attr: { cx: x + Math.cos(a) * r, cy: y + Math.sin(a) * r * 0.7 }, opacity: 0, duration: 0.55, ease: "power2.out", immediateRender: false }, at);
      }
    }
  };
  window.Motion = M;
})();
