import {
  ME_REVIEWS_API_ROUTE,
  SINGLE_REVIEW_API_ROUTE,
  updateDateFormat,
  redirectTo,
} from '../../helper.js';
import { showAlert } from '../../alerts.js';

export const state = {
  page: 1,
  limit: 5,
  pagesTotal: '',
  sortBy: 'latest',
  username: undefined,
  reviews: [],
  status: 'success',
};

export const loadReviews = async () => {
  try {
    let urlString = `${ME_REVIEWS_API_ROUTE}?sort=${state.sortBy}&page=${state.page}&limit=${state.limit}`;
    if (state.username) {
      urlString += `&userFilter=${state.username}`;
    }

    const result = await axios({
      method: 'GET',
      url: urlString,
    });
    state.reviews = result.data.data;
    state.pagesTotal = result.data.pagesTotal;
    state.status = 'success';
    updateDateFormat(state.reviews);
  } catch (err) {
    state.reviews = [];
    state.status = 'error';
    state.pagesTotal = 0;
    showAlert('error', err.response.data.name, err.response.data.message);
  }
};

export const deleteReview = async (id) => {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `${SINGLE_REVIEW_API_ROUTE}/${id}`,
    });
    showAlert(
      'success',
      'Review deleted',
      `Selected review with the id of ${id} has been deleted`
    );
    redirectTo('/admin/reviews', 1);
  } catch (err) {
    // state.status = 'error';
    // showAlert('error', err.response.data.name, err.response.data.message);
  }
};
