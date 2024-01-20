import { ME_REVIEWS_API_ROUTE, updateDateFormat } from '../../helper.js';
import { showAlert } from '../../alerts.js';

export const state = {
  page: 1,
  limit: 5,
  pagesTotal: '',
  sortBy: 'latest',
  username: undefined,
  reviews: [],
};

export const loadReviews = async () => {
  try {
    let urlString = `${ME_REVIEWS_API_ROUTE}?sort=${state.sortBy}&page=${state.page}&limit=${state.limit}`;
    if (state.username) {
      urlString += urlString + `&userFilter=${state.username}`;
    }
    const result = await axios({
      method: 'GET',
      url: urlString,
    });
    state.reviews = result.data.data;
    updateDateFormat(state.reviews);
  } catch (err) {
    model.state.reviews = [];
    showAlert('error', err.response.data.name, err.response.data.message);
  }
};
