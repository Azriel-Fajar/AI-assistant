// manim-style helpers (3Blue1Brown look). Synchronous + deterministic.
// Needs gsap + MorphSVGPlugin (for transform). Logs soft SFX: "tick" on Write/Create, "chime" on Indicate.
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var sfx = (window.__sfxEvents = window.__sfxEvents || []);
  var SMOOTH = "power2.inOut"; // manim's default rate function
  var els = function (sel) {
    return [].concat(sel).reduce(function (out, s) {
      return out.concat(typeof s === "string" ? Array.prototype.slice.call(document.querySelectorAll(s)) : [s]);
    }, []);
  };
  var shapes = function (sel) {
    return els(sel).reduce(function (o, e) { return o.concat(e.getTotalLength ? [e] : Array.prototype.slice.call(e.querySelectorAll("path,circle,line,polyline,rect"))); }, []);
  };
  if (window.gsap && window.MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);

  window.Manim = {
    SMOOTH: SMOOTH,
    // Write: each glyph's outline drawn, then filled. segs: [[text, color|null], ...]
    write: function (tl, sel, segs, at, per, draw) {
      per = per === undefined ? 0.03 : per; draw = draw || 0.45;
      var el = els(sel)[0], i = 0;
      segs.forEach(function (seg) {
        Array.prototype.forEach.call(seg[0], function (ch) {
          var s = document.createElementNS(NS, "tspan"); s.textContent = ch;
          if (seg[1]) { s.setAttribute("fill", seg[1]); s.setAttribute("stroke", seg[1]); }
          el.appendChild(s);
          if (ch.trim()) {
            tl.fromTo(s, { strokeDasharray: "0 900" }, { strokeDasharray: "900 0", duration: draw, ease: "power1.in" }, at + i * per);
            tl.fromTo(s, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.25, ease: "power1.out" }, at + i * per + draw * 0.6);
          }
          i++;
        });
      });
      sfx.push({ type: "tick", t: at });
      return at + i * per + draw;
    },
    // Create: stroke drawn along each shape
    create: function (tl, sel, at, dur) {
      dur = dur || 0.6;
      shapes(sel).forEach(function (p) {
        var L = p.getTotalLength();
        tl.fromTo(p, { strokeDasharray: L + " " + (L + 20), strokeDashoffset: L + 10 }, { strokeDashoffset: 0, duration: dur, ease: SMOOTH }, at);
      });
      sfx.push({ type: "tick", t: at, gain: 0.7 });
    },
    // GrowArrow: dir "right" | "down"
    growArrow: function (tl, sel, at, dir) {
      var v = dir === "down";
      tl.from(sel, v ? { scaleY: 0, transformOrigin: "50% 0%", duration: 0.4, ease: SMOOTH } : { scaleX: 0, transformOrigin: "0% 50%", duration: 0.4, ease: SMOOTH }, at);
    },
    // Transform: a hidden copy path (style="opacity:0") appears and morphs into target path
    transform: function (tl, copySel, targetSel, at, dur, color) {
      tl.set(copySel, { opacity: 1 }, at - 0.04);
      tl.to(copySel, { morphSVG: targetSel, stroke: color, duration: dur || 0.7, ease: SMOOTH }, at);
    },
    // FadeOut(shift=UP) of a whole scene (scene change)
    fadeOutUp: function (tl, sel, at) { tl.to(sel, { opacity: 0, y: -110, duration: 0.35, ease: "power2.in" }, at); },
    // Indicate: quick scale flash
    indicate: function (tl, sel, at) {
      tl.to(sel, { scale: 1.2, transformOrigin: "50% 50%", duration: 0.2, ease: SMOOTH, yoyo: true, repeat: 1 }, at);
      sfx.push({ type: "chime", t: at });
    },
    // Circumscribe: rectangle drawn around a box (x,y,w,h in svg coords) then faded
    circumscribe: function (tl, svgSel, box, at, color) {
      var r = document.createElementNS(NS, "path"), x = box[0], y = box[1], w = box[2], h = box[3];
      r.setAttribute("d", "M" + x + " " + y + " H" + (x + w) + " V" + (y + h) + " H" + x + " Z");
      r.setAttribute("fill", "none"); r.setAttribute("stroke", color || "#f7d96f"); r.setAttribute("stroke-width", 5);
      els(svgSel)[0].appendChild(r);
      var L = 2 * (w + h);
      tl.fromTo(r, { strokeDasharray: L + " " + (L + 20), strokeDashoffset: L + 10 }, { strokeDashoffset: 0, duration: 0.5, ease: SMOOTH }, at);
      tl.to(r, { opacity: 0, duration: 0.3, ease: SMOOTH }, at + 0.7);
    }
  };
})();
