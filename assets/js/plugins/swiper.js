window.addEventListener('DOMContentLoaded', () => {
    // Зберігаємо інстанси Swiper для доступу з інших скриптів
    if (!window.__swiperMap) window.__swiperMap = new WeakMap();
    document.querySelectorAll('.swiper--events').forEach((el) => {
      const swiper = new Swiper(el, {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 40,

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
      window.__swiperMap.set(el, swiper);
      // При зміні слайдів — пауза всіх відео (якщо глобальна функція доступна)
      swiper.on('slideChangeTransitionStart', () => {
        if (window.__pauseAllPlyr) {
          try { window.__pauseAllPlyr(); } catch (e) {}
        }
      });
    });
  });