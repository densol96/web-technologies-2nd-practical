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
