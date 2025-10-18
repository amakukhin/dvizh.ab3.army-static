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
      if (window.Rellax) {
        window.__rellax = new Rellax('.rellax');
      }
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
  if (window.__rellax && typeof window.__rellax.refresh === 'function') {
    window.__rellax.refresh();
  }
}, 150));
