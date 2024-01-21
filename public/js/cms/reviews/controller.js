import * as model from './model.js';
import adminReviewsViewer from '../views/reviewsView.js';

const updateState = (pagesTotal) => {
  model.state.pagesTotal = pagesTotal;
};

const adjustPagination = () => {
  if (model.state.pagesTotal > 1) {
    adminReviewsViewer.showPagination();
  } else {
    adminReviewsViewer.hidePagination();
  }

  if (model.state.page === model.state.pagesTotal) {
    adminReviewsViewer.hideNextBtn();
  } else {
    adminReviewsViewer.showNextBtn();
  }

  if (model.state.page === 1) {
    adminReviewsViewer.hidePrevBtn();
  } else {
    adminReviewsViewer.showPrevBtn();
  }
};

const getAndDisplayData = async () => {
  await model.loadReviews();
  adminReviewsViewer.render(model.state.reviews);
  // if (model.state.status === 'error') return;
  adminReviewsViewer.updateCurrentPage(model.state.page);
  adjustPagination();
  adminReviewsViewer.addDeleteBtnsEvent(deleteReview);
};

const sortReviewsBy = async (sortByValue) => {
  model.state.sortBy = sortByValue;
  model.state.page = 1;
  await getAndDisplayData();
};

const showNextPage = async () => {
  model.state.page++;
  await getAndDisplayData();
};

const showPrevPage = async () => {
  model.state.page--;
  await getAndDisplayData();
};

const searchByAuthor = async (searchedUsername) => {
  model.state.page = 1;
  model.state.username = searchedUsername;
  await getAndDisplayData();
};

const showAll = async () => {
  model.state.username = '';
  model.state.page = 1;
  await getAndDisplayData();
};

const deleteReview = async (reviewId) => {
  await model.deleteReview(reviewId);
};

const initAdminReviews = () => {
  // MVC arch implemented by using "publisher-subscriber" approach
  if (!adminReviewsViewer.anyReviews()) return; // if no any reviews on the portal, simply return after displaying the basic msg
  adminReviewsViewer.revealPagesTotal(updateState);
  adminReviewsViewer.addSortByEvent(sortReviewsBy);
  adminReviewsViewer.addNextPageEvent(showNextPage);
  adminReviewsViewer.addPrevPageEvent(showPrevPage);
  adminReviewsViewer.addSearchByUserEvent(searchByAuthor);
  adminReviewsViewer.addShowAllBtnEvent(showAll);
  adminReviewsViewer.addDeleteBtnsEvent(deleteReview);
};

export default initAdminReviews;
