import animeViewer from './animeViewer.js';
import * as model from './model.js';
import { showAlert } from '../alerts.js';
import redirectTo from '../authforms/redirectTo.js';

const post = async (comment, rating) => {
  await model.postReview(comment, rating);
  showAlert(
    model.state.posted.postStatus,
    model.state.posted.postResultTitle,
    model.state.posted.postResultMessage
  );
  if (model.state.posted.postStatus === 'success') {
    redirectTo(window.location.href, 2);
  }
};

const updateState = (aniID, pagesTotal) => {
  model.state.curAnimeId = aniID;
  model.state.pagesTotal = pagesTotal;
};

const loadMoreSequence = async () => {
  model.state.page++;
  try {
    await model.getReviews();
  } catch (err) {
    showAlert('error', 'Something went wrong..', 'Please, try again later');
  }
};

const initAnime = () => {
  animeViewer.revealState(updateState);
  animeViewer.initSummaryListener();
  animeViewer.initStarsListeners();
  animeViewer.initPostReview(post);
  animeViewer.initLoadCommsListener(loadMoreSequence);
};

export default initAnime;
