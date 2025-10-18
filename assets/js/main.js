document.addEventListener('DOMContentLoaded', () => {
  // Ініціалізуємо AOS для intro-ефектів
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1200,
      once: false,
      offset: 0,
      mirror: false,
      easing: 'ease-out-cubic',
    });
    
    // Використовуємо AOSSequence для правильного оновлення
    if (typeof AOSSequence !== 'undefined') {
      setTimeout(() => {
        AOSSequence.refresh();
      }, 100);
    } else {
      // Fallback якщо AOSSequence не завантажився
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }

  // Motion parallax ініціалізується автоматично через motion-parallax.js
});

const __debounce = (fn, wait) => {
  let t;
  return function() {
    const ctx = this, args = arguments;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(ctx, args), wait);
  };
};
// Resize handler для Motion parallax (якщо потрібно)
window.addEventListener('resize', __debounce(() => {
  // Motion parallax автоматично обробляє resize через свій плагін
}, 250));
