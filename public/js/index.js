// NAVIGATION
const navBtn = document.querySelector('.btn-mobile-nav');
const navMenu = document.querySelector('.nav-menu');

navBtn.addEventListener('click', function (e) {
  navMenu.classList.toggle('open');
});

// FOR DIFFERENT ROUTES
import redirectTo from './authforms/redirectTo.js';
import initOverview from './overview/controller.js';
import initAnime from './anime/anime.js';
import {
  initSignUp,
  initLogIn,
  initForgotPassword,
} from './authforms/authforms.js';

if (window.location.pathname.startsWith('/overview')) {
  initOverview();
} else if (window.location.pathname.startsWith('/anime')) {
  initAnime();
} else if (window.location.pathname.startsWith('/sign-up')) {
  initSignUp();
} else if (window.location.pathname.startsWith('/email-confirmation')) {
  redirectTo('/login', 5);
} else if (window.location.pathname.startsWith('/login')) {
  initLogIn();
} else if (window.location.pathname.startsWith('/forgot-password')) {
  initForgotPassword();
}
// else if () {
// }
else {
  alert('Unknown route!');
}
