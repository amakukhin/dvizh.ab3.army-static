document.addEventListener('DOMContentLoaded', () => {
  if (!window.Lenis) return;

  const lenis = new Lenis({
    // базові налаштування, можна підкрутити за потреби
    duration: 1,
    smoothWheel: true,
    smoothTouch: true,
  });

  // throttle helper to limit AOS refresh calls
  const throttle = (fn, wait) => {
    let last = 0, timer;
    return function() {
      const now = Date.now();
      const remaining = wait - (now - last);
      const ctx = this, args = arguments;
      if (remaining <= 0) {
        clearTimeout(timer);
        last = now;
        fn.apply(ctx, args);
      } else if (!timer) {
        timer = setTimeout(() => {
          last = Date.now();
          timer = null;
          fn.apply(ctx, args);
        }, remaining);
      }
    };
  };

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // sync AOS with Lenis scroll, but throttle to avoid layout thrash
  if (window.AOS && typeof AOS.refresh === 'function') {
    const refreshAOS = throttle(() => {
      AOS.refresh();
    }, 150);
    lenis.on('scroll', refreshAOS);
  }
  
  // Експортуємо для дебагу в консолі
  window.__lenis = lenis;
});
