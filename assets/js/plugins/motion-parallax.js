/**
 * Motion Parallax Plugin
 * Ініціалізує parallax ефекти використовуючи Motion library
 */

// Перевіряємо чи доступна бібліотека Motion
if (typeof Motion === 'undefined') {
  console.warn('Motion library is not loaded. Parallax effects will not work.');
} else {
  
  // Функція для ініціалізації Motion parallax ефектів
  function initMotionParallax() {
    const parallaxElements = document.querySelectorAll('.motion-parallax');
    
    if (parallaxElements.length === 0) {
      return;
    }

    // Перевіряємо налаштування користувача щодо анімацій
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('User prefers reduced motion. Motion parallax disabled.');
      return;
    }

    // Перевіряємо чи AOS встиг ініціалізуватися
    if (typeof AOS !== 'undefined' && !AOS.refresh) {
      console.log('AOS not ready yet, retrying Motion parallax initialization...');
      setTimeout(initMotionParallax, 100);
      return;
    }

    // Додаткова перевірка чи AOSSequence готовий
    if (typeof AOSSequence !== 'undefined') {
      AOSSequence.refresh();
    }

    parallaxElements.forEach(element => {
      const startY = parseFloat(element.dataset.motionYStart) || 0;
      const endY = parseFloat(element.dataset.motionYEnd) || 0;
      const speed = element.dataset.motionSpeed || '1';
      
      // Створюємо анімацію для елемента
      const animation = Motion.animate(
        element,
        {
          y: [startY, endY]
        },
        {
          ease: 'linear',
          // Не встановлюємо duration, бо це scroll-linked анімація
          // Додаємо allowWebkitAcceleration: false щоб уникнути створення нових stacking contexts
          allowWebkitAcceleration: false
        }
      );

      // Прив'язуємо анімацію до скролу
      Motion.scroll(animation, {
        target: element,
        offset: ['start end', 'end start'] // Анімація активна від появи до зникнення елемента
      });

      // Не додаємо додаткові класи щоб не порушити mix-blend-mode
      // element.classList.add('motion-parallax-active');
    });

    console.log(`Motion parallax initialized for ${parallaxElements.length} elements`);
    
    // Діагностика mix-blend-mode
    parallaxElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      console.log(`Element ${index + 1} mix-blend-mode:`, computedStyle.mixBlendMode);
      
      // Перевіряємо батьківські елементи на наявність isolation або transform
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.isolation === 'isolate' || 
            parentStyle.transform !== 'none' || 
            parentStyle.willChange.includes('transform')) {
          console.warn(`Parent element may affect blend mode:`, parent, {
            isolation: parentStyle.isolation,
            transform: parentStyle.transform,
            willChange: parentStyle.willChange
          });
        }
        parent = parent.parentElement;
      }
    });
  }

  // Функція для очищення анімацій (якщо потрібно)
  function destroyMotionParallax() {
    const parallaxElements = document.querySelectorAll('.motion-parallax');
    parallaxElements.forEach(element => {
      // Motion автоматично очищає анімації при видаленні елементів
      // Додаткове очищення не потрібне
    });
  }

  // Ініціалізуємо після завантаження DOM
  document.addEventListener('DOMContentLoaded', () => {
    // Затримка для того, щоб AOS встиг ініціалізуватися та розрахувати позиції
    setTimeout(initMotionParallax, 200);
  });

  // Реініціалізація при зміні розміру вікна (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      destroyMotionParallax();
      initMotionParallax();
    }, 250);
  });

  // Експортуємо функції для можливого використання ззовні
  window.MotionParallax = {
    init: initMotionParallax,
    destroy: destroyMotionParallax
  };
}
