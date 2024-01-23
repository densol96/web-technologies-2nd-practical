import {
  ADMIN_ANIME_API_ROUTE,
  updateDateFormat,
  redirectTo,
} from '../../helper.js';
import { showAlert } from '../../alerts.js';

export const state = {
  page: 1,
  limit: 5,
  pagesTotal: '',
  sortBy: 'latest',
  slug: '',
  animes: [],
  status: 'success',
};

export const loadAnimes = async () => {
  try {
    let urlString = `${ADMIN_ANIME_API_ROUTE}?sort=${state.sortBy}&page=${state.page}&limit=${state.limit}`;
    if (state.slug) {
      urlString += `&slugFilter=${state.slug}`;
    }

    const result = await axios({
      method: 'GET',
      url: urlString,
    });
    console.log(result);
    state.animes = result.data.data;
    state.pagesTotal = result.data.pagesTotal;
    state.status = 'success';
    updateDateFormat(state.animes);
  } catch (err) {
    console.log(err);
    state.animes = [];
    state.status = 'error';
    state.pagesTotal = 0;
    showAlert('error', err.response.data.name, err.response.data.message);
  }
};

export const deleteAnime = async (id) => {
  try {
    const result = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/admin/animes/${id}`,
    });
    showAlert(
      'success',
      'Anime deleted',
      `Selected anime with the id of ${id} has been deleted`
    );
    redirectTo('/admin/animes', 2);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.name, err.response.data.message);
  }
};
