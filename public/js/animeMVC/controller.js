import animeViewer from './animeViewer.js';
console.log('TESTING ANIME VIEWER', animeViewer);
const initAnime = () => {
  animeViewer.initSummaryListener();
  animeViewer.initStarsListeners();
};

export default initAnime;
