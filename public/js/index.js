// NAVIGATION
const navBtn = document.querySelector('.btn-mobile-nav');
const navMenu = document.querySelector('.nav-menu');

navBtn.addEventListener('click', function (e) {
  navMenu.classList.toggle('open');
});

// FOR DIFFERENT ROUTES
import redirectTo from './authforms/redirectTo.js';
import initOverview from './overview/controller.js';
import initAnime from './anime/controller.js';
import initMeReviews from './me/me-reviews/controller.js';
import {
  initSignUp,
  initLogIn,
  initForgotPassword,
  initPasswordReset,
  initLogOut,
} from './authforms/authforms.js';
import { initMeSecurity, initMeSettings } from './me/me.js';

// If user logged in
const logOutBtn = document.querySelector('.logout-btn');
if (logOutBtn) {
  initLogOut(logOutBtn);
}

// Depending on the route
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
} else if (window.location.pathname.startsWith('/password-reset')) {
  initPasswordReset();
} else if (window.location.pathname.startsWith('/me/security')) {
  initMeSecurity();
} else if (window.location.pathname.startsWith('/me/settings')) {
  initMeSettings();
} else if (window.location.pathname.startsWith('/me/reviews')) {
  initMeReviews();
} else {
  alert('Unknown route!');
}
