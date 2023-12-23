// NAVIGATION
const navBtn = document.querySelector('.btn-mobile-nav');
const navMenu = document.querySelector('.nav-menu');

navBtn.addEventListener('click', function (e) {
  navMenu.classList.toggle('open');
});

// ANIME OR OVERVIEW
import initOverview from './overview/controller.js';
import initAnime from './anime/anime.js';

if (window.location.pathname.startsWith('/overview')) {
  initOverview();
} else if (window.location.pathname.startsWith('/anime')) {
  initAnime();
}
