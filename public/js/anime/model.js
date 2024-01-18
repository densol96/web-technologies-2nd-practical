import { POST_REVIEW_API_ROUTE, updateDateFormat } from '../helper.js';

export const state = {
  // For load more functionality
  page: 1,
  reviews: {},
  pagesTotal: {},
  sortBy: 'latest',
  limit: 3,
  curAnimeId: '',
  // Upon sending a post request
  posted: {
    postStatus: {},
    postResultTitle: {},
    postResultMessage: {},
  },
};

export const postReview = async (comment, rating) => {
  const slug = window.location.pathname.slice(7); // exclude /anime/(7 chars)
  try {
    const result = await axios({
      method: 'POST',
      url: POST_REVIEW_API_ROUTE,
      data: {
        comment,
        rating,
        slug, // will sue to id anime
        // user id will come from the cookie on request
      },
    });
    state.posted.postStatus = 'success';
    state.posted.postResultTitle = 'Success!';
    state.posted.postResultMessage = [
      result.data.message,
      'Page is getting refreshed..',
    ];
  } catch (err) {
    state.posted.postStatus = 'error';
    state.posted.postResultTitle = err.response.data.name;
    state.posted.postResultMessage = err.response.data.errors;
  }
};

export const getReviews = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/reviews?sort=${state.sortBy}&page=${state.page}&limit=${state.limit}&userFilter=${state.curAnimeId}`,
    });
    state.reviews = result.data.data;
    updateDateFormat(state.reviews);
  } catch (err) {
    throw err;
  }
};
