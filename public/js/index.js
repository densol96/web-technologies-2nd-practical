// NAVIGATION
const navBtn = document.querySelector('.btn-mobile-nav');
const navMenu = document.querySelector('.nav-menu');

navBtn.addEventListener('click', function (e) {
  navMenu.classList.toggle('open');
});

// ASIDE MENU
import { viewportAdjuster } from './helper.js';
viewportAdjuster();

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
// CMS
import { initEditReview } from './edit/review.js';
import initAdminReviews from './cms/reviews/controller.js';

// If user logged in
const logOutBtn = document.querySelector('.logout-btn');
if (logOutBtn) {
  initLogOut(logOutBtn);
}

const URL = window.location.pathname;

// Depending on the route
if (URL.startsWith('/overview')) {
  initOverview();
} else if (URL.startsWith('/anime')) {
  initAnime();
} else if (URL.startsWith('/sign-up')) {
  initSignUp();
} else if (URL.startsWith('/email-confirmation')) {
  redirectTo('/login', 5);
} else if (URL.startsWith('/login')) {
  initLogIn();
} else if (URL.startsWith('/forgot-password')) {
  initForgotPassword();
} else if (URL.startsWith('/password-reset')) {
  initPasswordReset();
} else if (URL.startsWith('/me/')) {
  if (URL.startsWith('/me/security')) {
    initMeSecurity();
  } else if (URL.startsWith('/me/settings')) {
    initMeSettings();
  } else if (URL.startsWith('/me/reviews')) {
    initMeReviews();
  }
} else if (URL.startsWith('/edit/review')) {
  initEditReview();
}
// CMS PART
else if (URL.startsWith('/admin')) {
  if (URL.startsWith('/admin')) {
    if (URL.startsWith('/admin/reviews')) {
      initAdminReviews();
    }
  }
} else {
  alert('Unknown route!');
}
