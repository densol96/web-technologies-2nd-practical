import { ALL_ANIME_API_ROUTE } from './helper.js';

export const state = {
  // Starting default values (rendered by server on requesting), but to be maintained
  page: 1,
  sortBy: 'rating',
  // Placeholder for AJAX
  animes: {},
  length: {},
  pagesTotal: {},
};

export const loadAnimes = async () => {
  const response = await fetch(
    `${ALL_ANIME_API_ROUTE}?sort=${state.sortBy}&page=${state.page}`
  );
  const data = await response.json();
  state.animes = data.data;
  state.length = data.length;
};
