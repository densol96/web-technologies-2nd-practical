// NAVIGATION
const navBtn = document.querySelector('.btn-mobile-nav');
const navMenu = document.querySelector('.nav-menu');

navBtn.addEventListener('click', function (e) {
  navMenu.classList.toggle('open');
});

// FOR DIFFERENT ROUTES
import initOverview from './overview/controller.js';
import initAnime from './anime/anime.js';
import { initSignUp } from './authforms/authforms.js';

if (window.location.pathname.startsWith('/overview')) {
  initOverview();
} else if (window.location.pathname.startsWith('/anime')) {
  initAnime();
} else if (window.location.pathname.startsWith('/dev-data/signup')) {
  initSignUp();
} else {
  alert('Unknown route!');
}
