import { ALL_ANIME_API_ROUTE } from './helper.js';

export const state = {
  page: 1,
  sortBy: 'rating',
  limit: 5,
  animes: {},
  length: {},
  pagesTotal: {},
};

const updateDateFormat = (animes) => {
  animes.forEach((anime) => {
    const date = new Date(anime.addedAt);
    anime.addedAt = `${date}`.slice(0, 21);
  });
};

export const loadAnimes = async () => {
  const response = await fetch(
    `${ALL_ANIME_API_ROUTE}?sort=${state.sortBy}&page=${state.page}&limit=${state.limit}`
  );
  const data = await response.json();
  state.animes = data.data;
  state.length = data.length;
  updateDateFormat(state.animes);
};
