import {
  ME_REVIEWS_API_ROUTE,
  SINGLE_REVIEW_API_ROUTE,
  updateDateFormat,
  redirectTo,
} from '../../helper.js';
import { showAlert } from '../../alerts.js';

export const state = {
  page: 1,
  pagesTotal: '',
  reviews: [],
  curUsername: '',
};

export const loadReviews = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: `${ME_REVIEWS_API_ROUTE}?sort=latest&page=${state.page}&limit=3&userFilter=${state.curUsername}`,
    });
    state.reviews = result.data.data;
    updateDateFormat(state.reviews);
  } catch (err) {
    showAlert('error', 'Something went wrong..', [
      'Sorry, our service is temporarily unavailable.. :c',
      'Please, try again later!',
    ]);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `${SINGLE_REVIEW_API_ROUTE}/${reviewId}`,
    });
    showAlert('success', 'Success!', result.data.message);
    redirectTo('/me/reviews', 1);
  } catch (err) {
    showAlert('error', 'Something went wrong..', [
      'Sorry, our service is temporarily unavailable.. :c',
      'Please, try again later!',
    ]);
  }
};
