import * as model from './model.js';
import adminReviewsViewer from '../views/reviewsView.js';
import { viewportAdjuster } from '../../helper.js';

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
  adminReviewsViewer.updateCurrentPage(model.state.page);
  adminReviewsViewer.addDeleteBtnsEvent(deleteReview);
  adjustPagination();
  viewportAdjuster();
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
  document
    .querySelector('#reviewsMenuOption')
    .classList.add('current-profile-menu-option');
  if (!adminReviewsViewer.anyDocs()) return; // if no any reviews on the portal, simply return after displaying the basic msg
  adminReviewsViewer.revealPagesTotal(updateState);
  adminReviewsViewer.addSortByEvent(sortReviewsBy);
  adminReviewsViewer.addNextPageEvent(showNextPage);
  adminReviewsViewer.addPrevPageEvent(showPrevPage);
  adminReviewsViewer.addSearchEvent(searchByAuthor);
  adminReviewsViewer.addShowAllBtnEvent(showAll);
  adminReviewsViewer.addDeleteBtnsEvent(deleteReview);
};

export default initAdminReviews;
