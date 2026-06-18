/* Lumiere - shared interactions. Plain vanilla JS, no dependencies. */
(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var toggle = nav.querySelector('.nav__toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.getAttribute('data-open') === 'true';
        nav.setAttribute('data-open', String(!open));
        toggle.setAttribute('aria-expanded', String(!open));
      });
    }
    // Close drawer when a link is tapped (mobile)
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.setAttribute('data-open', 'false');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Active link highlight ---- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a[href]').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here || (here === 'index.html' && target === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---- Menu tabs ---- */
  var tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    function selectTab(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    }
    tablist.addEventListener('click', function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab) selectTab(tab);
    });
    tablist.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.focus(); selectTab(next); }
    });
  }

  /* ---- Form validation ---- */
  var validators = {
    required: function (v) { return v.trim() !== '' || 'This field is required.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.'; },
    date: function (v) {
      if (!v) return 'Please choose a date.';
      var today = new Date(); today.setHours(0, 0, 0, 0);
      return new Date(v) >= today || 'Date must be today or later.';
    },
    time: function (v) { return v !== '' || 'Please choose a time.'; },
    guests: function (v) {
      var n = Number(v);
      return (n >= 1 && n <= 20) || 'Enter a party size between 1 and 20.';
    }
  };

  function validateField(field) {
    var rules = (field.dataset.validate || '').split(' ').filter(Boolean);
    var errEl = field.parentElement.querySelector('.error');
    for (var i = 0; i < rules.length; i++) {
      var res = validators[rules[i]] ? validators[rules[i]](field.value) : true;
      if (res !== true) {
        field.setAttribute('aria-invalid', 'true');
        if (errEl) errEl.textContent = res;
        return false;
      }
    }
    field.removeAttribute('aria-invalid');
    if (errEl) errEl.textContent = '';
    return true;
  }

  document.querySelectorAll('form[data-validate-form]').forEach(function (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('[data-validate]'));
    var status = form.querySelector('.form__status');

    // Block past dates in the native picker (JS still validates on submit)
    form.querySelectorAll('input[type="date"]').forEach(function (d) {
      d.min = new Date().toISOString().slice(0, 10);
    });

    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validateField(f); });
      f.addEventListener('input', function () {
        if (status && status.dataset.state) { status.dataset.state = ''; status.textContent = ''; }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      fields.forEach(function (f) {
        var valid = validateField(f);
        if (!valid && !firstBad) firstBad = f;
        ok = ok && valid;
      });
      if (!ok) {
        if (status) { status.dataset.state = 'error'; status.textContent = 'Please fix the highlighted fields.'; }
        if (firstBad) firstBad.focus();
        return;
      }
      if (status) {
        status.dataset.state = 'success';
        status.textContent = form.dataset.successMsg ||
          'Thank you. Your request has been received and we will confirm shortly.';
        status.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      form.reset();
    });
  });

  /* ---- Gallery lightbox ---- */
  var grid = document.querySelector('.gallery-grid');
  var box = document.querySelector('.lightbox');
  if (grid && box) {
    var boxImg = box.querySelector('img');
    var boxCap = box.querySelector('.lightbox__cap');
    var lastFocus = null;

    function openBox(src, alt) {
      lastFocus = document.activeElement;
      boxImg.src = src; boxImg.alt = alt || '';
      boxCap.textContent = alt || '';
      box.setAttribute('data-open', 'true');
      box.querySelector('.lightbox__close').focus();
    }
    function closeBox() {
      box.setAttribute('data-open', 'false');
      boxImg.src = '';
      if (lastFocus) lastFocus.focus();
    }
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var img = btn.querySelector('img');
      openBox(img.dataset.full || img.src, img.alt);
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.lightbox__close')) closeBox();
    });
    document.addEventListener('keydown', function (e) {
      if (box.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') { closeBox(); return; }
      // Focus trap: only the close button is focusable, keep focus on it
      if (e.key === 'Tab') {
        e.preventDefault();
        box.querySelector('.lightbox__close').focus();
      }
    });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
