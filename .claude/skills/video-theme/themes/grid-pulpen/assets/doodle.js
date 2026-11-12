// grid-pulpen motion helpers. Synchronous and deterministic (HyperFrames rules).
// Each helper adds tweens to a paused GSAP timeline `tl` at absolute time `at` (seconds).
(function () {
  var SHAPES = "path,line,polyline,polygon,circle,ellipse,rect";

  // selector string, element, or an array of either -> flat element list
  function els(sel) {
    return [].concat(sel).reduce(function (out, s) {
      return out.concat(typeof s === "string" ? Array.prototype.slice.call(document.querySelectorAll(s)) : [s]);
    }, []);
  }

  // strokes inside sel (or sel itself) in document order
  function strokes(sel) {
    var out = [];
    els(sel).forEach(function (el) {
      if (el.getTotalLength) out.push(el);
      else out = out.concat(Array.prototype.slice.call(el.querySelectorAll(SHAPES)));
    });
    return out;
  }

  var norm = function (w) { return w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""); };

  window.Doodle = {
    // draw strokes one after another; each gets time proportional to its length
    draw: function (tl, sel, at, dur) {
      dur = dur || 0.7;
      var list = strokes(sel);
      var lens = list.map(function (s) { return Math.max(1, s.getTotalLength()); });
      var total = lens.reduce(function (a, b) { return a + b; }, 0);
      var t = at;
      list.forEach(function (s, i) {
        var d = dur * lens[i] / total;
        // dash parked fully before the path start, so round caps don't leave dots
        tl.fromTo(s, { strokeDasharray: lens[i] + " " + (lens[i] + 40), strokeDashoffset: lens[i] + 20 },
          { strokeDashoffset: 0, duration: d, ease: "power1.inOut" }, t);
        t += d;
        // filled shapes (.wash): fill lands only after the outline is drawn
        if (getComputedStyle(s).fill !== "none") tl.fromTo(s, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.25, ease: "none" }, t);
      });
    },

    // reveal text left to right like handwriting
    write: function (tl, sel, at, dur) {
      els(sel).forEach(function (el) {
        var d = dur || Math.min(1.2, Math.max(0.3, el.textContent.trim().length * 0.035));
        // generous negative insets so later .mark circles around words are not clipped
        tl.fromTo(el, { clipPath: "inset(-60% 100% -60% -20%)" },
          { clipPath: "inset(-60% -20% -60% -20%)", duration: d, ease: "none" }, at);
      });
    },

    // small item lands with a slight overshoot
    pop: function (tl, sel, at) {
      tl.fromTo(sel, { scale: 0, rotation: -6, transformOrigin: "50% 50%" },
        { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, at);
    },

    // camera slides to scene `index` on the tall sheet
    pan: function (tl, sheetSel, index, at) {
      tl.to(sheetSel, { y: -1920 * index, duration: 0.6, ease: "power2.inOut" }, at);
    },

    // groups: [{ text, start, end, keys: ["data"] }] -> instant caption lines in boxSel
    captions: function (tl, boxSel, groups) {
      var box = document.querySelector(boxSel);
      groups.forEach(function (g, i) {
        var line = document.createElement("p");
        line.className = "caption";
        line.id = "cap-" + i;
        var keys = (g.keys || []).map(norm);
        g.text.split(/\s+/).forEach(function (w, j) {
          if (j) line.appendChild(document.createTextNode(" "));
          var span = document.createElement("span");
          span.textContent = w;
          if (keys.indexOf(norm(w)) !== -1) span.className = "key";
          line.appendChild(span);
        });
        box.appendChild(line);
        tl.set(line, { opacity: 1 }, g.start);
        tl.set(line, { opacity: 0 }, g.end);
      });
    }
  };
})();
