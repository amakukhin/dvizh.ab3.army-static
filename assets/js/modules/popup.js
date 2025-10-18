// Popup functionality
class ReviewPopup {
  constructor() {
    this.popup = null;
    this.init();
  }

  init() {
    this.createPopup();
    this.bindEvents();
  }

  createPopup() {
    const popupHTML = `
      <div id="review-popup" class="popup">
        <div class="popup__content">
          <button class="popup__close" aria-label="Закрити">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h3 class="popup__title">Залишити відгук</h3>
          <form class="popup__form form__inner" id="review-form">
            <input type="text" name="name" placeholder="Ваше ім'я" class="form__input" required>
            <div class="rating" id="rating">
              <div class="rating__star" data-rating="1">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div class="rating__star" data-rating="2">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div class="rating__star" data-rating="3">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div class="rating__star" data-rating="4">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div class="rating__star" data-rating="5">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
            </div>
            <textarea name="comment" placeholder="Напишіть свій відгук..." class="form__input" rows="5" required></textarea>
            <button type="submit" class="btn btn--default">Відправити відгук</button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);
    this.popup = document.getElementById('review-popup');
  }

  bindEvents() {
    // Кнопка відкриття попапу
    const openBtn = document.querySelector('a[data-popup="review"]');
    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    // Кнопка закриття
    const closeBtn = this.popup.querySelector('.popup__close');
    closeBtn.addEventListener('click', () => {
      this.close();
    });

    // Закриття по кліку на фон
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.close();
      }
    });

    // Закриття по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.popup.classList.contains('popup--active')) {
        this.close();
      }
    });

    // Рейтинг зірок
    this.bindRatingEvents();

    // Відправка форми
    const form = this.popup.querySelector('#review-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  bindRatingEvents() {
    const stars = this.popup.querySelectorAll('.rating__star');
    let currentRating = 0;

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        currentRating = index + 1;
        this.updateRating(currentRating);
      });

      star.addEventListener('mouseenter', () => {
        this.highlightStars(index + 1);
      });
    });

    const ratingContainer = this.popup.querySelector('.rating');
    ratingContainer.addEventListener('mouseleave', () => {
      this.highlightStars(currentRating);
    });
  }

  updateRating(rating) {
    const stars = this.popup.querySelectorAll('.rating__star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('rating__star--active');
      } else {
        star.classList.remove('rating__star--active');
      }
    });
  }

  highlightStars(rating) {
    const stars = this.popup.querySelectorAll('.rating__star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.style.color = '#F6921E';
      } else {
        star.style.color = 'rgba(246, 146, 30, 0.3)';
      }
    });
  }

  open() {
    this.popup.classList.add('popup--active');
    document.body.style.overflow = 'hidden';
    
    // Фокус на першому полі
    setTimeout(() => {
      const firstInput = this.popup.querySelector('input[name="name"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 300);
  }

  close() {
    this.popup.classList.remove('popup--active');
    document.body.style.overflow = '';
    
    // Очистити форму
    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  resetForm() {
    const form = this.popup.querySelector('#review-form');
    form.reset();
    this.updateRating(0);
    
    const stars = this.popup.querySelectorAll('.rating__star');
    stars.forEach(star => {
      star.classList.remove('rating__star--active');
      star.style.color = 'rgba(246, 146, 30, 0.3)';
    });
  }

  handleSubmit() {
    const form = this.popup.querySelector('#review-form');
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const comment = formData.get('comment');
    const rating = this.getCurrentRating();

    if (!name || !comment || !rating) {
      alert('Будь ласка, заповніть всі поля та поставте рейтинг');
      return;
    }

    // Тут можна додати логіку відправки на сервер
    console.log('Відгук:', { name, comment, rating });
    
    // Показуємо повідомлення про успіх
    alert('Дякуємо за ваш відгук!');
    
    // Закриваємо попап
    this.close();
  }

  getCurrentRating() {
    const activeStars = this.popup.querySelectorAll('.rating__star--active');
    return activeStars.length;
  }
}

// Ініціалізуємо попап коли DOM готовий
document.addEventListener('DOMContentLoaded', () => {
  new ReviewPopup();
});
