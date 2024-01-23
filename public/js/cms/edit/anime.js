import { showAlert } from '../../alerts.js';
import { redirectTo } from '../../helper.js';

const spinner = `
                <div class="d-flex justify-content-center">
                  <span class="loader"></span>
                </div>
                `;

const updateGenres = async (id) => {
  let genres = [];
  try {
    const result = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/admin/anime/${id}/genres`,
    });
    genres = result.data.data;
  } catch (err) {
    console.log('💥 Unable to retrieve genres for the anime from the server');
  }

  genres.forEach((genre) => {
    const checkbox = document.querySelector(`input#${genre.toLowerCase()}`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
};

const initAdminEditAnime = async () => {
  // update checkboxes as checked for the genres of the anime
  const saveChangesBtn = document.querySelector('.admin-save-anime-changes');
  const animeId = saveChangesBtn.getAttribute('data-doc-id');
  await updateGenres(animeId);
  const title = document.querySelector('#title');
  const japaneseTitle = document.querySelector('#japanese');
  const releaseYear = document.querySelector('#release');
  const ageAdvice = document.querySelector('#age');
  const duration = document.querySelector('#duration');
  const statusOngoing = document.querySelector('#ongoing');
  const statusCompleted = document.querySelector('#completed');
  const genresChecks = document.querySelectorAll('.edit-genre-value');
  const authors = document.querySelector('.edit-authors-value');
  const summary = document.querySelector('.edit-summary-value');
  const image = document.querySelector('#image-cover');
  const form = document.querySelector('.edit-user-form');

  // Get an array of checked genres names

  const applyChanges = async (data) => {
    saveChangesBtn.innerHTML = spinner;
    try {
      const result = await axios({
        method: 'PATCH',
        url: `http://127.0.0.1:3000/api/v1/admin/animes/${animeId}`,
        data,
      });
      showAlert('success', result.data.name, [
        result.data.message,
        'Refreshing the page..',
      ]);
      redirectTo('/admin/animes', 2);
    } catch (err) {
      console.log(err);
      showAlert(
        'error',
        err.response.data.name,
        err.response.data.errors
          ? err.response.data.errors
          : err.response.data.message
      );
    }
    saveChangesBtn.innerHTML = `<span class="form-btn-text">Edit anime</span>`;
  };

  form.addEventListener('submit', (e) => {
    const genresDelimited = [...genresChecks]
      .filter((genre) => genre.checked)
      .map((genre) => {
        return genre.value[0].toUpperCase() + genre.value.slice(1);
      })
      .join('-');

    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('japaneseTitle', japaneseTitle.value);
    formData.append('authors', authors.value);
    formData.append('releaseYear', releaseYear.value);
    formData.append('genres', genresDelimited);
    formData.append('ageAdvice', ageAdvice.value);
    formData.append('duration', duration.value);
    formData.append('imageCover', image.files[0]);
    formData.append('summary', summary.value);
    formData.append('status', statusOngoing.checked ? 'Ongoing' : 'Completed');
    applyChanges(formData);
  });

  const imgContainer = document.querySelector(
    '.img-container-edit-anime-admin'
  );
  image.addEventListener('change', (e) => {
    imgContainer.classList.add('uploaded');
  });
};

export default initAdminEditAnime;
