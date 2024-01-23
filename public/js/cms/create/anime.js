import { showAlert } from '../../alerts.js';
import { redirectTo } from '../../helper.js';

const spinner = `
                <div class="d-flex justify-content-center">
                  <span class="loader"></span>
                </div>
                `;

const initAdminCreateAnime = async () => {
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
  const createAnimeBtn = document.querySelector('.admin-save-anime-changes');

  const applyChanges = async (data) => {
    createAnimeBtn.innerHTML = spinner;
    try {
      const result = await axios({
        method: 'POST',
        url: `http://127.0.0.1:3000/api/v1/admin/animes/create`,
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
    createAnimeBtn.innerHTML = `<span class="form-btn-text">Create anime</span>`;
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

  image.addEventListener('change', (e) => {
    alert('Image uploaded');
  });
};

export default initAdminCreateAnime;
