const header = document.querySelector('.header');
const scrollThreshold = 100;

let __headerRafPending = false;
const __updateHeaderOnScroll = () => {
  __headerRafPending = false;
  const scrolled = window.scrollY > scrollThreshold;
  if (scrolled) {
    header.classList.add('scroll');
  } else {
    header.classList.remove('scroll');
  }
};
window.addEventListener('scroll', () => {
  if (__headerRafPending) return;
  __headerRafPending = true;
  requestAnimationFrame(__updateHeaderOnScroll);
}, { passive: true });

document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.getElementById('nav-icon3');
  
  if (burgerMenu) {
      burgerMenu.addEventListener('click', function() {
          this.classList.toggle('burger-menu--open');
          header.classList.toggle('menu-open');
          document.body.classList.toggle('lock');
          document.querySelector('.burger-menu__mobile').classList.toggle('active');
          
      });
  }
});
