import { USERS_API_ROUTE, updateDateFormat, redirectTo } from '../../helper.js';
import { showAlert } from '../../alerts.js';

export const state = {
  page: 1,
  limit: 5,
  pagesTotal: '',
  sortBy: 'newest',
  username: '',
  users: [],
  status: 'success',
};

export const loadUsers = async () => {
  try {
    let urlString = `${USERS_API_ROUTE}?sort=${state.sortBy}&page=${state.page}&limit=${state.limit}`;
    if (state.username) {
      urlString += `&userFilter=${state.username}`;
    }

    const result = await axios({
      method: 'GET',
      url: urlString,
    });
    state.users = result.data.data;
    state.pagesTotal = result.data.pagesTotal;
    state.status = 'success';
    updateDateFormat(state.users);
  } catch (err) {
    state.users = [];
    state.status = 'error';
    state.pagesTotal = 0;
    showAlert('error', err.response.data.name, err.response.data.message);
  }
};
