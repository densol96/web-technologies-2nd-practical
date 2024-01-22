import * as model from './model.js';
import adminUsersViewer from '../views/usersView.js';
import { viewportAdjuster } from '../../helper.js';

const updateState = (pagesTotal) => {
  model.state.pagesTotal = pagesTotal;
};

const adjustPagination = () => {
  console.log(model.state);
  if (model.state.pagesTotal > 1) {
    adminUsersViewer.showPagination();
  } else {
    adminUsersViewer.hidePagination();
  }

  if (model.state.page === model.state.pagesTotal) {
    adminUsersViewer.hideNextBtn();
  } else {
    adminUsersViewer.showNextBtn();
  }

  if (model.state.page === 1) {
    adminUsersViewer.hidePrevBtn();
  } else {
    adminUsersViewer.showPrevBtn();
  }
};

const getAndDisplayData = async () => {
  await model.loadUsers();
  adminUsersViewer.render(model.state.users);
  adminUsersViewer.updateCurrentPage(model.state.page);
  adjustPagination();
  viewportAdjuster();
};

const sortUsersBy = async (sortByValue) => {
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

const searchByUsername = async (searchedUsername) => {
  model.state.page = 1;
  model.state.username = searchedUsername;
  await getAndDisplayData();
};

const showAll = async () => {
  model.state.username = '';
  model.state.page = 1;
  await getAndDisplayData();
};

export const initAdminUsers = () => {
  // MVC arch implemented by using "publisher-subscriber" approach
  document
    .querySelector('#usersMenuOption') //
    .classList.add('current-profile-menu-option');
  if (!adminUsersViewer.anyDocs()) return; // if no any reviews on the portal, simply return after displaying the basic msg
  adminUsersViewer.revealPagesTotal(updateState);
  adminUsersViewer.addSortByEvent(sortUsersBy); //
  adminUsersViewer.addNextPageEvent(showNextPage);
  adminUsersViewer.addPrevPageEvent(showPrevPage);
  adminUsersViewer.addSearchEvent(searchByUsername); //
  adminUsersViewer.addShowAllBtnEvent(showAll);
};
