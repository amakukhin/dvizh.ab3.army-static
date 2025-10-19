window.addEventListener('DOMContentLoaded', () => {
    // Зберігаємо інстанси Swiper для доступу з інших скриптів
    if (!window.__swiperMap) window.__swiperMap = new WeakMap();
    document.querySelectorAll('.swiper--events').forEach((el) => {
      // Захист від повторної ініціалізації (уникаємо колізії з атрибутами Swiper)
      if (el.dataset.cascadeSwiperInit === 'true') return;
      // Debug: ширина контейнера
      try { console.debug('[swiper--events] width=', el.clientWidth); } catch(e) {}

      const swiper = new Swiper(el, {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 40,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        resizeObserver: true,

        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 2,
          },
        },
        navigation: {
          nextEl: el.querySelector('.swiper-btn-next'),
          prevEl: el.querySelector('.swiper-btn-prev'),
        },
      });
  
      // При зміні слайдів — пауза всіх відео (якщо глобальна функція доступна)
      swiper.on('slideChangeTransitionStart', () => {
        if (window.__pauseAllPlyr) {
          try { window.__pauseAllPlyr(); } catch (e) {}
        }
      });
    });

});