/**
 * AOS Sequence Plugin
 * Забезпечує правильну послідовність анімацій AOS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Функція для правильного оновлення AOS
  function refreshAOS() {
    if (typeof AOS !== 'undefined') {
      // Оновлюємо AOS для перерахунку позицій елементів
      AOS.refresh();
      
      // Додаткова перевірка через невелику затримку
      setTimeout(() => {
        AOS.refresh();
      }, 50);
    }
  }

  // Оновлюємо AOS при завантаженні сторінки
  refreshAOS();

  // Оновлюємо AOS при зміні розміру вікна
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      refreshAOS();
    }, 250);
  });

  // Оновлюємо AOS при скролі (якщо потрібно)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      refreshAOS();
    }, 100);
  });

  // Експортуємо функцію для використання ззовні
  window.AOSSequence = {
    refresh: refreshAOS
  };
});
