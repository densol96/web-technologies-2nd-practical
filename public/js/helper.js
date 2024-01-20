// ANIME
export const ALL_ANIME_API_ROUTE = 'http://127.0.0.1:3000/api/v1/anime/all';

// AUTHENTICATION
export const SIGN_UP_API_ROUTE = 'http://127.0.0.1:3000/api/v1/users/sign-up';
export const LOGIN_API_ROUTE = 'http://127.0.0.1:3000/api/v1/users/login';
export const LOGOUT_API_ROUTE = 'http://127.0.0.1:3000/api/v1/users/logout';
export const FORGOT_PASSWORD_API_ROUTE =
  'http://127.0.0.1:3000/api/v1/users/forgot-password';
export const POST_REVIEW_API_ROUTE = 'http://127.0.0.1:3000/api/v1/post-review';
export const SECURITY_CHANGE_API_ROUTE =
  'http://127.0.0.1:3000/api/v1/me-security';
export const SETTINGS_CHANGE_API_ROUTE =
  'http://127.0.0.1:3000/api/v1/me-settings';
export const ME_REVIEWS_API_ROUTE = 'http://127.0.0.1:3000/api/v1/reviews';
export const SINGLE_REVIEW_API_ROUTE = 'http://127.0.0.1:3000/api/v1/review';

export const updateDateFormat = (array) => {
  array.forEach((el) => {
    const date = new Date(el.addedAt);
    el.addedAt = `${date}`.slice(0, 21);
  });
};

export const redirectTo = (route, waitTimeSec) => {
  const redirectStop = document.querySelector('#err-no-redirect');
  if (redirectStop) return;
  setTimeout(() => {
    window.location.href = route;
  }, 1000 * waitTimeSec);
};

export const viewportAdjuster = () => {
  const main = document.querySelector('main');
  const footer = document.querySelector('.footer');
  const adjuster = () => {
    if (window.innerHeight > document.body.offsetHeight) {
      // Adjust the body
      document.body.style.height = '100vh';
      document.body.style.display = 'flex';
      document.body.style.flexDirection = 'column';
      // Place footer at the bottom of the viewport
      footer.style.marginTop = 'auto';
      // Adjust flex-grow on main
      main.style.flexGrow = '1';
    } else {
      document.body.style.display = 'block';
      document.body.style.height = 'auto';
    }
  };
  const mainLayout = document.querySelector('.main-layout');
  const socialAsideClicker = document.querySelector('.social-aside');
  const socialMenu = document.querySelector('.aside');

  socialAsideClicker?.addEventListener('click', (e) => {
    mainLayout.classList.toggle('openned-menu');
    adjuster();
  });

  window.addEventListener('resize', (e) => {
    adjuster();
  });

  adjuster();
};
