import * as model from './model.js';
import adminReviewsViewer from '../views/reviewsView.js';

const updateState = (pagesTotal) => {
  model.state.pagesTotal = pagesTotal;
};

const getAndDisplayData = async () => {
  await model.loadReviews();
  adminReviewsViewer.render(model.state.reviews);
  adminReviewsViewer.updateCurrentPage(model.state.page);
};

const sortReviewsBy = async (sortByValue) => {
  model.state.sortBy = sortByValue;
  model.state.page = 1;
  await getAndDisplayData();
};

const showNextPage = async () => {
  model.state.page++;
  await getAndDisplayData();
  adminReviewsViewer.showPrevBtn();
  if (model.state.page === model.state.pagesTotal) {
    adminReviewsViewer.hideNextBtn();
  }
};

const showPrevPage = async () => {
  model.state.page--;
  await getAndDisplayData();
  adminReviewsViewer.showNextBtn();
  if (model.state.page === 1) {
    adminReviewsViewer.hidePrevBtn();
  }
};

const searchByAuthor = async (searchedUsername) => {
  model.state.page = 1;
  model.state.username = searchedUsername;
  await getAndDisplayData();
  // if username = '' => checker for urlString in model evaluates to false (as if undefined)
};

const initAdminReviews = () => {
  // MVC arch implemented by using "publisher-subscriber" approach
  adminReviewsViewer.revealPagesTotal(updateState);
  adminReviewsViewer.addSortByEvent(sortReviewsBy);
  adminReviewsViewer.addNextPageEvent(showNextPage);
  adminReviewsViewer.addPrevPageEvent(showPrevPage);
  adminReviewsViewer.addSearchByUserEvent(searchByAuthor);
};

export default initAdminReviews;
