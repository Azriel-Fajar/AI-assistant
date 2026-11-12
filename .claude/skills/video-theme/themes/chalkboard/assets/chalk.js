// chalkboard helpers. Synchronous + deterministic. Every stroke logs a "chalk" SFX event.
// Needs gsap; pairs with shared/motion.js for camera, boil, puff, squash, arcs.
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var sfx = (window.__sfxEvents = window.__sfxEvents || []);
  var els = function (sel) {
    return [].concat(sel).reduce(function (out, s) {
      return out.concat(typeof s === "string" ? Array.prototype.slice.call(document.querySelectorAll(s)) : [s]);
    }, []);
  };

  window.Chalk = {
    // chalky edge + grain filter, referenced as filter="url(#chalk)" on board layers
    filter: function () {
      var d = document.createElement("div");
      d.innerHTML = '<svg width="0" height="0" style="position:absolute"><filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency="2.2" seed="3" result="g"/>' +
        '<feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.4 1.3" result="ga"/>' +
        '<feComposite in="d" in2="ga" operator="in"/></filter></svg>';
      document.body.appendChild(d.firstChild);
    },

    // write into an SVG <text>: each glyph outline drawn, then filled. segs: [[text, color|null], ...]
    write: function (tl, sel, segs, at, per, draw) {
      per = per === undefined ? 0.035 : per; draw = draw || 0.3;
      var el = els(sel)[0], i = 0;
      segs.forEach(function (seg) {
        Array.prototype.forEach.call(seg[0], function (ch) {
          var s = document.createElementNS(NS, "tspan"); s.textContent = ch;
          if (seg[1]) { s.setAttribute("fill", seg[1]); s.setAttribute("stroke", seg[1]); }
          el.appendChild(s);
          if (ch.trim()) {
            tl.fromTo(s, { strokeDasharray: "0 700" }, { strokeDasharray: "700 0", duration: draw, ease: "none" }, at + i * per);
            tl.fromTo(s, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.15, ease: "none" }, at + i * per + draw * 0.5);
            sfx.push({ type: "chalk", t: at + i * per, dur: draw * 0.7 });
          }
          i++;
        });
      });
      return at + i * per + draw;
    },

    // draw every <path> inside sel, one after another, time proportional to length
    draw: function (tl, sel, at, dur) {
      dur = dur || 0.5;
      var ps = els(sel).reduce(function (o, e) { return o.concat(e.tagName === "path" ? [e] : Array.prototype.slice.call(e.querySelectorAll("path"))); }, []);
      var L = ps.map(function (p) { return p.getTotalLength(); }), T = L.reduce(function (a, b) { return a + b; }, 0), t = at;
      ps.forEach(function (p, i) {
        var d = dur * L[i] / T;
        tl.fromTo(p, { strokeDasharray: L[i] + " " + (L[i] + 40), strokeDashoffset: L[i] + 20 }, { strokeDashoffset: 0, duration: d, ease: "power1.inOut" }, t);
        t += d;
      });
      sfx.push({ type: "chalk", t: at, dur: dur });
      return at + dur;
    },

    // scene change: eraser sweeps twice (y1, y2 = top px of each pass), old board fades in chalky steps
    erase: function (tl, eraserSel, sceneSel, at, y1, y2) {
      tl.set(eraserSel, { y: y1 }, at);
      tl.fromTo(eraserSel, { x: 0 }, { x: 1450, rotation: -4, duration: 0.2, ease: "power1.in" }, at);
      tl.set(eraserSel, { y: y2 }, at + 0.2);
      tl.to(eraserSel, { x: 0, rotation: 4, duration: 0.2, ease: "power1.out" }, at + 0.21);
      tl.to(sceneSel, { opacity: 0, duration: 0.4, ease: "steps(4)" }, at + 0.02);
      sfx.push({ type: "erase", t: at, dur: 0.2 }, { type: "erase", t: at + 0.21, dur: 0.2 });
    }
  };
})();
