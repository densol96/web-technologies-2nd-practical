import * as model from './model.js';
import adminAnimesViewer from '../views/animesView.js';
import { viewportAdjuster } from '../../helper.js';

const updateState = (pagesTotal) => {
  model.state.pagesTotal = pagesTotal;
};

const adjustPagination = () => {
  if (model.state.pagesTotal > 1) {
    adminAnimesViewer.showPagination();
  } else {
    adminAnimesViewer.hidePagination();
  }

  if (model.state.page === model.state.pagesTotal) {
    adminAnimesViewer.hideNextBtn();
  } else {
    adminAnimesViewer.showNextBtn();
  }

  if (model.state.page === 1) {
    adminAnimesViewer.hidePrevBtn();
  } else {
    adminAnimesViewer.showPrevBtn();
  }
};

const deleteAnime = async (id) => {
  await model.deleteAnime(id);
};

const getAndDisplayData = async () => {
  await model.loadAnimes();
  adminAnimesViewer.render(model.state.animes);
  adminAnimesViewer.updateCurrentPage(model.state.page);
  adjustPagination();
  viewportAdjuster();
  adminAnimesViewer.addDeleteBtnsEvent(deleteAnime);
};

const sortAnimesBy = async (sortByValue) => {
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

const slugify = (string) => {
  return string
    .split(' ')
    .map((word) => {
      const lowered = word.toLowerCase();
      return lowered.replace(/[^A-Za-z]/g, '');
    })
    .join('-');
};

const searchByName = async (searchedTitle) => {
  model.state.page = 1;
  model.state.slug = slugify(searchedTitle);
  await getAndDisplayData();
};

const showAll = async () => {
  model.state.slug = '';
  model.state.page = 1;
  await getAndDisplayData();
};

export const initAdminAnimes = () => {
  // MVC arch implemented by using "publisher-subscriber" approach
  document
    .querySelector('#animesMenuOption') //
    .classList.add('current-profile-menu-option');
  if (!adminAnimesViewer.anyDocs()) return; // if no any reviews on the portal, simply return after displaying the basic msg
  adminAnimesViewer.revealPagesTotal(updateState);
  adminAnimesViewer.addSortByEvent(sortAnimesBy); //
  adminAnimesViewer.addNextPageEvent(showNextPage);
  adminAnimesViewer.addPrevPageEvent(showPrevPage);
  adminAnimesViewer.addSearchEvent(searchByName); //
  adminAnimesViewer.addShowAllBtnEvent(showAll);
  adminAnimesViewer.addDeleteBtnsEvent(deleteAnime);
};
