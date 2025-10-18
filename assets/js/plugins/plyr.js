document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація Plyr і збирання інстансів
    const selectors = 'video, audio, .plyr__video-embed';
    const players = [];
    let currentPlayer = null;

    document.querySelectorAll(selectors).forEach((el) => {
      const instance = new Plyr(el, {
        youtube: { rel: 0, modestbranding: 1 },
        controls: [
          'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'
        ],
      });
      players.push({ el, instance });

      // Коли будь-який плеєр починає відтворення — зупиняємо попередній активний
      const handleExclusivePlay = () => {
        if (currentPlayer && currentPlayer !== instance) {
          try { currentPlayer.stop(); } catch (eStop) {
            try { currentPlayer.pause(); } catch (e1) {}
            try { currentPlayer.restart(); } catch (e2) {
              try { currentPlayer.seek(0); } catch (e3) {
                try { currentPlayer.currentTime = 0; } catch (e4) {}
              }
            }
          }
        }
        currentPlayer = instance;
        // Дублюючий захист: пауза всіх інших
        players.forEach(({ instance: other }) => {
          if (other !== instance) {
            try { other.stop(); } catch (eStop) {
              try { other.pause(); } catch (e1) {}
            }
          }
        });
      };
      instance.on('play', handleExclusivePlay);
      instance.on('playing', handleExclusivePlay);
    });

    // Допоміжні функції
    // Жорстка зупинка з поверненням до прев'ю (використовується при зміні слайду та перемиканні між відео)
    const pauseAll = () => {
      players.forEach(({ instance }) => {
        try { instance.stop(); } catch (eStop) {
          try { instance.pause(); } catch (e1) {}
          try { instance.restart(); } catch (e2) {
            try { instance.seek(0); } catch (e3) {
              try { instance.currentTime = 0; } catch (e4) {}
            }
          }
        }
      });
      currentPlayer = null;
    };
    // М'яка пауза без скидання до прев'ю (для кліку поза карткою, щоб не миготіла оверлей-кнопка Plyr)
    const pauseAllSoft = () => {
      players.forEach(({ instance }) => {
        try { instance.pause(); } catch (e) {}
      });
      currentPlayer = null;
    };
    // Робимо доступним для інших скриптів (Swiper)
    window.__pauseAllPlyr = pauseAll;

    const getInstanceInCard = (card) => {
      const target = card.querySelector('.plyr__video-embed, video, audio');
      return target && target.plyr ? target.plyr : null;
    };

    // Клік по картці відео: play/pause, при цьому інші — на паузу
    document.querySelectorAll('.card--video').forEach((card) => {
      const section = card.closest('.events');
      if (section) {
        card.addEventListener('mouseenter', () => section.classList.add('is-dim-all'));
        card.addEventListener('mouseleave', () => section.classList.remove('is-dim-all'));
      }
      card.addEventListener('click', (e) => {
        if (e.target.closest('.plyr__controls, .plyr__control--overlaid')) return;

        const inst = getInstanceInCard(card);
        if (!inst) return;

        // Якщо клікнутий слайд не активний — прокручуємо до нього (до конкретної копії слайду у loop), а потім запускаємо відтворення
        const slideEl = card.closest('.swiper-slide');
        const swiperEl = card.closest('.swiper--events');
        if (slideEl && swiperEl) {
          const swiper = (window.__swiperMap && window.__swiperMap.get(swiperEl)) || swiperEl.swiper;
          if (swiper) {
            // Прагнемо перейти саме до цієї DOM-копії (duplicate) у loop-режимі
            const slidesArr = Array.from(swiper.slides);
            const clickedIndex = slidesArr.indexOf(slideEl);
            let didSlide = false;
            if (clickedIndex !== -1 && swiper.activeIndex !== clickedIndex) {
              try { swiper.slideTo(clickedIndex, 400); didSlide = true; } catch (e1) {
                try { swiper.slideToLoop(clickedIndex, 400); didSlide = true; } catch (e2) {}
              }
            } else if (clickedIndex === -1) {
              // Fallback: якщо не знайшли DOM у slides, використовуємо realIndex
              const realIndexAttr = slideEl.getAttribute('data-swiper-slide-index');
              const realIndex = realIndexAttr ? parseInt(realIndexAttr, 10) : null;
              if (realIndex !== null && swiper.realIndex !== realIndex) {
                try { swiper.slideToLoop(realIndex, 400); didSlide = true; } catch (err) {
                  try { swiper.slideTo(realIndex, 400); didSlide = true; } catch (e2) {}
                }
              }
            }
            if (didSlide) {
              // Після завершення прокрутки — беремо активний слайд і граємо його плеєр
              const oncePlay = () => {
                // зупиняємо інші
                players.forEach(({ instance }) => {
                  if (instance !== inst) {
                    try { instance.stop(); } catch (eStop) {
                      try { instance.pause(); } catch (e1) {}
                    }
                  }
                });
                // Взяти активний слайд після переходу та його картку
                let toPlay = inst;
                try {
                  const activeSlide = swiper.slides[swiper.activeIndex];
                  const cardInView = activeSlide ? activeSlide.querySelector('.card--video') : null;
                  const instInView = cardInView ? getInstanceInCard(cardInView) : null;
                  if (instInView) toPlay = instInView;
                } catch (e) {}
                currentPlayer = toPlay;
                try { toPlay.play(); } catch (e3) {}
                swiper.off('slideChangeTransitionEnd', oncePlay);
              };
              swiper.on('slideChangeTransitionEnd', oncePlay);
              return; // не виконуємо нижчий тогл зараз
            }
          }
        }

        // Поставити інші на паузу та обнулити (перемотати на початок) перед відтворенням
        players.forEach(({ instance }) => {
          if (instance !== inst) {
            try { instance.stop(); } catch (eStop) {
              try { instance.pause(); } catch (e1) {}
              try { instance.restart(); } catch (e2) {
                try { instance.seek(0); } catch (e3) {
                  try { instance.currentTime = 0; } catch (e4) {}
                }
              }
            }
          }
        });
        currentPlayer = inst;

        // Тогл стану
        try {
          if (inst.playing) {
            inst.pause();
          } else {
            inst.play();
          }
        } catch (e) {}
      });
    });

    // Клік поза картками — м'яка пауза для всіх (без скидання прев'ю, аби не миготіла кнопка Plyr)
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.card--video')) {
        pauseAllSoft();
      }
    });
  });