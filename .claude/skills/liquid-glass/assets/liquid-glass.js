/*!
 * Liquid Glass engine (Apple-style refraction). Framework-agnostic, no dependencies.
 *
 * How it works:
 *  1. For each `.liquid-glass-bend` element, a displacement map (rounded-rect bevel) is
 *     drawn on a canvas and injected as an SVG <filter> (feImage + feDisplacementMap).
 *  2. That filter is applied through `backdrop-filter: url(#id)`, so whatever is BEHIND
 *     the element bends at its rim like a glass lens.
 *  3. ResizeObserver regenerates the map when size changes; MutationObserver auto-picks
 *     up elements added later (React, Vue, Livewire, htmx, Turbo...).
 *
 * Per-element tuning via data attributes on `.liquid-glass-bend`:
 *   data-lg-depth    bevel width in px            (default 10)
 *   data-lg-strength displacement scale           (default 80)
 *   data-lg-yscale   vertical pull 0..1           (default 0.75, lower = less "melting" on top/bottom)
 *
 * Brightness / blur / saturate come from CSS variables (see liquid-glass.css), so
 * light/dark theme switches need no JS.
 *
 * Browser note: SVG filters inside backdrop-filter only work in Chromium (Chrome, Edge,
 * Brave, Opera, Electron). Safari/Firefox get the CSS blur fallback (class `lg-fallback`).
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return; // SSR-safe
  if (window.LiquidGlass) return; // idempotent (double import, HMR)

  var cache = new Map();

  var supportsSvgBackdrop =
    !!window.chrome || /Chrom(e|ium)|Edg\//.test(navigator.userAgent);
  if (!supportsSvgBackdrop) document.documentElement.classList.add('lg-fallback');

  function getContainer() {
    var c = document.getElementById('liquid-glass-svg-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'liquid-glass-svg-container';
      c.setAttribute('aria-hidden', 'true');
      c.style.cssText =
        'width:0;height:0;overflow:hidden;position:absolute;pointer-events:none';
      document.body.appendChild(c);
    }
    return c;
  }

  // Returns "#filter-id". Builds the displacement map once per unique parameter set.
  function getDisplacementFilter(opts) {
    var height = opts.height,
      width = opts.width,
      radius = opts.radius,
      depth = opts.depth,
      strength = opts.strength == null ? 100 : opts.strength,
      yScale = opts.yScale == null ? 0.75 : opts.yScale;

    var cacheKey = [width + 'x' + height, radius, depth, strength, yScale].join('-');
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    // Refraction normals point INWARD. yScale < 1 reduces the vertical pull so top/bottom
    // text "melts" instead of doubling, while the blunt ends keep full horizontal fish-eye.
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    var imgData = ctx.createImageData(width, height);
    var data = imgData.data;

    var cx = width / 2;
    var cy = height / 2;
    var innerW = Math.max(0, width / 2 - radius);
    var innerH = Math.max(0, height / 2 - radius);

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var i = (y * width + x) * 4;
        var px = x - cx;
        var py = y - cy;
        var dx = Math.max(0, Math.abs(px) - innerW);
        var dy = Math.max(0, Math.abs(py) - innerH);
        var d = Math.sqrt(dx * dx + dy * dy);

        if (d > radius) {
          // Outside the rounded rectangle: neutral + transparent
          data[i] = 128;
          data[i + 1] = 128;
          data[i + 2] = 128;
          data[i + 3] = 0;
        } else {
          var nx = 0;
          var ny = 0;
          var distToEdge = radius - d;

          if (distToEdge < depth && d > 0) {
            var t = (depth - distToEdge) / depth;
            var magnitude = t * t; // smooth quadratic bevel

            var outX = (dx / d) * Math.sign(px);
            var outY = (dy / d) * Math.sign(py);
            var capYScale = yScale + (1 - yScale) * (dx / d);

            nx = -outX * magnitude;
            ny = -outY * magnitude * capYScale;
          }

          data[i] = Math.round(nx * 127.5 + 128); // R = X displacement
          data[i + 1] = Math.round(ny * 127.5 + 128); // G = Y displacement
          data[i + 2] = 128;
          data[i + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    var dataUrl = canvas.toDataURL('image/png');
    var filterId = 'displace-' + cacheKey.replace(/[^\w-]/g, '_');

    // Inject SVG into the DOM (not a data: URI) to avoid Chrome backdrop-filter caching bugs.
    if (!document.getElementById(filterId)) {
      getContainer().insertAdjacentHTML(
        'beforeend',
        '<svg height="0" width="0" xmlns="http://www.w3.org/2000/svg"><defs>' +
          '<filter id="' + filterId + '" color-interpolation-filters="sRGB">' +
          '<feImage preserveAspectRatio="none" x="0" y="0" height="' + height +
          '" width="' + width + '" href="' + dataUrl + '" result="displacementMap" />' +
          '<feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="' + strength +
          '" xChannelSelector="R" yChannelSelector="G" />' +
          '</filter></defs></svg>'
      );
    }

    var url = '#' + filterId;
    cache.set(cacheKey, url);
    return url;
  }

  function num(el, attr, fallback) {
    var v = parseFloat(el.getAttribute(attr));
    return isNaN(v) ? fallback : v;
  }

  var resizeObserver = supportsSvgBackdrop
    ? new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          var rect = el.getBoundingClientRect();
          if (!(rect.width > 0 && rect.height > 0)) return; // hidden / not laid out yet

          var radius = Math.min(rect.width / 2, rect.height / 2);
          var br = window.getComputedStyle(el).borderRadius;
          if (br && br.endsWith('px')) {
            var parsed = parseFloat(br);
            if (!isNaN(parsed) && parsed < radius) radius = parsed;
          }

          var filterUrl = getDisplacementFilter({
            height: Math.ceil(rect.height) || 1,
            width: Math.ceil(rect.width) || 1,
            radius: radius,
            depth: num(el, 'data-lg-depth', 10),
            strength: num(el, 'data-lg-strength', 80),
            yScale: num(el, 'data-lg-yscale', 0.75),
          });

          var value =
            "url('" + filterUrl + "') blur(var(--lg-blur, 1.5px)) " +
            'saturate(var(--lg-saturate, 150%)) brightness(var(--lg-brightness, 1.2))';
          el.style.backdropFilter = value;
          el.style.webkitBackdropFilter = value;
        });
      })
    : null;

  function observe(el) {
    if (resizeObserver && el && !el.__lgObserved) {
      el.__lgObserved = true;
      resizeObserver.observe(el);
    }
  }

  function scan(root) {
    (root || document).querySelectorAll('.liquid-glass-bend').forEach(observe);
  }

  function init() {
    scan(document);
    // Auto-pick-up elements added after load (SPA frameworks, partial page updates).
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.classList && n.classList.contains('liquid-glass-bend')) observe(n);
          if (n.querySelectorAll) scan(n);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  window.DisplacementUtils = window.DisplacementUtils || {};
  window.DisplacementUtils.getDisplacementFilter = getDisplacementFilter; // back-compat
  window.LiquidGlass = { observe: observe, scan: scan, getDisplacementFilter: getDisplacementFilter };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
