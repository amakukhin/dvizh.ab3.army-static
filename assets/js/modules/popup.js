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
    // Використовуємо вже наявну в DOM розмітку, яку рендерить PHP-шаблон
    this.popup = document.getElementById('review-popup');
  }

  bindEvents() {
    if (!this.popup) {
      // Якщо попап не підключений у шаблоні, припиняємо ініціалізацію обробників
      return;
    }
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

class RegistrationPopup {
  constructor() {
    this.popup = null;
    this.init();
  }

  init() {
    this.createPopup();
    this.bindEvents();
  }

  createPopup() {
    this.popup = document.getElementById('registration-popup');
  }

  bindEvents() {
    if (!this.popup) return;

    const openBtn = document.querySelector('a[data-popup="registration"]');
    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }
    const closeBtn = this.popup.querySelector('.popup__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.popup.classList.contains('popup--active')) {
        this.close();
      }
    });
    const form = this.popup.querySelector('#registration-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  open() {
    this.popup.classList.add('popup--active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = this.popup.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  close() {
    this.popup.classList.remove('popup--active');
    document.body.style.overflow = '';
    setTimeout(() => this.resetForm(), 300);
  }

  resetForm() {
    const form = this.popup.querySelector('#registration-form');
    if (form) form.reset();
  }

  handleSubmit() {
    const form = this.popup.querySelector('#registration-form');
    if (!form) return;
    const formData = new FormData(form);

    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');

    if (!name || !phone || !email) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }
    console.log('Реєстрація:', { name, phone, email });
    alert('Дякуємо! Ми з вами зв’яжемось.');
    this.close();
  }
}

// Ініціалізуємо попап коли DOM готовий
document.addEventListener('DOMContentLoaded', () => {
  new ReviewPopup();
  new RegistrationPopup();
});
