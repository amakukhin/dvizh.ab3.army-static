document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізуємо анімації при скролі
    AOS.init({
      duration: 1200,
      once: true, // анімація тільки один раз
      offset: 40,
      mirror: false,
    });

    // трохи почекай поки AOS відпрацює стартові анімації
    setTimeout(() => {
      var cfg = (typeof window !== 'undefined' && window.__rellaxConfig) ? window.__rellaxConfig : {};
      var sel = (cfg && cfg.selector) ? cfg.selector : '.rellax';
      var opts = (cfg && cfg.options) ? cfg.options : {};
      var minW = Number((cfg && cfg.minWidth) || 0);
      var speedScale = Number((cfg && cfg.speedScale) || 1);
      var speedClamp = Number((cfg && cfg.speedClamp) || 999);
      var prefersReduced = false;
      try { prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) {}

      function applySpeedModifiers() {
        try {
          if (!cfg || !cfg.enforceScale) return; // respect PHP-provided speeds unless explicitly enabled
          var nodes = document.querySelectorAll(sel);
          for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var origAttr = el.getAttribute('data-rellax-speed-original');
            if (origAttr == null) {
              var current = el.getAttribute('data-rellax-speed');
              el.setAttribute('data-rellax-speed-original', current != null ? String(current) : '0');
              origAttr = el.getAttribute('data-rellax-speed-original');
            }
            var raw = Number(origAttr || 0);
            var scaled = raw * speedScale;
            if (scaled > speedClamp) scaled = speedClamp;
            if (scaled < -speedClamp) scaled = -speedClamp;
            el.setAttribute('data-rellax-speed', String(scaled));
          }
        } catch(_) {}
      }

      function hasNoParallaxFlag() {
        try { return typeof URLSearchParams !== 'undefined' && new URLSearchParams(window.location.search).has('no-parallax'); } catch(e) { return false; }
      }

      function canRun() {
        if (prefersReduced) return false;
        if (minW && window.innerWidth < minW) return false;
        if (hasNoParallaxFlag()) return false;
        if (!window.Rellax) return false;
        return true;
      }

      function initRellax() {
        if (!canRun()) return;
        applySpeedModifiers();
        window.__rellax = new Rellax(sel, opts);
        try { document.body.classList.add('parallax-active'); } catch(_) {}
      }

      initRellax();

      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          if (window.__rellax && typeof window.__rellax.destroy === 'function') {
            window.__rellax.destroy();
            window.__rellax = null;
          }
          try { document.body.classList.remove('parallax-active'); } catch(_) {}
        } else {
          initRellax();
        }
      });
    }, 400);
  });

const __debounce = (fn, wait) => {
  let t;
  return function() {
    const ctx = this, args = arguments;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(ctx, args), wait);
  };
};
window.addEventListener('resize', __debounce(() => {
  var cfg = (typeof window !== 'undefined' && window.__rellaxConfig) ? window.__rellaxConfig : {};
  var minW = Number((cfg && cfg.minWidth) || 0);
  var prefersReduced = false;
  try { prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) {}
  var canRunNow = (!prefersReduced) && (!minW || window.innerWidth >= minW);

  if (!canRunNow) {
    if (window.__rellax && typeof window.__rellax.destroy === 'function') {
      window.__rellax.destroy();
      window.__rellax = null;
    }
    try { document.body.classList.remove('parallax-active'); } catch(_) {}
    return;
  }

  if (window.__rellax && typeof window.__rellax.refresh === 'function') {
    window.__rellax.refresh();
  } else if (window.Rellax) {
    // Re-init if previously destroyed due to width/motion
    var sel = (cfg && cfg.selector) ? cfg.selector : '.rellax';
    var opts = (cfg && cfg.options) ? cfg.options : {};
    // Ensure speeds are scaled/clamped on re-init as well
    try {
      if (cfg && cfg.enforceScale) {
        var nodes = document.querySelectorAll(sel);
        var speedScale = Number((cfg && cfg.speedScale) || 1);
        var speedClamp = Number((cfg && cfg.speedClamp) || 999);
        for (var i = 0; i < nodes.length; i++) {
          var el = nodes[i];
          var origAttr = el.getAttribute('data-rellax-speed-original');
          if (origAttr == null) {
            var current = el.getAttribute('data-rellax-speed');
            el.setAttribute('data-rellax-speed-original', current != null ? String(current) : '0');
            origAttr = el.getAttribute('data-rellax-speed-original');
          }
          var raw = Number(origAttr || 0);
          var scaled = raw * speedScale;
          if (scaled > speedClamp) scaled = speedClamp;
          if (scaled < -speedClamp) scaled = -speedClamp;
          el.setAttribute('data-rellax-speed', String(scaled));
        }
      }
    } catch(_) {}
    window.__rellax = new Rellax(sel, opts);
    try { document.body.classList.add('parallax-active'); } catch(_) {}
  }
}, 250));
