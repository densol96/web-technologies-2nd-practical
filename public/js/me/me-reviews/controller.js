import * as model from './model.js';
import meReviewsViewer from './viewer.js';

const updateState = (username, total) => {
  model.state.curUsername = username;
  model.state.pagesTotal = total;
};

const deleteReview = async (reviewId) => {
  await model.deleteReview(reviewId);
};

const handleRequestAndDisplay = async () => {
  await model.loadReviews();
  meReviewsViewer.render(model.state.reviews);
  meReviewsViewer.updateCurrentPage(model.state.page);
  meReviewsViewer.deleteBtnEvents(deleteReview);
};

const nextPageAction = async () => {
  model.state.page++;
  await handleRequestAndDisplay();
  if (model.state.page === model.state.pagesTotal) {
    meReviewsViewer.hideNextBtn();
  }
  meReviewsViewer.showPrevBtn();
};

const prevPageAction = async () => {
  model.state.page--;
  await handleRequestAndDisplay();
  if (model.state.page === 1) {
    meReviewsViewer.hidePrevBtn();
  }
  meReviewsViewer.showNextBtn();
};

const initMeReviews = () => {
  meReviewsViewer.revealState(updateState);
  meReviewsViewer.initBtnsEventsListeners(nextPageAction, prevPageAction);
  meReviewsViewer.deleteBtnEvents(deleteReview);
};

export default initMeReviews;
